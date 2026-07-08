import { useState } from "react";
import { faqFull } from "../content.js";
import { Section } from "./ui.jsx";
import Jp from "./Jp.jsx";

const CATEGORY_ORDER = ["対象", "費用", "訪問", "体制", "手続き"];
const CATEGORY_LABEL = {
  対象: "対象について",
  費用: "費用・保険について",
  訪問: "訪問・サービスについて",
  体制: "体制・エリアについて",
  手続き: "手続きについて",
};

function FaqItem({ item, index, open, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;
  return (
    <div className="bg-[#ffffff] border border-[#e8dec9] rounded-[14px] mb-3 overflow-hidden">
      <h3 className="m-0">
        <button
          id={btnId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer px-[18px] py-4 text-left min-h-[56px]"
        >
          <span className="flex-none w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center font-zen font-bold text-[13px]">
            Q
          </span>
          <span className="flex-1 text-[14.5px] font-semibold text-slate leading-[1.7]">
            <Jp>{item.q}</Jp>
          </span>
          <span
            className="flex-none text-teal text-sm transition-transform duration-[250ms]"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
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
        hidden={!open}
        className="px-[18px] pb-[18px] pl-[58px] text-[14px] text-muted leading-[1.95]"
      >
        <Jp>{item.a}</Jp>
      </div>
    </div>
  );
}

export default function Faq({ id = "faq" }) {
  const [open, setOpen] = useState({ 0: true }); // first Q open by default
  const toggle = (i) => setOpen((s) => ({ ...s, [i]: !s[i] }));

  let idx = -1;
  return (
    <Section id={id} bg="#fcf6ed" maxWidth={860}>
      {CATEGORY_ORDER.map((cat) => {
        const items = faqFull.filter((f) => f.cat === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mb-9 last:mb-0">
            <h2 className="font-zen font-bold text-deep text-[clamp(18px,2.2vw,22px)] m-0 mb-4 flex items-center gap-2.5">
              <span className="w-1.5 h-6 rounded bg-teal inline-block" />
              {CATEGORY_LABEL[cat]}
            </h2>
            {items.map((item) => {
              idx += 1;
              const i = idx;
              return (
                <FaqItem
                  key={item.q}
                  item={item}
                  index={i}
                  open={!!open[i]}
                  onToggle={() => toggle(i)}
                />
              );
            })}
          </div>
        );
      })}
    </Section>
  );
}
