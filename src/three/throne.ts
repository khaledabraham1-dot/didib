import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { beamGeometry, beamMaterial, clamp01, createRenderer, easeInOut, easeOut, studio } from "./core";

/*
 * Le Trône : le logo de Didi B (cinq piliers sur un socle) bâti en volume.
 * Laiton brossé, cinquième pilier en laque rouge (Nueva Era), sol d'obsidienne polie qui reflète,
 * un projecteur par pilier. Au défilement, les piliers se dressent un par un, une ère après l'autre,
 * pendant que la caméra passe d'une contre-plongée au ras du sol à la vue frontale du monument.
 */

const HEIGHTS = [12, 18, 24, 18, 12];
const U = 0.13; // 1 unité du logo
const GAP = 0.9; // entraxe des piliers

function brushed(size = 256) {
  const d = new Uint8Array(size * size * 4);
  const col = Array.from({ length: size }, () => Math.random());
  for (let i = 0; i < size; i++) col[i] = (col[i] + col[(i + 1) % size] + col[(i + size - 1) % size]) / 3;
  for (let j = 0; j < size; j++)
    for (let i = 0; i < size; i++) {
      const k = (j * size + i) * 4;
      const v = 0.22 + col[i] * 0.22 + Math.random() * 0.03;
      d[k] = d[k + 1] = d[k + 2] = v * 255;
      d[k + 3] = 255;
    }
  const t = new THREE.DataTexture(d, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

export function mountThrone(canvas: HTMLCanvasElement, labels: (HTMLElement | null)[]) {
  const renderer = createRenderer(canvas, { maxDpr: 1.75 });
  renderer.toneMappingExposure = 0.95;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0a08);
  const env = studio(renderer);
  scene.environment = env;
  scene.environmentIntensity = 0.8;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  // --- matériaux ------------------------------------------------------------
  const rough = brushed();
  const brass = new THREE.MeshPhysicalMaterial({
    color: 0xc9a24b, metalness: 1, roughness: 1, roughnessMap: rough,
    anisotropy: 0.75, anisotropyRotation: Math.PI / 2, envMapIntensity: 1.6,
  });
  const lacquer = new THREE.MeshPhysicalMaterial({
    color: 0xb3261e, metalness: 0.1, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4,
  });
  const plinthMat = new THREE.MeshPhysicalMaterial({ color: 0xa8873f, metalness: 1, roughness: 0.42, roughnessMap: rough });

  // --- le monument ------------------------------------------------------------
  const throne = new THREE.Group();
  const plinthH = 1.6 * U;
  const width = (28 / 5.2) * GAP;
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(width, plinthH, GAP * 0.95, 4, 0.025), plinthMat);
  plinth.position.y = plinthH / 2;
  throne.add(plinth);
  const pillars = HEIGHTS.map((h, i) => {
    const H = h * U;
    const g = new RoundedBoxGeometry(GAP * 0.577, H, GAP * 0.577, 4, 0.03);
    g.translate(0, H / 2, 0);
    const m = new THREE.Mesh(g, i === 4 ? lacquer : brass);
    m.position.set((i - 2) * GAP, plinthH + 0.035, 0);
    m.scale.y = 0.0001;
    throne.add(m);
    return m;
  });
  scene.add(throne);

  // --- projecteurs ----------------------------------------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.04));
  const spots = HEIGHTS.map((h, i) => {
    const s = new THREE.SpotLight(i === 4 ? 0xff5a4a : 0xffe6b8, 0, 12, 0.3, 0.6, 1.6);
    s.position.set((i - 2) * GAP + 0.15, 7.2, 1.3);
    s.target.position.set((i - 2) * GAP, h * U * 0.6, 0);
    scene.add(s, s.target);
    return s;
  });
  const beamGeo = beamGeometry(7.4, 0.62);
  const beams = HEIGHTS.map((_, i) => {
    const b = new THREE.Mesh(beamGeo, beamMaterial(i === 4 ? 0xb3261e : 0xc9a24b, i === 4 ? 0.8 : 0.5));
    b.position.copy(spots[i].position);
    b.lookAt(spots[i].target.position);
    b.rotateX(Math.PI / 2); // +Y du cône → vers la cible
    scene.add(b);
    return b;
  });
  // contre-jour : une lame chaude derrière le monument
  const back = new THREE.SpotLight(0xc9a24b, 0, 20, 0.6, 1, 1.4);
  back.position.set(0, 3.5, -6);
  back.target.position.set(0, 1, 0);
  scene.add(back, back.target);

  // --- sol d'obsidienne -----------------------------------------------------
  const mirror = new Reflector(new THREE.PlaneGeometry(40, 40), { color: 0x8a8273, textureWidth: 1024, textureHeight: 1024, clipBias: 0.003 });
  mirror.rotation.x = -Math.PI / 2;
  scene.add(mirror);
  const stone = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uT: { value: 0 } },
      vertexShader: `varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position,1.)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW,1.); }`,
      fragmentShader: /* glsl */ `
        varying vec3 vW; uniform float uT;
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        void main(){
          float d = length(vW.xz * vec2(.8, 1.));
          // reflet net près du monument, qui se perd dans le noir au loin
          float a = mix(.42, 1., smoothstep(1.4, 7.5, d));
          // micro-rayures de la pierre polie
          a += (h(floor(vW.xz * 140.)) - .5) * .05;
          gl_FragColor = vec4(vec3(.043,.039,.031), clamp(a, 0., 1.));
        }`,
    }),
  );
  stone.rotation.x = -Math.PI / 2;
  stone.position.y = 0.002;
  scene.add(stone);

  // --- poussière dans la lumière ------------------------------------------
  const DUST = 900;
  const dg = new THREE.BufferGeometry();
  const dp = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { dp[i * 3] = (Math.random() - 0.5) * 6; dp[i * 3 + 1] = Math.random() * 6; dp[i * 3 + 2] = (Math.random() - 0.5) * 3 + 0.4; }
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uO: { value: 0 } },
    vertexShader: /* glsl */ `
      uniform float uTime, uPR; varying float vA;
      void main(){
        vec3 p = position;
        p.y = mod(p.y + uTime * .06, 6.);
        p.x += sin(uTime * .3 + position.z * 4.) * .08;
        // brille davantage dans l'axe d'un projecteur
        float lane = abs(fract((p.x + ${(GAP * 2.5).toFixed(3)}) / ${GAP.toFixed(3)}) - .5);
        vA = .25 + smoothstep(.3, .0, lane) * .75;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = max(4. * uPR / -mv.z, 1.);
      }`,
    fragmentShader: `uniform float uO; varying float vA; void main(){ float a = smoothstep(.5,.1,length(gl_PointCoord-.5)) * vA * uO * .7; gl_FragColor = vec4(vec3(.95,.82,.55) * a, a); }`,
  });
  const dust = new THREE.Points(dg, dustMat);
  scene.add(dust);

  // --- animation ------------------------------------------------------------
  let target = 0, p = 0, raf = 0, visible = false, last = performance.now(), time = 0, dEnd = 8;
  let px = 0, py = 0, tx = 0, ty = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) target = p = 1;
  const onMove = (e: PointerEvent) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
  const look = new THREE.Vector3(), from = new THREE.Vector3(), to = new THREE.Vector3(), v = new THREE.Vector3();
  let W = 1, H = 1;

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    p += (target - p) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
    px += (tx - px) * 0.04; py += (ty - py) * 0.04;

    pillars.forEach((m, i) => {
      const t = clamp01((p - 0.06 - i * 0.1) / 0.24);
      const e = easeOut(t);
      m.scale.y = Math.max(0.0001, e);
      spots[i].intensity = 14 * easeInOut(clamp01((p - 0.04 - i * 0.1) / 0.16));
      const bm = beams[i].material as THREE.ShaderMaterial;
      bm.uniforms.uOpacity.value = spots[i].intensity / 14;
      bm.uniforms.uTime.value = time;
      const lbl = labels[i];
      if (lbl) {
        v.set((i - 2) * GAP, 0, GAP * 0.62).project(camera);
        lbl.style.transform = `translate3d(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * H}px, 0) translate(-50%, 0)`;
        lbl.style.opacity = String(clamp01((t - 0.55) / 0.45));
      }
    });
    back.intensity = 22 * easeInOut(clamp01((p - 0.55) / 0.3));
    dustMat.uniforms.uTime.value = time;
    dustMat.uniforms.uO.value = easeInOut(clamp01(p / 0.3));

    // caméra : contre-plongée au ras du sol → vue frontale, le monument entier
    const c = easeInOut(clamp01(p / 0.85));
    from.set(2.4, 0.32, 3.6);
    to.set(dEnd * 0.2, 1.05, dEnd);
    camera.position.lerpVectors(from, to, c);
    camera.position.x += px * 0.6 + Math.sin(time * 0.15) * 0.08;
    camera.position.y += -py * 0.3;
    look.set(THREE.MathUtils.lerp(0.4, 0.1, c), THREE.MathUtils.lerp(1.5, 2.45, c), 0);
    camera.lookAt(look);

    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = camera.aspect < 1 ? 44 : 32;
    camera.updateProjectionMatrix();
    const hf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    dEnd = Math.max(10.8, 3.4 / hf);
    const pr = renderer.getPixelRatio();
    mirror.getRenderTarget().setSize(Math.round(W * pr * 0.6), Math.round(H * pr * 0.6));
    dustMat.uniforms.uPR.value = pr;
    kick();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
  io.observe(canvas);
  addEventListener("pointermove", onMove, { passive: true });
  resize();

  return {
    setProgress(x: number) { if (!reduce) { target = x; kick(); } },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
      });
      mirror.dispose();
      rough.dispose(); env.dispose();
      renderer.dispose();
    },
  };
}
