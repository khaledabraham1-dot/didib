/** Appel JSONP (l'API publique Deezer n'expose pas CORS). */
export function jsonp<T>(url: string, timeout = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `dz_${Math.random().toString(36).slice(2)}`;
    const s = document.createElement("script");
    const w = window as unknown as Record<string, unknown>;
    const done = () => { delete w[cb]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { done(); reject(new Error("timeout")); }, timeout);
    w[cb] = (d: T) => { done(); resolve(d); };
    s.onerror = () => { done(); reject(new Error("network")); };
    s.src = `${url}${url.includes("?") ? "&" : "?"}output=jsonp&callback=${cb}`;
    document.head.appendChild(s);
  });
}
