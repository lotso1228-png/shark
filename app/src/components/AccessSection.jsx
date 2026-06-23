import { Section, SectionHeading } from "./ui.jsx";
import { ADDRESS, TEL, RECEPTION } from "../data.js";

/** アクセス — address + keyless Google Maps embed. */
export default function AccessSection({ id = "access", bg = "#f0fafd" }) {
  const q = encodeURIComponent("奈良県大和高田市南陽町5-19");
  return (
    <Section id={id} bg={bg} maxWidth={1080}>
      <SectionHeading label="ACCESS" title="アクセス" className="mb-9" />
      <div className="grid min-[820px]:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-[20px] p-7 shadow-[0_8px_22px_rgba(20,130,150,0.07)] flex flex-col gap-4">
          <div>
            <p className="text-[12.5px] text-muted font-bold m-0 mb-1">所在地</p>
            <p className="text-[15px] text-ink m-0 leading-[1.8]">{ADDRESS}</p>
          </div>
          <div>
            <p className="text-[12.5px] text-muted font-bold m-0 mb-1">電話番号</p>
            <a
              href={`tel:${TEL}`}
              className="font-zen font-bold text-teal-600 text-[22px] no-underline"
            >
              {TEL}
            </a>
          </div>
          <div>
            <p className="text-[12.5px] text-muted font-bold m-0 mb-1">受付</p>
            <p className="text-[15px] text-ink m-0">{RECEPTION}</p>
          </div>
        </div>
        <div className="rounded-[20px] overflow-hidden shadow-[0_8px_22px_rgba(20,130,150,0.07)] min-h-[280px]">
          <iframe
            title="訪問看護ステーションSHARK 所在地マップ"
            src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
            className="w-full h-full min-h-[280px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
