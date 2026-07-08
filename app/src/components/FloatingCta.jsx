import { Link, useLocation } from "react-router-dom";
import { TEL, EMAIL } from "../data.js";

/**
 * Fixed bottom contact bar shown on mobile only (< 880px) — a standard
 * conversion pattern on Japanese service sites. Hidden on the contact page
 * (where the same CTAs are the main content).
 */
export default function FloatingCta() {
  const { pathname } = useLocation();
  if (pathname === "/contact") return null;

  return (
    <div
      className="min-[880px]:hidden fixed bottom-0 left-0 right-0 z-[180] grid grid-cols-3 bg-[#f5efe2]/95 backdrop-blur-[10px] border-t border-[#e6dcc7] shadow-[0_-4px_18px_rgba(120,100,60,0.12)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${TEL}`}
        className="flex flex-col items-center justify-center gap-1 py-2.5 no-underline text-teal-600"
        aria-label="電話で相談する"
      >
        <span className="w-7 h-7 rounded-full bg-teal flex items-center justify-center overflow-hidden">
          <img src="/assets/ic-phone.png" alt="" className="w-7 h-7" />
        </span>
        <span className="text-[11px] font-bold">電話</span>
      </a>
      <Link
        to="/contact"
        className="flex flex-col items-center justify-center gap-1 py-2.5 no-underline text-line border-x border-[#eae0cd]"
        aria-label="LINEで相談する"
      >
        <span className="w-7 h-7 rounded-full bg-line flex items-center justify-center overflow-hidden">
          <img src="/assets/ic-line.png" alt="" className="w-7 h-7" />
        </span>
        <span className="text-[11px] font-bold">LINE</span>
      </Link>
      <a
        href={`mailto:${EMAIL}`}
        className="flex flex-col items-center justify-center gap-1 py-2.5 no-underline text-mail"
        aria-label="メールで問い合わせる"
      >
        <span className="w-7 h-7 rounded-full bg-mail flex items-center justify-center overflow-hidden">
          <img src="/assets/ic-mail.png" alt="" className="w-7 h-7" />
        </span>
        <span className="text-[11px] font-bold">メール</span>
      </a>
    </div>
  );
}
