import { Link } from "react-router-dom";
import { targetPersons, conditions } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";

/**
 * 対象となる方 ＋ 対応疾患.
 * compact=true → home teaser (conditions as chips + link to full page).
 */
export default function ConditionsSection({
  id = "target",
  compact = false,
  bg = "#fff",
}) {
  return (
    <Section id={id} bg={bg}>
      <SectionHeading
        label="FOR YOU"
        title="対象となる方・対応疾患"
        className="mb-10"
      />

      <div className="grid min-[860px]:grid-cols-[0.9fr_1.1fr] gap-7 items-start">
        {/* 対象となる方 */}
        <div className="bg-[#f6fcfe] border border-[#e3f4f8] rounded-[20px] p-7">
          <h3 className="font-zen font-bold text-[18px] text-deep m-0 mb-4">
            こんな方が対象です
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-3">
            {targetPersons.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="flex-none w-[22px] h-[22px] rounded-full bg-teal text-white flex items-center justify-center text-[12px] font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-[14.5px] text-ink leading-[1.8]">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 対応疾患 */}
        <div>
          <h3 className="font-zen font-bold text-[18px] text-deep m-0 mb-4">
            主な対応疾患
          </h3>
          {compact ? (
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <span
                  key={c.name}
                  className="bg-[#eaf7fb] text-[#2f5867] text-[13px] font-medium rounded-full px-3.5 py-2"
                >
                  {c.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-3">
              {conditions.map((c) => (
                <div
                  key={c.name}
                  className="bg-white border border-[#e3f4f8] rounded-2xl px-4 py-3.5 shadow-[0_4px_14px_rgba(20,130,150,0.05)]"
                >
                  <p className="font-bold text-[14px] text-deep m-0 mb-1">
                    {c.name}
                  </p>
                  <p className="text-[12.5px] text-muted m-0 leading-[1.75]">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="text-[13px] text-muted mt-4 mb-0 leading-[1.85]">
            診断名でお迷いの場合も、まずはお気軽にご相談ください。
          </p>
          {compact && (
            <Link
              to="/service#target"
              className="inline-flex items-center gap-1.5 mt-4 text-teal-600 font-bold text-sm no-underline hover:gap-2.5 transition-all"
            >
              対象・サービスをくわしく見る <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}
