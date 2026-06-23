import { recruitPoints, recruitRequirements } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";

const applyFlow = [
  { n: 1, t: "お問い合わせ・見学申込", d: "お電話・フォームからお気軽にご連絡ください。" },
  { n: 2, t: "面談・職場見学", d: "お仕事内容や働き方について、ざっくばらんにお話しします。" },
  { n: 3, t: "体験同行（任意）", d: "ご希望に応じて、訪問への同行を体験いただけます。" },
  { n: 4, t: "採用・入職", d: "先輩看護師の同行から、無理なくスタートできます。" },
];

export default function RecruitDetails() {
  return (
    <>
      {/* 働く魅力 */}
      <Section id="points" bg="#fff" maxWidth={1080}>
        <SectionHeading label="POINT" title="SHARKで働く魅力" className="mb-9" />
        <div className="grid grid-cols-1 min-[760px]:grid-cols-3 gap-5">
          {recruitPoints.map((p) => (
            <div
              key={p.h}
              className="bg-[#f6fcfe] border border-[#e3f4f8] rounded-[20px] p-7 text-center"
            >
              <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-[#eaf7fb] flex items-center justify-center">
                <img src={p.icon} alt="" className="w-11 h-11 object-contain" />
              </div>
              <h3 className="font-zen font-bold text-deep text-[16px] m-0 mb-2.5">
                {p.h}
              </h3>
              <p className="text-[13.5px] text-muted m-0 leading-[1.9]">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 募集要項 */}
      <Section id="requirements" bg="#f0fafd" maxWidth={920}>
        <SectionHeading label="REQUIREMENTS" title="募集要項" className="mb-9" />
        <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_10px_26px_rgba(20,130,150,0.08)] border border-[#eef7f9]">
          {recruitRequirements.map((r) => (
            <div key={r.k} className="flex flex-wrap border-b border-[#eef7f9]">
              <div className="flex-[0_0_180px] min-w-[120px] bg-[#fdf0f3] px-6 py-4 font-bold text-[14px] text-[#3f5867]">
                {r.k}
              </div>
              <div className="flex-1 min-w-[200px] px-6 py-4 text-[14px] text-ink leading-[1.85]">
                {r.v}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-muted m-0 mt-4 leading-[1.85]">
          ※ 募集要項はサンプルです。実際の給与・待遇・勤務条件に差し替えてください。
        </p>
      </Section>

      {/* 応募の流れ */}
      <Section id="apply" bg="#fff" maxWidth={1000}>
        <SectionHeading label="STEP" title="応募の流れ" className="mb-9" />
        <div className="grid grid-cols-1 min-[640px]:grid-cols-4 gap-4">
          {applyFlow.map((s) => (
            <div
              key={s.n}
              className="bg-[#f6fcfe] border border-[#e3f4f8] rounded-[18px] p-5 text-center"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink text-white font-zen font-bold text-[17px] mb-3">
                {s.n}
              </span>
              <h3 className="font-zen font-bold text-deep text-[15px] m-0 mb-2">
                {s.t}
              </h3>
              <p className="text-[12.5px] text-muted m-0 leading-[1.8]">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
