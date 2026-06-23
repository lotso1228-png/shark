import { useReveal } from "../hooks/useReveal.js";
import { TEL, EMAIL } from "../data.js";

/** Scroll-reveal wrapper. Renders a div that fades/slides in on scroll. */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useReveal(true);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Centered eyebrow label + heading used by several sections. */
export function SectionHeading({ label, title, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-teal-500 font-bold text-sm tracking-[0.1em] mb-1.5">
        {label}
      </p>
      <h2 className="font-zen font-black text-deep m-0 text-[clamp(24px,3.2vw,36px)]">
        {title}
      </h2>
    </div>
  );
}

const circleIcon =
  "w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0";

/**
 * The three contact CTAs (phone / LINE / mail).
 * variant="hero"  → colored solid buttons
 * variant="cta"   → on the teal final-CTA band (phone is white)
 */
export function ContactButtons({ variant = "hero", className = "" }) {
  const base =
    "flex items-center gap-3 px-[26px] py-[15px] rounded-full no-underline font-bold text-[16.5px] transition-transform duration-200 hover:-translate-y-[3px]";

  const phone =
    variant === "cta"
      ? "bg-white text-teal-600 shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      : "bg-teal text-white shadow-[0_12px_24px_rgba(20,179,197,0.3)] hover:shadow-[0_16px_30px_rgba(20,179,197,0.42)]";
  const line =
    variant === "cta"
      ? "bg-line text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      : "bg-line text-white shadow-[0_12px_24px_rgba(6,199,85,0.28)] hover:shadow-[0_16px_30px_rgba(6,199,85,0.4)]";
  const mail =
    variant === "cta"
      ? "bg-mail text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      : "bg-mail text-white shadow-[0_12px_24px_rgba(63,127,207,0.28)] hover:shadow-[0_16px_30px_rgba(63,127,207,0.4)]";

  return (
    <div className={`flex flex-wrap gap-3.5 ${className}`}>
      <a href={`tel:${TEL}`} className={`${base} ${phone}`}>
        <span className={circleIcon}>
          <img src="/assets/ic-phone.png" alt="" className="w-[34px] h-[34px]" />
        </span>
        電話で相談する
      </a>
      <a href="#contact" className={`${base} ${line}`}>
        <span className={circleIcon}>
          <img src="/assets/ic-line.png" alt="" className="w-[34px] h-[34px]" />
        </span>
        LINEで相談する
      </a>
      <a href={`mailto:${EMAIL}`} className={`${base} ${mail}`}>
        <span className={circleIcon}>
          <img src="/assets/ic-mail.png" alt="" className="w-[34px] h-[34px]" />
        </span>
        メールで問い合わせる
      </a>
    </div>
  );
}
