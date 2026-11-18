import * as THREE from "three";

/*
 * Socle commun des scènes 3D.
 * - studio() : un environnement d'éclairage « photo produit » fabriqué en code (pas de HDR à télécharger) :
 *   une boîte noire, des bandes lumineuses chaudes et une bande rouge. C'est ce qui dessine les reflets
 *   longs et nets sur le laiton et les sillons du vinyle.
 * - beamMaterial() : faisceau de projecteur volumétrique (cône additif, s'efface sur les bords et en hauteur).
 */

export function createRenderer(canvas: HTMLCanvasElement, { alpha = false, maxDpr = 2 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxDpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  if (!alpha) renderer.setClearColor(0x0b0a08, 1);
  else renderer.setClearColor(0x000000, 0);
  return renderer;
}

export function studio(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050403);
  const strip = (w: number, h: number, color: number, intensity: number, pos: [number, number, number], look: [number, number, number] = [0, 0, 0]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(...look);
    scene.add(m);
  };
  // bandes principales : longues, fines, chaudes, reflets « joaillerie »
  strip(14, 0.9, 0xfff1d6, 9, [0, 7, 2]);
  strip(0.7, 10, 0xffe2b0, 6, [-7, 1, 3]);
  strip(0.5, 10, 0xffffff, 4, [7, 2, -2]);
  strip(10, 0.4, 0xc9a24b, 5, [0, -3, 7]);
  // la touche rouge Nueva Era
  strip(0.4, 6, 0xb3261e, 7, [4, 0, 7]);
  // sol très légèrement chaud pour décoller les noirs
  strip(30, 30, 0x1d1a14, 0.6, [0, -8, 0]);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  scene.traverse((o) => {
    if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
  });
  return env;
}

export function beamMaterial(color: THREE.ColorRepresentation, strength = 0.22) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uStrength: { value: strength }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying float vH; varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main() {
        vH = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        vW = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity; uniform float uStrength; uniform float uTime;
      varying float vH; varying vec3 vN; varying vec3 vV; varying vec3 vW;
      void main() {
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
        float fall = pow(1.0 - vH, 0.75) * smoothstep(0.0, 0.06, vH) * smoothstep(1.0, 0.8, vH);
        // poussière qui traverse la lumière
        float n = sin(vW.y * 3.1 - uTime * 0.6 + sin(vW.x * 2.3) * 1.7) * 0.5 + 0.5;
        float a = edge * fall * uOpacity * uStrength * (0.75 + 0.25 * n);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });
}

/** Cône ouvert dont la pointe est à l'origine et qui s'ouvre vers +Y. */
export function beamGeometry(length: number, radius: number) {
  const g = new THREE.CylinderGeometry(radius, 0.015, length, 48, 1, true);
  g.translate(0, length / 2, 0);
  return g;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const beat = () => parseFloat(document.documentElement.style.getPropertyValue("--beat")) || 0;
