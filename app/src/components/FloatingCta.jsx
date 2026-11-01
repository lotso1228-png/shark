import { useLocation } from "react-router-dom";
import { TEL, EMAIL, LINE_URL } from "../data.js";

// On these pages the reader is a nurse, not a prospective patient, so the bar
// has to offer the application route instead of the enquiry line.
const RECRUIT_PATHS = [
  "/recruit",
  "/column/houmon-kango-tenshoku",
  "/column/houmon-kango-station-erabikata",
];

/**
 * Fixed bottom contact bar shown on mobile only (< 880px) — a standard
 * conversion pattern on Japanese service sites. Hidden on the contact page
 * (where the same CTAs are the main content).
 */
export default function FloatingCta() {
  const { pathname } = useLocation();
  if (pathname === "/contact") return null;

  const bar =
    "min-[880px]:hidden fixed bottom-0 left-0 right-0 z-[180] grid grid-cols-3 bg-[#fcf6ed]/95 backdrop-blur-[10px] border-t border-[#e6dcc7] shadow-[0_-4px_18px_rgba(120,100,60,0.12)]";
  const cell =
    "flex flex-col items-center justify-center gap-1 py-2.5 no-underline";

  if (RECRUIT_PATHS.includes(pathname)) {
    return (
      <div className={bar} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <a
          href="/recruit#apply-form"
          className={`${cell} text-pink`}
          aria-label="見学・カジュアル面談を申し込む"
        >
          <span className="w-7 h-7 rounded-full bg-pink flex items-center justify-center text-white text-[15px] font-bold">
            <span aria-hidden="true">→</span>
          </span>
          <span className="text-[11px] font-bold">見学を申込</span>
        </a>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} text-line border-x border-[#eae0cd]`}
          aria-label="LINEで採用について質問する"
        >
          <span className="w-7 h-7 rounded-full bg-line flex items-center justify-center overflow-hidden">
            <img src="/assets/ic-line.png" alt="" className="w-7 h-7" />
          </span>
          <span className="text-[11px] font-bold">LINEで質問</span>
        </a>
        <a
          href={`tel:${TEL}`}
          className={`${cell} text-teal-600`}
          aria-label="電話で採用について聞く"
        >
          <span className="w-7 h-7 rounded-full bg-teal flex items-center justify-center overflow-hidden">
            <img src="/assets/ic-phone.png" alt="" className="w-7 h-7" />
          </span>
          <span className="text-[11px] font-bold">電話</span>
        </a>
      </div>
    );
  }

  return (
    <div
      className="min-[880px]:hidden fixed bottom-0 left-0 right-0 z-[180] grid grid-cols-3 bg-[#fcf6ed]/95 backdrop-blur-[10px] border-t border-[#e6dcc7] shadow-[0_-4px_18px_rgba(120,100,60,0.12)]"
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
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 py-2.5 no-underline text-line border-x border-[#eae0cd]"
        aria-label="LINEで相談する"
      >
        <span className="w-7 h-7 rounded-full bg-line flex items-center justify-center overflow-hidden">
          <img src="/assets/ic-line.png" alt="" className="w-7 h-7" />
        </span>
        <span className="text-[11px] font-bold">LINE</span>
      </a>
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
