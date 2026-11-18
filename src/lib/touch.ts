// Écrans tactiles : pas de survol. L'élément « group » qui traverse le centre de l'écran reçoit
// data-inview, que la variante CSS `hover` (index.css) traite comme un survol.
// Ainsi chaque effet de survol (vinyle qui sort, pochette en couleur, reflet…) existe aussi sur mobile.
export function initTouchHover() {
  if (!matchMedia("(hover: none)").matches) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.toggleAttribute("data-inview", e.isIntersecting)),
    { rootMargin: "-38% 0px -38% 0px" },
  );
  const seen = new WeakSet<Element>();
  const scan = () =>
    document.querySelectorAll(".group").forEach((el) => {
      if (!seen.has(el)) { seen.add(el); io.observe(el); }
    });
  scan();
  // les sections se montent au fil de l'eau (animations, chargements) : on suit le DOM
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = window.setTimeout(scan, 200); }).observe(document.body, { childList: true, subtree: true });
}
