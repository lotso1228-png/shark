import { reasons } from "../data.js";
import { Reveal, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

export default function Reasons() {
  return (
    <section className="px-[22px] pt-[80px] pb-[86px] bg-white">
      <Reveal className="max-w-[1160px] mx-auto">
        <SectionHeading
          label="REASON"
          title="SHARKが選ばれる理由"
          className="mb-12"
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-[#f6fcfe] border border-[#e3f4f8] rounded-[20px] px-[22px] py-[30px] text-center transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgba(20,150,170,0.14)]"
            >
              <div className="w-[88px] h-[88px] mx-auto mb-[18px] rounded-full bg-[#eaf7fb] flex items-center justify-center">
                <img
                  src={r.img}
                  alt=""
                  className="w-[54px] h-[54px] object-contain"
                />
              </div>
              <h3 className="font-zen font-bold text-[17px] text-deep m-0 mb-3">
                <Jp>{r.title}</Jp>
              </h3>
              <p className="text-[13.5px] text-muted m-0 leading-[1.8]">
                <Jp>{r.desc}</Jp>
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
