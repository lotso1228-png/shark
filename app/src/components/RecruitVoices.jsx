import { recruitVoices } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 先輩の声 (SAMPLE — replace with real staff interviews). */
export default function RecruitVoices({ id = "voices", bg = "#fcf6ed" }) {
  return (
    <Section id={id} bg={bg} maxWidth={1080}>
      <SectionHeading label="INTERVIEW" title="先輩スタッフの声" className="mb-9" />
      <div className="grid grid-cols-1 min-[760px]:grid-cols-3 gap-5">
        {recruitVoices.map((v) => (
          <figure
            key={v.who}
            className="m-0 bg-white rounded-[20px] overflow-hidden shadow-[0_8px_22px_rgba(20,130,150,0.07)] flex flex-col"
          >
            <div className="w-full aspect-[16/9] overflow-hidden">
              <img
                src={v.photo}
                alt=""
                className="w-full h-full object-cover block" loading="lazy" decoding="async"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <blockquote className="m-0 text-[13.5px] text-ink leading-[1.95] flex-1">
                <Jp>{v.text}</Jp>
              </blockquote>
              <figcaption className="text-[12.5px] text-pink font-bold mt-4">
                <Jp>{v.who}</Jp>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
      <p className="text-[11.5px] text-muted text-center m-0 mt-6">
        ※ 掲載内容はサンプルです。実際のスタッフの声・写真に差し替えてください。
      </p>
    </Section>
  );
}
