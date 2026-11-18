// Sans dépendance à three.js : peut être importé partout sans alourdir le paquet principal.
let ok: boolean | null = null;
export function webglAvailable() {
  if (ok !== null) return ok;
  try {
    const c = document.createElement("canvas");
    ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    ok = false;
  }
  return ok;
}
