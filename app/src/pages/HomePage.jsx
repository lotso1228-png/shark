import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { pageMeta } from "../routes.js";
import Hero from "../components/Hero.jsx";
import StatsBand from "../components/StatsBand.jsx";
import Worries from "../components/Worries.jsx";
import Reasons from "../components/Reasons.jsx";
import Services from "../components/Services.jsx";
import ConditionsSection from "../components/ConditionsSection.jsx";
import StaffSection from "../components/StaffSection.jsx";
import FlowSteps from "../components/FlowSteps.jsx";
import Testimonials from "../components/Testimonials.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function HomePage() {
  useDocumentMeta(pageMeta.home);
  return (
    <>
      <Hero showDecorations />
      <StatsBand />
      <Worries />
      <Reasons />
      <Services />
      <ConditionsSection compact bg="#f5efe2" />
      <StaffSection compact bg="#ece3d1" />
      <FlowSteps compact bg="#f5efe2" />
      <Testimonials bg="#ece3d1" />
      <CtaBand />
    </>
  );
}
