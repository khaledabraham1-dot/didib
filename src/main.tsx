import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initScroll } from "./lib/scroll";
import { initTouchHover } from "./lib/touch";

initScroll();
initTouchHover();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
