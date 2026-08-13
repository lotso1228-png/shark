import { recruitDayFlow } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 1日の流れ (example schedule — adjust to the real one). */
export default function RecruitDayFlow({ id = "dayflow", bg = "#f0e8d6" }) {
  return (
    <Section id={id} bg={bg} maxWidth={860}>
      <SectionHeading label="SCHEDULE" title="1日の流れ（例）" className="mb-3" />
      <p className="text-center text-[14px] text-muted m-0 mb-9">
        <Jp>直行直帰や時短など、働き方によってスケジュールは調整できます。</Jp>
      </p>

      <ol className="list-none m-0 p-0 relative">
        {recruitDayFlow.map((st, i) => (
          <li key={st.time} className="flex gap-4 min-[560px]:gap-6 pb-5 last:pb-0">
            <div className="flex flex-col items-center flex-none w-[64px]">
              <span className="w-full rounded-full bg-pink text-white text-center font-zen font-bold text-[14px] py-1.5 shadow-[0_5px_12px_rgba(239,143,163,0.3)]">
                {st.time}
              </span>
              {i < recruitDayFlow.length - 1 && (
                <span className="w-px flex-1 bg-[#e6cdb6] mt-1" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 bg-white rounded-[16px] px-5 py-4 shadow-[0_6px_18px_rgba(20,130,150,0.06)] -mt-0.5">
              <h3 className="font-zen font-bold text-[15.5px] text-deep m-0 mb-1">
                <Jp>{st.title}</Jp>
              </h3>
              <p className="text-[13.5px] text-muted m-0 leading-[1.85]">
                <Jp>{st.desc}</Jp>
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-[12px] text-muted m-0 mt-5 leading-[1.85]">
        <Jp>※ スケジュールは一例です。訪問件数・時間配分は経験や状況に応じて調整します。</Jp>
      </p>
    </Section>
  );
}
