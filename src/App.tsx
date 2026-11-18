import { Toaster } from "sonner";
import { MotionConfig } from "motion/react";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { Trone } from "./components/Trone";
import { Chiffres } from "./components/Chiffres";
import { Eras } from "./components/Eras";
import { Listen } from "./components/Listen";
import { Sacre } from "./components/Sacre";
import { Palmares } from "./components/Palmares";
import { Story } from "./components/Story";
import { Shop } from "./components/Shop";
import { Cour } from "./components/Cour";
import { Reseaux } from "./components/Reseaux";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#eres" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-brass focus:px-4 focus:py-2 focus:text-obsidian">Aller au contenu</a>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Chiffres />
        <Trone />
        <Eras />
        <Listen />
        <Sacre />
        <Palmares />
        <Story />
        <Shop />
        <Cour />
        <Reseaux />
      </main>
      <Footer />
      <Toaster position="bottom-center" toastOptions={{ style: { background: "#0b0a08", color: "#efe8da", border: "1px solid rgba(201,162,75,.4)", borderRadius: 0, fontFamily: "Archivo Variable" } }} />
    </MotionConfig>
  );
}
