import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import FloatingCta from "./FloatingCta.jsx";
import BackToTop from "./BackToTop.jsx";

export default function Layout() {
  return (
    <div className="font-sans text-ink bg-white overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-white focus:text-teal-600 focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        本文へスキップ
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1}>
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
