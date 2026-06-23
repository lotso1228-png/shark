import { steps } from "../data.js";
import { Reveal } from "./ui.jsx";

export default function FlowArea() {
  return (
    <section
      id="flow"
      className="scroll-mt-20 px-[22px] pt-[80px] pb-[88px] bg-[#f0fafd]"
    >
      <Reveal className="max-w-[1160px] mx-auto flex flex-wrap gap-[26px] items-stretch">
        {/* Flow */}
        <div className="flex-[1_1_440px] min-w-[300px] bg-white rounded-[24px] p-[clamp(26px,3vw,40px)] shadow-[0_10px_26px_rgba(20,130,150,0.08)]">
          <h2 className="font-zen font-black text-deep m-0 mb-[26px] text-[clamp(21px,2.6vw,28px)]">
            ご利用開始までの流れ
          </h2>
          {steps.map((st) => (
            <div
              key={st.n}
              className="flex items-center gap-4 py-[13px] border-b border-dashed border-[#dceef3]"
            >
              <span className="flex-none w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-zen font-bold text-base">
                {st.n}
              </span>
              <span className="flex-1 text-[15px] font-semibold text-slate">
                {st.title}
              </span>
              <span className="flex-none w-10 h-10 flex items-center justify-center">
                <img
                  src={st.img}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
              </span>
            </div>
          ))}
        </div>

        {/* Area */}
        <div
          id="area"
          className="scroll-mt-20 flex-[1_1_360px] min-w-[300px] rounded-[24px] p-[clamp(26px,3vw,40px)] flex flex-col"
          style={{ background: "linear-gradient(160deg,#dff3fa,#eaf8fc)" }}
        >
          <h2 className="font-zen font-black text-deep m-0 mb-3.5 text-[clamp(21px,2.6vw,28px)]">
            奈良県全域に訪問対応
          </h2>
          <div className="flex flex-wrap gap-5 items-center">
            <div className="flex-none relative w-[150px] h-[150px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(20,150,170,0.14)]">
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
            <p className="flex-1 min-w-[180px] text-[14.5px] text-ink m-0">
              大和高田市を拠点に、奈良県全域へ訪問対応しています。精神科訪問看護をご希望の方、ご家族、医療機関・施設関係者様もお気軽にご相談ください。
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
        </div>
      </Reveal>
    </section>
  );
}
