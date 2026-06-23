import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import FloatingCta from "./FloatingCta.jsx";
import BackToTop from "./BackToTop.jsx";

export default function Layout() {
  return (
    <div className="font-sans text-ink bg-white overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <FloatingCta />
      {/* Spacer so the fixed mobile CTA bar never covers footer content */}
      <div className="min-[880px]:hidden h-[64px]" aria-hidden="true" />
    </div>
  );
}
