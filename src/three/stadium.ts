import * as THREE from "three";
import { beamGeometry, beamMaterial, beat, clamp01, createRenderer, easeInOut } from "./core";

/*
 * Le Félicia, en volume. 30 000 points = 30 000 personnes.
 * Défilement : poussière en profondeur → le chiffre « 30 000 » → la caméra s'envole et le chiffre se disperse
 * dans les gradins d'un stade en 3D, la fosse face à la scène rouge. À la fin : projecteurs, flashs de
 * téléphones, et la fosse qui saute au rythme réel de l'extrait en cours d'écoute (--beat).
 * Tout le mouvement des points est calculé dans le vertex shader : un seul appel de dessin.
 */

const FONT = '"Bodoni Moda Variable", "Didot", serif';

type Opts = { people: number; stage: number };

export function mountStadium(canvas: HTMLCanvasElement, { people, stage }: Opts) {
  const N = people + stage;
  const renderer = createRenderer(canvas, { maxDpr: 2 });
  const scene = new THREE.Scene();
  scene.fog = null;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);

  // --- attributs ----------------------------------------------------------
  const geo = new THREE.BufferGeometry();
  const aS = new Float32Array(N * 3); // poussière
  const aT = new Float32Array(N * 3); // chiffre
  const aD = new Float32Array(N * 3); // stade
  const aR = new Float32Array(N * 4); // délais, aléa, type
  for (let i = 0; i < N; i++) {
    aS[i * 3] = (Math.random() - 0.5) * 26;
    aS[i * 3 + 1] = (Math.random() - 0.5) * 16;
    aS[i * 3 + 2] = -14 + Math.random() * 20;
    aR[i * 4] = Math.random() * 0.35;
    aR[i * 4 + 1] = Math.random() * 0.4;
    aR[i * 4 + 2] = Math.random();
    aR[i * 4 + 3] = i >= people ? 3 : i < people * 0.3 ? 4 + (i % 3) : i % 3; // 0-2 gradins, 3 scène, 4-6 fosse
  }
  geo.setAttribute("position", new THREE.BufferAttribute(aT, 3));
  geo.setAttribute("aS", new THREE.BufferAttribute(aS, 3));
  geo.setAttribute("aD", new THREE.BufferAttribute(aD, 3));
  geo.setAttribute("aR", new THREE.BufferAttribute(aR, 4));

  // le stade : pelouse elliptique, scène côté -X, fosse dense vers la scène, 26 rangées de gradins
  const A = 3.6, B = 2.35;
  const stadium = () => {
    for (let i = 0; i < N; i++) {
      let x = 0, y = 0, z = 0;
      if (i >= people) {
        const k = i - people;
        if (k < stage * 0.62) {
          // écran géant : un mur de points
          x = -A * 0.98 + Math.random() * 0.04;
          y = 0.08 + Math.random() * 1.05;
          z = (Math.random() - 0.5) * 2.1;
        } else {
          // plateau
          x = -A * 0.98 + Math.random() * 0.42;
          y = 0.12 + Math.random() * 0.03;
          z = (Math.random() - 0.5) * 1.6;
        }
      } else if (i < people * 0.3) {
        // fosse : de la scène vers le fond de la pelouse, de plus en plus clairsemée
        for (;;) {
          const u = Math.pow(Math.random(), 1.7);
          x = -A * 0.82 + u * A * 1.72;
          z = (Math.random() - 0.5) * 2 * B * 0.92;
          if ((x / (A * 0.95)) ** 2 + (z / (B * 0.95)) ** 2 < 1) break;
        }
        y = 0.02;
      } else {
        // gradins : on laisse vide la tribune derrière la scène
        let th = 0;
        do th = Math.random() * Math.PI * 2; while (Math.abs(Math.atan2(Math.sin(th - Math.PI), Math.cos(th - Math.PI))) < 0.55);
        const tier = Math.floor(Math.pow(Math.random(), 0.8) * 26);
        const r = 1.1 + tier * 0.031 + Math.random() * 0.008;
        x = Math.cos(th) * A * r;
        z = Math.sin(th) * B * r;
        y = 0.25 + tier * 0.078;
      }
      aD[i * 3] = x; aD[i * 3 + 1] = y; aD[i * 3 + 2] = z;
    }
    (geo.getAttribute("aD") as THREE.BufferAttribute).needsUpdate = true;
  };
  stadium();

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uM1: { value: 0 }, uM2: { value: 0 }, uTime: { value: 0 }, uBeat: { value: 0 },
      uSize: { value: 20 }, uPR: { value: renderer.getPixelRatio() }, uLive: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aS; attribute vec3 aD; attribute vec4 aR;
      uniform float uM1, uM2, uTime, uBeat, uSize, uPR, uLive;
      varying vec3 vC; varying float vA;
      float io(float t) { return t < .5 ? 4.*t*t*t : 1. - pow(-2.*t + 2., 3.) / 2.; }
      void main() {
        vec3 p;
        float kind = aR.w;
        if (uM2 <= 0.) {
          float t = io(clamp((uM1 - aR.x) / .65, 0., 1.));
          p = mix(aS, position, t);
          // la poussière dérive doucement tant qu'elle n'est pas posée
          p += (1. - t) * vec3(sin(uTime * .3 + aR.z * 40.), cos(uTime * .25 + aR.z * 30.), 0.) * .25;
        } else {
          float t = io(clamp((uM2 - aR.y) / .6, 0., 1.));
          p = mix(position, aD, t);
          // trajectoire en arche : chaque point « vole » jusqu'à sa place
          p.y += sin(t * 3.14159) * (1.2 + aR.z * 2.2);
          p.x += sin(t * 3.14159) * (aR.z - .5) * 2.;
        }
        float pit = step(3.5, kind) * step(kind, 6.5);
        // la fosse saute : au rythme de l'extrait s'il y en a un, sinon une houle légère
        float hop = max(0., sin(uTime * 7. + aR.z * 6.283));
        p.y += uLive * pit * (uBeat * .09 * hop + .012 * sin(uTime * 2.4 + aR.z * 50.));

        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;

        float k = mod(kind, 4.);
        vec3 ivory = vec3(.94, .91, .85), brass = vec3(.79, .64, .29), red = vec3(.85, .13, .09);
        vC = kind == 3. ? red : (k < .5 ? ivory : brass);
        vA = kind == 3. ? .35 + .65 * uM2 : (k < .5 ? .9 : (k < 1.5 ? .8 : .45));
        // flashs de téléphones
        float phone = step(.93, aR.z) * uLive;
        float f = pow(max(0., sin(uTime * (.7 + aR.z) + aR.z * 90.)), 24.) * phone;
        vC = mix(vC, vec3(1.), f);
        vA += f * 1.5;
        // profondeur : les points lointains s'éteignent
        vA *= smoothstep(60., 9., -mv.z);
        gl_PointSize = max(uSize * uPR * (1. + f * 1.6 + (kind == 3. ? .4 : 0.)) / -mv.z, 1.);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC; varying float vA;
      void main() {
        vec2 c = gl_PointCoord - .5;
        float a = vA * smoothstep(.5, .2, length(c));
        gl_FragColor = vec4(vC * a, a);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // --- lumière de concert ---------------------------------------------------
  const beams: THREE.Mesh[] = [];
  const beamGeo = beamGeometry(7, 1.1);
  for (let i = 0; i < 6; i++) {
    const m = beamMaterial(i === 2 ? 0xb3261e : 0xc9a24b, i === 2 ? 0.3 : 0.2);
    const b = new THREE.Mesh(beamGeo, m);
    b.position.set(-A * 0.95, 0.15, (i / 5 - 0.5) * 1.9);
    scene.add(b);
    beams.push(b);
  }
  // halo au sol : la pelouse éclairée par la scène
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(A * 2.6, B * 2.6),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uO: { value: 0 } },
      vertexShader: `varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: /* glsl */ `
        uniform float uO; varying vec2 vU;
        void main(){
          vec2 p = (vU - .5) * 2.;
          float field = smoothstep(1., .2, length(p * vec2(1., 1.)));
          float stage = smoothstep(.55, 0., length((p - vec2(-.75, 0.)) * vec2(1.4, 1.)));
          vec3 c = vec3(.79,.64,.29) * field * .05 + vec3(.85,.13,.09) * stage * .22;
          gl_FragColor = vec4(c * uO, 1.);
        }`,
    }),
  );
  glow.rotation.x = -Math.PI / 2;
  scene.add(glow);

  // --- mise en page ---------------------------------------------------------
  let W = 1, H = 1, z0 = 14, R1 = 12;
  const look = new THREE.Vector3();
  const sampleText = () => {
    const c = document.createElement("canvas");
    const s = Math.min(1, 1600 / W);
    c.width = Math.ceil(W * s); c.height = Math.ceil(H * s);
    const x = c.getContext("2d", { willReadFrequently: true })!;
    const fs = Math.min(c.width * 0.26, c.height * 0.52);
    x.font = `italic 400 ${fs}px ${FONT}`;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("30 000", c.width / 2, c.height * 0.47);
    const px = x.getImageData(0, 0, c.width, c.height).data;
    const cand: number[] = [];
    for (let i = 3, k = 0; i < px.length; i += 4, k++) if (px[i] > 140) cand.push(k);
    // pixels → monde : la hauteur visible à z = 0 depuis la caméra de départ
    const vh = 2 * z0 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const u = vh / c.height;
    for (let i = 0; i < N; i++) {
      const k = cand.length ? cand[(Math.random() * cand.length) | 0] : 0;
      aT[i * 3] = ((k % c.width) + Math.random() - 0.5 - c.width / 2) * u;
      aT[i * 3 + 1] = -(((k / c.width) | 0) + Math.random() - 0.5 - c.height / 2) * u;
      aT[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    const aspect = W / H;
    camera.aspect = aspect;
    camera.fov = aspect < 1 ? 48 : 35;
    camera.updateProjectionMatrix();
    z0 = 14;
    // recul final : le stade (≈ 14 unités de large) doit tenir à l'écran
    const hf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
    R1 = Math.max(15.5, 8 / hf);
    mat.uniforms.uSize.value = (aspect < 1 ? 1.3 : 1.75) * z0;
    mat.uniforms.uPR.value = renderer.getPixelRatio();
    sampleText();
  };

  // --- état -----------------------------------------------------------------
  let target = 0, p = 0, live = 0, raf = 0, visible = false, last = performance.now(), time = 0;
  let px = 0, py = 0, tx = 0, ty = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = (e: PointerEvent) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    p += (target - p) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;

    const m1 = clamp01(p / 0.28), m2 = clamp01((p - 0.45) / 0.35);
    const fly = easeInOut(m2);
    const orbit = easeInOut(clamp01((p - 0.78) / 0.22));
    live += ((p > 0.72 ? 1 : 0) - live) * (1 - Math.exp(-dt * 2));

    mat.uniforms.uM1.value = m1;
    mat.uniforms.uM2.value = m2;
    mat.uniforms.uTime.value = time;
    mat.uniforms.uBeat.value = beat();
    mat.uniforms.uLive.value = live;

    // caméra : face au chiffre, puis envolée en arc jusqu'à une vue plongeante des tribunes
    const theta = THREE.MathUtils.lerp(Math.PI / 2, 0.62, fly) - orbit * 0.5 + Math.sin(time * 0.08) * 0.05 * live - px * 0.12;
    const phi = THREE.MathUtils.lerp(0, 0.66, fly) + py * 0.05;
    const R = THREE.MathUtils.lerp(z0, R1, fly);
    look.set(0, THREE.MathUtils.lerp(0, -0.9, fly), 0);
    camera.position.set(look.x + R * Math.cos(phi) * Math.cos(theta), look.y + R * Math.sin(phi), look.z + R * Math.cos(phi) * Math.sin(theta));
    camera.lookAt(look);

    const light = easeInOut(clamp01((p - 0.7) / 0.2));
    (glow.material as THREE.ShaderMaterial).uniforms.uO.value = fly;
    const b = beat();
    beams.forEach((m, i) => {
      const s = m.material as THREE.ShaderMaterial;
      s.uniforms.uOpacity.value = light * (0.8 + b * 0.6);
      s.uniforms.uTime.value = time;
      m.rotation.z = Math.sin(time * 0.5 + i * 1.3) * 0.5 - 0.35;
      m.rotation.x = Math.cos(time * 0.4 + i * 2.1) * 0.35;
    });

    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
  io.observe(canvas);
  let timer = 0;
  const ro = new ResizeObserver(() => { clearTimeout(timer); timer = window.setTimeout(() => { resize(); kick(); }, 120); });
  ro.observe(canvas);
  addEventListener("pointermove", onMove, { passive: true });
  resize();
  kick();

  return {
    setProgress(v: number) { target = v; kick(); },
    dispose() {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); clearTimeout(timer);
      removeEventListener("pointermove", onMove);
      geo.dispose(); mat.dispose(); beamGeo.dispose(); beams.forEach((b) => (b.material as THREE.Material).dispose());
      glow.geometry.dispose(); (glow.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
