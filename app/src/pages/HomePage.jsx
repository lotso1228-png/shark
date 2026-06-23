import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { pageMeta } from "../routes.js";
import Hero from "../components/Hero.jsx";
import Worries from "../components/Worries.jsx";
import Reasons from "../components/Reasons.jsx";
import FinalCta from "../components/FinalCta.jsx";

export default function HomePage() {
  useDocumentMeta(pageMeta.home);
  return (
    <>
      <Hero showDecorations />
      <Worries />
      <Reasons />
      <FinalCta showDecorations />
    </>
  );
}
