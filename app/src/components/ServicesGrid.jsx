import { servicesFull } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** Full 8-item service grid (icon + title + description) for the service page. */
export default function ServicesGrid({ id = "service" }) {
  return (
    <Section id={id} bg="#eaf7fb">
      <SectionHeading
        label="SERVICE"
        title="提供するケア"
        className="mb-10"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
        {servicesFull.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-[20px] p-7 shadow-[0_8px_22px_rgba(20,130,150,0.08)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgba(20,150,170,0.15)]"
          >
            <div className="w-[60px] h-[60px] rounded-2xl bg-[#eaf7fb] flex items-center justify-center mb-4">
              <img src={s.icon} alt="" className="w-9 h-9 object-contain" />
            </div>
            <h3 className="font-zen font-bold text-[17px] text-deep m-0 mb-2.5">
              <Jp>{s.title}</Jp>
            </h3>
            <p className="text-[14px] text-muted m-0 leading-[1.9]">
              <Jp>{s.desc}</Jp>
            </p>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-muted mt-7 mb-0 leading-[1.9]">
        <Jp>
          ※ 家事代行そのものや外出先での受診同行・付き添いは、原則として保険の訪問看護の対象外です。リハビリの一環として計画に位置づけられた外出練習などは支援できる場合があります。詳しくはご相談ください。
        </Jp>
      </p>
    </Section>
  );
}
