import { areaCities, areaNote } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 対応エリア — 奈良県の市町村リスト ＋ マップ ＋ 写真. */
export default function AreaSection({ id = "area" }) {
  return (
    <Section id={id} bg="#f0e8d6" maxWidth={1080}>
      <SectionHeading label="AREA" title="対応エリア（奈良県全域）" className="mb-10" />

      <div className="flex flex-wrap gap-7 items-center">
        <div className="flex-none relative w-[150px] h-[150px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(20,150,170,0.14)] mx-auto min-[560px]:mx-0">
          <img
            src="/assets/map-japan.png"
            alt="奈良県マップ"
            className="w-[78%] h-[78%] object-contain"
          />
          <img
            src="/assets/ic-pin.png"
            alt=""
            className="absolute top-[42%] left-[48%] w-[30px] animate-[floaty2_4s_ease-in-out_infinite]"
          />
        </div>
        <p className="flex-1 min-w-[240px] text-[14.5px] text-ink m-0 leading-[1.95]">
          <Jp>
            橿原市・大和高田市を中心に、奈良県全域へ訪問対応しています。精神科訪問看護をご希望の方、ご家族、医療機関・施設関係者様もお気軽にご相談ください。
          </Jp>
        </p>
      </div>

      <div className="mt-7 bg-white rounded-[20px] p-6 shadow-[0_8px_22px_rgba(20,130,150,0.07)]">
        <p className="font-bold text-deep text-[14.5px] m-0 mb-3">主な対応市</p>
        <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
          {areaCities.map((c) => (
            <li
              key={c}
              className="bg-[#f0e8d6] text-[#2f5867] text-[13.5px] font-medium rounded-lg px-3 py-1.5"
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-muted m-0 mt-4 leading-[1.85]">
          <Jp>{areaNote}</Jp>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_8px_18px_rgba(20,150,170,0.12)]">
          <img
            src="/assets/photos/ph-nara.png"
            alt="奈良の風景"
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_8px_18px_rgba(20,150,170,0.12)]">
          <img
            src="/assets/photos/ph-walk.png"
            alt="訪問に向かう看護師"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>
    </Section>
  );
}
