import { TEL, LINE_URL } from "../data.js";

const circleIcon =
  "w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0";

/**
 * The recruitment counterpart of ContactButtons.
 * The generic trio ("電話で相談する / LINEで相談する / メールで問い合わせる") sends the
 * most motivated reader of /recruit into the patient enquiry channel, and the
 * subject-less mailto arrives indistinguishable from a patient's message.
 */
export default function RecruitCtaButtons({ variant = "cta", className = "" }) {
  const base =
    "flex items-center gap-3 px-[26px] py-[15px] rounded-full no-underline font-bold text-[16.5px] transition-transform duration-200 hover:-translate-y-[3px]";
  const onTeal = variant === "cta";

  return (
    <div className={`flex flex-wrap gap-3.5 ${className}`}>
      <a
        href="/recruit#apply-form"
        className={`${base} ${
          onTeal
            ? "bg-white text-pink shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            : "bg-pink text-white shadow-[0_12px_24px_rgba(239,143,163,0.3)]"
        }`}
      >
        見学・カジュアル面談を申し込む
      </a>
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-line text-white shadow-[0_12px_24px_rgba(6,199,85,0.28)]`}
      >
        <span className={circleIcon}>
          <img src="/assets/ic-line.png" alt="" className="w-[34px] h-[34px]" />
        </span>
        LINEで質問する
      </a>
      <a
        href={`tel:${TEL}`}
        className={`${base} ${
          onTeal
            ? "bg-white/20 text-white border border-white/60"
            : "bg-teal text-white shadow-[0_12px_24px_rgba(20,179,197,0.3)]"
        }`}
      >
        <span className={circleIcon}>
          <img src="/assets/ic-phone.png" alt="" className="w-[34px] h-[34px]" />
        </span>
        電話で聞いてみる
      </a>
    </div>
  );
}
