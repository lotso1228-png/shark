import { company } from "../data.js";
import { Section, SectionHeading } from "./ui.jsx";

export default function Company({ id = "outline" }) {
  return (
    <Section id={id} bg="#fff" maxWidth={920}>
      <SectionHeading label="OUTLINE" title="事業所情報" className="mb-9" />
      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_26px_rgba(20,130,150,0.08)] border border-[#eef7f9]">
        {company.map((c) => (
          <div key={c.k} className="flex flex-wrap border-b border-[#eef7f9]">
            <div className="flex-[0_0_200px] min-w-[130px] bg-[#eaf7fb] px-6 py-4 font-bold text-[14.5px] text-deep">
              {c.k}
            </div>
            <div className="flex-1 min-w-[200px] px-6 py-4 text-[14.5px] text-ink leading-[1.85]">
              {c.v}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-muted m-0 mt-4 leading-[1.85]">
        ※ 指定番号・運営規程・重要事項説明書など、開示が必要な情報は確定後に掲載します。
      </p>
    </Section>
  );
}
