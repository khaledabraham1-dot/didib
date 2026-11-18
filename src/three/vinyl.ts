import * as THREE from "three";
import { beat, createRenderer, studio } from "./core";

/*
 * Les cinq vinyles, rendus en vrai 3D dans UN seul contexte WebGL :
 * chaque disque du DOM (un bouton transparent) réserve sa place, et on dessine le modèle 3D
 * dans ce rectangle (viewport + scissor), comme le font les sites produits haut de gamme.
 * - sillons : matériau anisotrope → la barre de lumière radiale typique d'un vinyle, qui glisse quand il s'incline
 * - plages séparées par des bandes lisses, étiquette = pochette officielle (Deezer)
 * - bras de lecture en laiton qui se pose pendant l'écoute ; halo qui bat au rythme réel (--beat)
 */

export type VinylItem = {
  el: HTMLElement;
  cover: string;
  hue: string;
  state: () => { playing: boolean; loading: boolean };
  spin: () => number; // degrés, liés au défilement
};

function grooveMaps(size = 1024) {
  const n = size * size;
  const rough = new Uint8Array(n * 4);
  const normal = new Uint8Array(n * 4);
  const aniso = new Uint8Array(n * 4);
  const gaps = [0.47, 0.585, 0.7, 0.81, 0.9]; // silences entre les plages
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const k = (j * size + i) * 4;
      const x = (i + 0.5) / size * 2 - 1, y = (j + 0.5) / size * 2 - 1;
      const r = Math.hypot(x, y) || 1e-4;
      const ux = x / r, uy = y / r;
      let groove = r > 0.36 && r < 0.955 ? 1 : 0;
      for (const g of gaps) groove *= Math.min(1, Math.abs(r - g) / 0.006);
      // relief des sillons : une sinusoïde radiale, dérivée → normale
      const f = 2 * Math.PI * 150;
      const d = Math.cos(r * f) * groove * 0.6;
      const nx = -ux * d, ny = -uy * d;
      const l = Math.hypot(nx, ny, 1);
      normal[k] = ((nx / l) * 0.5 + 0.5) * 255;
      normal[k + 1] = ((ny / l) * 0.5 + 0.5) * 255;
      normal[k + 2] = (1 / l * 0.5 + 0.5) * 255;
      normal[k + 3] = 255;
      const noise = Math.sin(r * 913.7) * 0.5 + 0.5;
      const ro = r > 0.955 && r < 0.968 ? 0.16 : groove ? 0.36 + noise * 0.08 : r > 0.968 ? 0.3 : 0.14;
      rough[k] = rough[k + 1] = rough[k + 2] = ro * 255;
      rough[k + 3] = 255;
      // direction d'anisotropie : tangente aux sillons
      aniso[k] = (-uy * 0.5 + 0.5) * 255;
      aniso[k + 1] = (ux * 0.5 + 0.5) * 255;
      aniso[k + 2] = (groove ? 1 : 0.25) * 255;
      aniso[k + 3] = 255;
    }
  }
  const tex = (data: Uint8Array) => {
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  };
  return { rough: tex(rough), normal: tex(normal), aniso: tex(aniso) };
}

