import { useEffect, useState } from "react";
import { navItems, TEL } from "../data.js";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when resizing up to desktop (matches the design).
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 880) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] h-[66px] bg-white/95 backdrop-blur-[10px] shadow-[0_2px_16px_rgba(20,120,140,0.08)]">
      <div className="max-w-[1180px] mx-auto h-full flex items-center justify-between px-[22px]">
        <a href="#top" className="flex items-center gap-2.5 no-underline">
          <img src="/assets/wave-blue.png" alt="" className="w-10 h-auto" />
          <span className="flex flex-col leading-[1.1]">
            <span className="text-[10px] tracking-[0.18em] text-teal-400 font-bold">
              訪問看護ステーション
            </span>
            <span className="font-zen text-[23px] font-black tracking-[0.08em] text-deep">
              SHARK
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden min-[880px]:flex items-center gap-[22px]">
          {navItems.map((nav) => (
            <a
              key={nav.href}
              href={nav.href}
              className="no-underline text-ink text-[14.5px] font-medium transition-colors duration-200 hover:text-teal"
            >
              {nav.label}
            </a>
          ))}
          <a
            href={`tel:${TEL}`}
            className="flex items-center gap-[7px] no-underline text-teal-600 font-zen font-bold text-[20px] ml-1"
          >
            <span className="w-[30px] h-[30px] rounded-full bg-teal flex items-center justify-center">
              <img
                src="/assets/ic-phone.png"
                alt=""
                className="w-[30px] h-[30px] rounded-full"
              />
            </span>
            {TEL}
          </a>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
          className="min-[880px]:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
        >
          <span className="w-[26px] h-[2.5px] bg-deep rounded-[2px] block" />
          <span className="w-[26px] h-[2.5px] bg-deep rounded-[2px] block" />
          <span className="w-[26px] h-[2.5px] bg-deep rounded-[2px] block" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="min-[880px]:hidden bg-white border-t border-[#e6f4f7] px-[22px] pt-3.5 pb-5 shadow-[0_12px_22px_rgba(20,120,140,0.1)]">
          {navItems.map((nav) => (
            <a
              key={nav.href}
              href={nav.href}
              onClick={() => setMenuOpen(false)}
              className="block py-[13px] px-1 no-underline text-ink text-[15px] font-medium border-b border-[#eef7f9]"
            >
              {nav.label}
            </a>
          ))}
          <a
            href={`tel:${TEL}`}
            className="flex items-center justify-center gap-2 mt-3.5 p-[13px] rounded-full bg-teal text-white no-underline font-bold text-[18px] font-zen"
          >
            {TEL}
          </a>
        </div>
      )}
    </header>
  );
}
