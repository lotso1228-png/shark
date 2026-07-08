import { stats } from "../content.js";
import { Reveal } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 数字で見るSHARK — quick-trust strip of key facts. */
export default function StatsBand() {
  return (
    <section className="px-[22px] py-[clamp(40px,5vw,56px)] bg-[#f5efe2]">
      <Reveal className="max-w-[1000px] mx-auto grid grid-cols-2 min-[760px]:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-[#fbf7ee] border border-[#e8dec9] px-4 py-6 text-center"
          >
            <p className="font-zen font-black text-teal m-0 text-[clamp(20px,2.6vw,26px)] leading-tight">
              {s.value}
            </p>
            <p className="text-[12.5px] text-muted m-0 mt-2 leading-snug">
              <Jp>{s.label}</Jp>
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
