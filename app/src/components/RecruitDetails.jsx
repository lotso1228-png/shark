import { recruitPoints, recruitRequirements } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

const onboardingSteps = [
  { n: "STEP 1", t: "同行訪問", d: "先輩看護師と一緒に訪問し、関わり方・記録・制度を学びます。" },
  { n: "STEP 2", t: "一部をおまかせ", d: "同行のなかで、できるところから少しずつ担当します。" },
  { n: "STEP 3", t: "ひとり立ち", d: "習得度に合わせて単独訪問へ。迷ったらいつでも電話で相談できます。" },
  { n: "STEP 4", t: "継続的な振り返り", d: "ケースをチームで共有し、ひとりで抱え込まない看護を続けられるようにします。" },
];

export default function RecruitDetails() {
  return (
    <>
      {/* 働く魅力 */}
      <Section id="points" bg="#fcf6ed" maxWidth={1080}>
        <SectionHeading label="POINT" title="SHARKで働く魅力" className="mb-9" />
        <div className="grid grid-cols-1 min-[760px]:grid-cols-3 gap-5">
          {recruitPoints.map((p) => (
            <div
              key={p.h}
              className="bg-[#ffffff] border border-[#e8dec9] rounded-[20px] p-7 text-center"
            >
              <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-[#f0e8d6] flex items-center justify-center">
                <img src={p.icon} alt="" className="w-11 h-11 object-contain" />
              </div>
              <h3 className="font-zen font-bold text-deep text-[16px] m-0 mb-2.5">
                <Jp>{p.h}</Jp>
              </h3>
              <p className="text-[13.5px] text-muted m-0 leading-[1.9]">
                <Jp>{p.d}</Jp>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ひとり立ちまでのステップ */}
      <Section id="onboarding" bg="#f0e8d6" maxWidth={1000}>
        <SectionHeading label="TRAINING" title="ひとり立ちまでのステップ" className="mb-3" />
        <p className="text-center text-[14px] text-muted m-0 mb-9">
          <Jp>期間は決め打ちにせず、経験と習得度に合わせて調整します。</Jp>
        </p>
        <div className="grid grid-cols-1 min-[640px]:grid-cols-4 gap-4">
          {onboardingSteps.map((s) => (
            <div
              key={s.n}
              className="bg-white border border-[#e8dec9] rounded-[18px] p-5"
            >
              <p className="font-zen font-black text-pink text-[13px] tracking-[0.08em] m-0 mb-2">
                {s.n}
              </p>
              <h3 className="font-zen font-bold text-deep text-[15.5px] m-0 mb-2">
                <Jp>{s.t}</Jp>
              </h3>
              <p className="text-[12.5px] text-muted m-0 leading-[1.85]">
                <Jp>{s.d}</Jp>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 募集要項 */}
      <Section id="requirements" bg="#fcf6ed" maxWidth={920}>
        <SectionHeading label="REQUIREMENTS" title="募集要項" className="mb-9" />
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_26px_rgba(20,130,150,0.08)] border border-[#eae0cd]">
          {recruitRequirements.map((r) => (
            <div key={r.k} className="flex flex-wrap border-b border-[#eae0cd]">
              <div className="flex-[0_0_180px] min-w-[120px] bg-[#fdf0f3] px-6 py-4 font-bold text-[14px] text-[#3f5867]">
                {r.k}
              </div>
              <div className="flex-1 min-w-[200px] px-6 py-4 text-[14px] text-ink leading-[1.85]">
                <Jp>{r.v}</Jp>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-muted m-0 mt-4 leading-[1.85]">
          <Jp>※ 給与・待遇・勤務条件の詳細は、面談時に個別にご案内します。ご希望もお聞かせください。</Jp>
        </p>
      </Section>

    </>
  );
}
