import { worries } from "../data.js";
import { Reveal, SectionHeading } from "./ui.jsx";

export default function Worries() {
  return (
    <section className="relative overflow-hidden px-[22px] pt-[78px] pb-[84px] bg-[#f0fafd]">
      <Reveal className="max-w-[1100px] mx-auto relative z-[2]">
        <SectionHeading
          label="CHECK"
          title="こんなお悩みはありませんか？"
          className="mb-[46px]"
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {worries.map((w) => (
            <div
              key={w}
              className="flex items-center gap-[13px] bg-white px-[22px] py-5 rounded-2xl shadow-[0_6px_18px_rgba(20,130,150,0.07)]"
            >
              <span className="flex-none w-[30px] h-[30px] rounded-full bg-teal text-white flex items-center justify-center text-base font-bold">
                ✓
              </span>
              <span className="text-[15px] font-medium text-ink">{w}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3.5 mt-[44px]">
          <img
            src="/assets/leaf-branch.png"
            alt=""
            className="w-[46px] opacity-80 -scale-x-100"
          />
          <p className="font-zen font-bold text-teal m-0 text-center text-[clamp(18px,2.4vw,26px)]">
            その不安を、ひとりで抱え込まなくて大丈夫です。
          </p>
          <img
            src="/assets/leaf-branch.png"
            alt=""
            className="w-[46px] opacity-80"
          />
        </div>
      </Reveal>
    </section>
  );
}
