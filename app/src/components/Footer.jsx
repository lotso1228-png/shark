import { Link } from "react-router-dom";
import { navLinks } from "../routes.js";
import { TEL, ADDRESS, CORP, RECEPTION } from "../data.js";

export default function Footer() {
  return (
    <footer className="bg-deep text-[#cfe6ec] px-[22px] pt-[46px] pb-[30px]">
      <div className="max-w-[1100px] mx-auto flex flex-wrap gap-6 justify-between items-start">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-3 no-underline">
            <img
              src="/assets/logo.png"
              alt="訪問看護ステーションSHARK ロゴ"
              className="w-[52px] h-auto"
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
          <p className="text-[13px] m-0 opacity-85 leading-[1.9]">
            {ADDRESS}
            <br />
            {CORP}
          </p>
          <p className="text-[13px] mt-2 mb-0 opacity-90">
            <a
              href={`tel:${TEL}`}
              className="text-white no-underline font-zen font-bold text-[17px] hover:underline"
            >
              TEL {TEL}
            </a>
            <span className="block text-[12px] opacity-80 mt-0.5">
              {RECEPTION}
            </span>
          </p>
          <p className="text-[12px] mt-3 mb-0 opacity-75">
            医療保険／自立支援医療制度に対応
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
