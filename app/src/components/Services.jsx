import { Link } from "react-router-dom";
import { services } from "../data.js";
import { Reveal, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

export default function Services() {
  return (
    <section
      id="service"
      className="scroll-mt-20 px-[22px] pt-[80px] pb-[88px] bg-[#ece3d1]"
    >
      <Reveal className="max-w-[1160px] mx-auto">
        <SectionHeading label="SERVICE" title="サービス内容" className="mb-12" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[22px]">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_22px_rgba(20,130,150,0.08)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgba(20,150,170,0.15)]"
            >
              <div className="relative w-full h-[170px] overflow-hidden">
                <img
                  src={s.photo}
                  alt=""
                  className="w-full h-full object-cover block"
                />
                <div className="absolute left-4 -bottom-[22px] w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(20,150,170,0.18)]">
                  <img
                    src={s.icon}
                    alt=""
                    className="w-[30px] h-[30px] object-contain"
                  />
                </div>
              </div>
              <div className="px-[22px] pt-[30px] pb-[26px]">
                <h3 className="font-zen font-bold text-[18px] text-deep m-0 mb-2.5">
                  <Jp>{s.title}</Jp>
                </h3>
                <p className="text-[13.5px] text-muted m-0 leading-[1.8]">
                  <Jp>{s.desc}</Jp>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-9">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-teal-600 font-bold text-[15px] no-underline shadow-[0_8px_20px_rgba(20,150,170,0.12)] transition-transform duration-200 hover:-translate-y-[3px]"
          >
            サービス内容をくわしく見る <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
