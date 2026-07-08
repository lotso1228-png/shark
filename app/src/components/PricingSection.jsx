import { pricingTiers, pricingNotes } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 料金・保険：自立支援医療の月額上限テーブル ＋ 注釈. */
export default function PricingSection({ id = "fee" }) {
  return (
    <Section id={id} bg="#ece3d1" maxWidth={980}>
      <SectionHeading label="FEE" title="料金・保険について" className="mb-9" />

      <div className="grid min-[820px]:grid-cols-2 gap-4 mb-7">
        <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_22px_rgba(20,130,150,0.07)]">
          <p className="font-zen font-bold text-deep text-[16px] m-0 mb-2">
            ① 医療保険
          </p>
          <p className="text-[14px] text-muted m-0 leading-[1.9]">
            精神科訪問看護は医療保険が適用され、自己負担は
            <strong className="text-teal-600">おおむね1〜3割</strong>
            です（年齢・所得により異なります）。費用は訪問回数・時間・体制などで変わります。
          </p>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_22px_rgba(20,130,150,0.07)] border-2 border-[#d9c9ac]">
          <p className="font-zen font-bold text-deep text-[16px] m-0 mb-2">
            <Jp>② 自立支援医療制度（精神通院医療）</Jp>
          </p>
          <p className="text-[14px] text-muted m-0 leading-[1.9]">
            併用すると対象医療の自己負担が
            <strong className="text-teal-600">原則1割</strong>
            に軽減され、さらに所得に応じた
            <strong className="text-teal-600">月額上限</strong>
            が設定されます。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_22px_rgba(20,130,150,0.07)]">
        <div className="bg-teal text-white px-5 py-3 font-bold text-[14.5px]">
          <Jp>自立支援医療｜所得区分ごとの月額自己負担上限額（目安）</Jp>
        </div>
        <table className="w-full border-collapse text-left">
          <tbody>
            {pricingTiers.map((t, i) => (
              <tr
                key={t.tier}
                className={i % 2 ? "bg-[#fbf7ee]" : "bg-white"}
              >
                <th
                  scope="row"
                  className="font-medium text-[13.5px] text-ink px-5 py-3.5 border-b border-[#eae0cd] align-top"
                >
                  <Jp>{t.tier}</Jp>
                </th>
                <td className="font-zen font-bold text-deep text-[15px] px-5 py-3.5 border-b border-[#eae0cd] whitespace-nowrap text-right w-[110px]">
                  {t.cap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="list-none m-0 mt-6 p-0 flex flex-col gap-2">
        {pricingNotes.map((n) => (
          <li
            key={n}
            className="text-[12.5px] text-muted leading-[1.85] pl-4 relative"
          >
            <span className="absolute left-0 top-0" aria-hidden="true">
              ※
            </span>
            <Jp>{n}</Jp>
          </li>
        ))}
      </ul>
    </Section>
  );
}
