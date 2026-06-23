import { Link } from "react-router-dom";
import { navLinks } from "../routes.js";

export default function Footer() {
  return (
    <footer className="bg-deep text-[#cfe6ec] px-[22px] pt-[46px] pb-[30px]">
      <div className="max-w-[1100px] mx-auto flex flex-wrap gap-6 justify-between items-start">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-3 no-underline">
            <img
              src="/assets/wave-blue.png"
              alt=""
              className="w-10 bg-white rounded-lg p-0.5"
            />
            <span className="flex flex-col leading-[1.1]">
              <span className="text-[10px] tracking-[0.16em] text-[#9fd6e1] font-bold">
                訪問看護ステーション
              </span>
              <span className="font-zen text-[22px] font-black tracking-[0.08em] text-white">
                SHARK
              </span>
            </span>
          </Link>
          <p className="text-[13px] m-0 opacity-85">
            〒635-0057 奈良県大和高田市南陽町5-19
            <br />
            株式会社B-Nuts ／ TEL 080-4767-0011
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-[22px] gap-y-2 max-w-[420px]">
          {navLinks.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className="text-[#cfe6ec] no-underline text-[13.5px] opacity-90 hover:opacity-100"
            >
              {nav.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="max-w-[1100px] mx-auto mt-7 border-t border-white/15 pt-[18px] text-xs opacity-70">
        © 訪問看護ステーションSHARK / 株式会社B-Nuts. All rights reserved.
      </p>
    </footer>
  );
}
