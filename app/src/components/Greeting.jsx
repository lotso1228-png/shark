import { greeting } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 代表挨拶 (SAMPLE — replace with the real representative's message). */
export default function Greeting({ id = "greeting" }) {
  return (
    <Section id={id} bg="#f0fafd" maxWidth={980}>
      <SectionHeading label="MESSAGE" title="代表挨拶" className="mb-9" />
      <div className="flex flex-wrap gap-8 items-start">
        <div className="flex-none mx-auto min-[680px]:mx-0">
          <div className="w-[180px] h-[180px] rounded-[20px] overflow-hidden shadow-[0_12px_26px_rgba(20,150,170,0.16)]">
            <img
              src="/assets/photos/ph-stetho.png"
              alt=""
              className="w-full h-full object-cover block"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[280px]">
          {greeting.body.map((para, i) => (
            <p
              key={i}
              className="text-[14.5px] text-ink leading-[2] m-0 mb-4"
            >
              <Jp>{para}</Jp>
            </p>
          ))}
          <p className="font-zen font-bold text-deep text-[15px] m-0 mt-5 text-right">
            {greeting.signature}　〇〇 〇〇
          </p>
        </div>
      </div>
      <p className="text-[11.5px] text-muted m-0 mt-6">
        ※ 代表挨拶はサンプル文です。実際の代表者の言葉・お名前・お写真に差し替えてください。
      </p>
    </Section>
  );
}
