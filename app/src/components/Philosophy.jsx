import { philosophy } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 理念 (mission). */
export default function Philosophy({ id = "philosophy" }) {
  return (
    <Section id={id} bg="#fff" maxWidth={960}>
      <SectionHeading label="PHILOSOPHY" title="私たちの理念" className="mb-8" />
      <div
        className="rounded-[26px] p-[clamp(28px,4vw,48px)] text-center"
        style={{ background: "linear-gradient(150deg,#f3fbfd,#e8f6fb)" }}
      >
        <p className="font-zen font-black text-deep m-0 text-[clamp(20px,3vw,30px)] leading-[1.5]">
          <Jp>{`「${philosophy.title}」`}</Jp>
        </p>
        <div className="grid grid-cols-1 min-[700px]:grid-cols-3 gap-4 mt-8 text-left">
          {philosophy.points.map((p, i) => (
            <div
              key={p.h}
              className="bg-white rounded-[18px] p-5 shadow-[0_6px_18px_rgba(20,130,150,0.06)]"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal text-white font-zen font-bold text-sm mb-3">
                {i + 1}
              </span>
              <h3 className="font-zen font-bold text-deep text-[15.5px] m-0 mb-2">
                <Jp>{p.h}</Jp>
              </h3>
              <p className="text-[13.5px] text-muted m-0 leading-[1.85]">
                <Jp>{p.d}</Jp>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
