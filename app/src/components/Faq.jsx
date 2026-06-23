import { useState } from "react";
import { faqItems } from "../data.js";
import { Reveal } from "./ui.jsx";

export default function Faq() {
  const [faqOpen, setFaqOpen] = useState(0); // Q1 open by default (matches design)

  return (
    <section className="px-[22px] pt-[80px] pb-[88px] bg-white">
      <Reveal className="max-w-[760px] mx-auto">
        <h2 className="font-zen font-black text-deep m-0 mb-[22px] text-[clamp(21px,2.6vw,28px)]">
          よくある質問
        </h2>
        {faqItems.map((f, i) => {
          const open = faqOpen === i;
          return (
            <div
              key={f.q}
              className="bg-[#f6fcfe] border border-[#e3f4f8] rounded-[14px] mb-[11px] overflow-hidden"
            >
              <button
                onClick={() => setFaqOpen(open ? -1 : i)}
                aria-expanded={open}
                className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer px-[18px] py-4 text-left"
              >
                <span className="flex-none w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center font-zen font-bold text-[13px]">
                  Q{i + 1}
                </span>
                <span className="flex-1 text-[14.5px] font-semibold text-slate">
                  {f.q}
                </span>
                <span
                  className="flex-none text-teal text-sm transition-transform duration-[250ms]"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ▼
                </span>
              </button>
              <div
                className="px-[18px] pb-[18px] pl-[58px] text-sm text-muted leading-[1.85]"
                style={{ display: open ? "block" : "none" }}
              >
                {f.a}
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
