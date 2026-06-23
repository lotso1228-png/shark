import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Worries from "./components/Worries.jsx";
import Reasons from "./components/Reasons.jsx";
import Services from "./components/Services.jsx";
import Insurance from "./components/Insurance.jsx";
import FlowArea from "./components/FlowArea.jsx";
import RecruitFaq from "./components/RecruitFaq.jsx";
import Company from "./components/Company.jsx";
import FinalCta from "./components/FinalCta.jsx";
import Footer from "./components/Footer.jsx";

// Mirrors the design's editor props (showDecorations / animateOnScroll).
const showDecorations = true;

export default function App() {
  return (
    <div className="font-sans text-ink bg-white overflow-x-hidden">
      <Header />
      <Hero showDecorations={showDecorations} />
      <Worries />
      <Reasons />
      <Services />
      <Insurance />
      <FlowArea />
      <RecruitFaq />
      <Company />
      <FinalCta showDecorations={showDecorations} />
      <Footer />
    </div>
  );
}
