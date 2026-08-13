import { useState } from "react";
import { recruitFaq } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 採用FAQ — accessible accordion (aria-expanded / aria-controls / region). */
export default function RecruitFaqSection({ id = "recruit-faq", bg = "#f0e8d6" }) {
  const [open, setOpen] = useState({ 0: true });
  const toggle = (i) => setOpen((s) => ({ ...s, [i]: !s[i] }));

  return (
    <Section id={id} bg={bg} maxWidth={860}>
      <SectionHeading label="Q&A" title="採用に関するよくある質問" className="mb-9" />
      {recruitFaq.map((f, i) => {
        const isOpen = !!open[i];
        const btnId = `rfaq-btn-${i}`;
        const panelId = `rfaq-panel-${i}`;
        return (
          <div
            key={f.q}
            className="bg-white border border-[#e8dec9] rounded-[14px] mb-3 overflow-hidden"
          >
            <h3 className="m-0">
              <button
                id={btnId}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer px-[18px] py-4 text-left min-h-[56px]"
              >
                <span className="flex-none w-7 h-7 rounded-full bg-pink text-white flex items-center justify-center font-zen font-bold text-[13px]">
                  Q
                </span>
                <span className="flex-1 text-[14.5px] font-semibold text-slate leading-[1.7]">
                  <Jp>{f.q}</Jp>
                </span>
                <span
                  className="flex-none text-pink text-sm transition-transform duration-[250ms]"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-[18px] pb-[18px] pl-[58px] text-[14px] text-muted leading-[1.95]"
            >
              <Jp>{f.a}</Jp>
            </div>
          </div>
        );
      })}
    </Section>
  );
}