export function mountVinyls(canvas: HTMLCanvasElement, getItems: () => VinylItem[]) {
  const renderer = createRenderer(canvas, { alpha: true, maxDpr: 2 });
  renderer.toneMappingExposure = 1.15;
  renderer.autoClear = false;
  const scene = new THREE.Scene();
  const env = studio(renderer);
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  // --- disque ---------------------------------------------------------------
  const maps = grooveMaps();
  const disc = new THREE.Group();
  const vinyl = new THREE.MeshPhysicalMaterial({
    color: 0x0c0b09,
    roughness: 1,
    roughnessMap: maps.rough,
    metalness: 0,
    normalMap: maps.normal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    anisotropy: 0.85,
    anisotropyMap: maps.aniso,
    clearcoat: 0.35,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.25,
  });
  const top = new THREE.Mesh(new THREE.RingGeometry(0.02, 1, 256, 1), vinyl);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.012;
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(1, 128), new THREE.MeshStandardMaterial({ color: 0x0a0907, roughness: 0.4 }));
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -0.012;
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.024, 256, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x14120e, roughness: 0.22, clearcoat: 1 }));

  const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
  const sat = { value: 0 };
  labelMat.onBeforeCompile = (s) => {
    s.uniforms.uSat = sat;
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uSat;")
      .replace(
        "#include <map_fragment>",
        "#include <map_fragment>\nfloat g = dot(diffuseColor.rgb, vec3(.299,.587,.114));\ndiffuseColor.rgb = mix(vec3(g) * vec3(1.02,.86,.62) * .8, diffuseColor.rgb, uSat);",
      );
  };
  const label = new THREE.Mesh(new THREE.CircleGeometry(0.34, 128), labelMat);
  label.rotation.x = -Math.PI / 2;
  label.position.y = 0.0135;
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xc9a24b, metalness: 1, roughness: 0.24, envMapIntensity: 1.4 });
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 24), brass);
  spindle.position.y = 0.03;
  disc.add(top, bottom, edge, label);

  // --- bras de lecture ------------------------------------------------------
  const arm = new THREE.Group();
  arm.position.set(1.2, 0, -0.92);
  const darkBrass = new THREE.MeshPhysicalMaterial({ color: 0x8c7440, metalness: 1, roughness: 0.38 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.08, 48), darkBrass);
  base.position.y = 0.0;
  const bearing = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.12, 32), brass);
  bearing.position.y = 0.09;
  const swing = new THREE.Group();
  swing.position.y = 0.13;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -0.28), new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, -0.005, 0.9),
    new THREE.Vector3(-0.1, -0.03, 1.3), new THREE.Vector3(-0.2, -0.06, 1.5),
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.016, 16), brass);
  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 32), darkBrass);
  weight.rotation.x = Math.PI / 2;
  weight.position.z = -0.3;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.17), brass);
  head.position.set(-0.22, -0.07, 1.56);
  head.rotation.y = -0.35;
  const stylus = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.05), new THREE.MeshStandardMaterial({ color: 0xefe8da, roughness: 0.4 }));
  stylus.position.set(-0.22, -0.09, 1.58);
  swing.add(tube, weight, head, stylus);
  arm.add(base, bearing, swing);

  // ombre douce posée sous le disque
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      vertexShader: `varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `varying vec2 vU; void main(){ float d = length(vU - .5) * 2.; float a = smoothstep(1., .45, d) * .55; gl_FragColor = vec4(0.,0.,0.,a); }`,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.12, -0.16, 0.18);

  // halo de l'ère : un anneau lumineux sous le disque, qui bat avec la musique
  const haloMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uC: { value: new THREE.Color() }, uO: { value: 0 } },
    vertexShader: `varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uC; uniform float uO; varying vec2 vU; void main(){ float d = length(vU - .5) * 2.; float a = smoothstep(1., .55, d) * smoothstep(.3, .62, d) * uO; gl_FragColor = vec4(uC * a, a); }`,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -0.1;

  const rig = new THREE.Group(); // inclinaison vers le pointeur
  const spinner = new THREE.Group(); // rotation du disque
  spinner.add(disc);
  rig.add(spinner, spindle, arm, halo);
  scene.add(shadow, rig);

  // --- textures des pochettes -------------------------------------------------
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  const covers = new Map<string, THREE.Texture | null>();
  const cover = (url: string) => {
    if (!covers.has(url)) {
      covers.set(url, null);
      loader.load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        covers.set(url, t);
      });
    }
    return covers.get(url) ?? null;
  };

  // --- état par disque ------------------------------------------------------
  type S = { angle: number; vel: number; arm: number; sat: number; tx: number; ty: number; glow: number };
  const states = new WeakMap<HTMLElement, S>();
  const tmpColor = new THREE.Color();
  let pointer = { x: -1e4, y: -1e4 };
  const onMove = (e: PointerEvent) => { pointer = { x: e.clientX, y: e.clientY }; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let raf = 0, visible = false, last = performance.now(), time = 0;
  const DIST = 6, ELEV = THREE.MathUtils.degToRad(56);
  camera.position.set(0, DIST * Math.sin(ELEV), DIST * Math.cos(ELEV));
  camera.lookAt(0, 0, 0);

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    const cr = canvas.getBoundingClientRect();
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    const b = beat();

    for (const it of getItems()) {
      const r = it.el.getBoundingClientRect();
      if (r.width < 2 || r.right < cr.left - r.width || r.left > cr.right + r.width || r.bottom < cr.top || r.top > cr.bottom) continue;
      let s = states.get(it.el);
      if (!s) { s = { angle: 0, vel: 0, arm: 0, sat: 0, tx: 0, ty: 0, glow: 0 }; states.set(it.el, s); }
      const { playing, loading } = it.state();
      const D = r.width, pad = D * 0.42;
      const cx = r.left + D / 2, cy = r.top + r.height / 2;
      const hover = Math.hypot(pointer.x - cx, pointer.y - cy) < D * 0.55;
      const k = 1 - Math.exp(-dt * 5);
      s.vel += ((playing ? 3.49 : 0) - s.vel) * (1 - Math.exp(-dt * (playing ? 1.6 : 2.4)));
      s.angle += s.vel * dt;
      s.arm += ((playing || loading ? 1 : 0) - s.arm) * (1 - Math.exp(-dt * 2.6));
      s.sat += ((playing || hover ? 1 : 0) - s.sat) * k;
      s.glow += ((playing ? 1 : 0) - s.glow) * k;
      // inclinaison : vers le pointeur s'il est proche, sinon léger flottement
      const near = Math.max(0, 1 - Math.hypot(pointer.x - cx, pointer.y - cy) / (D * 1.4));
      const nx = Math.max(-1, Math.min(1, (pointer.x - cx) / D)), ny = Math.max(-1, Math.min(1, (pointer.y - cy) / D));
      const idle = reduce ? 0 : 1;
      s.tx += ((ny * 0.32 * near + Math.sin(time * 0.6 + cx * 0.01) * 0.04 * idle) - s.tx) * k;
      s.ty += ((nx * 0.4 * near + Math.cos(time * 0.5 + cx * 0.01) * 0.05 * idle) - s.ty) * k;

      // le modèle prend l'état de ce disque
      spinner.rotation.y = -s.angle - THREE.MathUtils.degToRad(it.spin());
      rig.rotation.set(s.tx, s.ty, 0);
      swing.rotation.y = THREE.MathUtils.lerp(0.06, -0.36, s.arm);
      swing.rotation.x = THREE.MathUtils.lerp(-0.08, 0, Math.min(1, s.arm * 1.4)); // le bras s'abaisse sur le disque
      sat.value = s.sat;
      const tex = cover(it.cover);
      if (labelMat.map !== tex) { labelMat.map = tex; labelMat.needsUpdate = true; }
      labelMat.color.set(tex ? 0xffffff : it.hue);
      haloMat.uniforms.uC.value.copy(tmpColor.set(it.hue));
      haloMat.uniforms.uO.value = s.glow * (0.45 + b * 0.9);
      const pulse = 1 + s.glow * b * 0.018;
      disc.scale.setScalar(pulse);

      // cadrage : le disque (diamètre 2) occupe exactement la largeur du bouton
      const w = D + pad * 2;
      const x = r.left - pad - cr.left, y = cr.bottom - (cy + w / 2);
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan((w / D) / DIST));
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setViewport(x, y, w, w);
      renderer.setScissor(x, y, w, w);
      renderer.clear();
      renderer.render(scene, camera);
    }
    if (visible) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    kick();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
  io.observe(canvas);
  addEventListener("pointermove", onMove, { passive: true });
  resize();

  return {
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
      });
      Object.values(maps).forEach((t) => t.dispose());
      covers.forEach((t) => t?.dispose());
      env.dispose();
      renderer.dispose();
    },
  };
}
