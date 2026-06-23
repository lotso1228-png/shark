import { company } from "../data.js";
import { Reveal, SectionHeading } from "./ui.jsx";

export default function Company() {
  return (
    <section
      id="company"
      className="scroll-mt-20 px-[22px] pt-[78px] pb-[84px] bg-[#f0fafd]"
    >
      <Reveal className="max-w-[920px] mx-auto">
        <SectionHeading label="COMPANY" title="事業所概要" className="mb-10" />
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_26px_rgba(20,130,150,0.08)]">
          {company.map((c) => (
            <div
              key={c.k}
              className="flex flex-wrap border-b border-[#eef7f9]"
            >
              <div className="flex-[0_0_200px] min-w-[140px] bg-[#eaf7fb] px-6 py-4 font-bold text-[14.5px] text-deep">
                {c.k}
              </div>
              <div className="flex-1 min-w-[200px] px-6 py-4 text-[14.5px] text-ink">
                {c.v}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
