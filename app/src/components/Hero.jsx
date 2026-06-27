import { heroBadges } from "../data.js";
import { ContactButtons } from "./ui.jsx";
import Jp from "./Jp.jsx";

export default function Hero({ showDecorations = true }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-[22px] pt-[120px] pb-[90px]"
      style={{
        background:
          "linear-gradient(170deg,#eafaff 0%,#e3f5fb 45%,#f4fcff 100%)",
      }}
    >
      {showDecorations && (
        <div>
          <img
            src="/assets/seagulls.png"
            alt=""
            className="absolute top-[84px] right-[6%] w-[120px] opacity-85 animate-[floaty_6s_ease-in-out_infinite]"
          />
          <img
            src="/assets/blob1.png"
            alt=""
            className="absolute top-[30%] left-[-60px] w-[240px] opacity-50"
          />
          <img
            src="/assets/leaf-branch.png"
            alt=""
            className="absolute bottom-[30px] left-[4%] w-[90px] opacity-70"
          />
        </div>
      )}

      <div className="max-w-[1180px] mx-auto relative z-[2] flex flex-wrap items-center gap-[30px]">
        <div className="flex-[1_1_540px] min-w-[300px]">
          <span className="inline-block bg-white text-teal-600 font-bold text-[13.5px] px-[18px] py-[7px] rounded-full shadow-[0_4px_14px_rgba(20,150,170,0.14)] mb-[22px]">
            奈良県全域対応・精神科訪問看護ステーション
          </span>
          <h1 className="font-zen font-black text-deep m-0 mb-[22px] leading-[1.34] tracking-[0.01em] text-[clamp(30px,4.4vw,52px)]">
            心に寄り添う、
            <br />
            <span className="text-teal">奈良県全域対応</span>の
            <br />
            訪問看護。
          </h1>
          <p className="text-teal-500 font-bold m-0 mb-4 text-[clamp(15px,1.7vw,18px)]">
            <Jp>精神科訪問看護に特化。24時間365日、ひとりで抱え込まない毎日を支えます。</Jp>
          </p>
          <p className="text-[15.5px] text-muted-2 m-0 mb-[34px] max-w-[540px]">
            <Jp>
              訪問看護ステーションSHARKは、精神疾患のある方や障がいのある方に向けて、ご本人の気持ちに寄り添いながら、服薬管理・ご家族への支援・主治医との連携までサポートします。
            </Jp>
          </p>

          <ContactButtons variant="hero" className="mb-[30px]" />

          <div className="flex flex-wrap gap-2.5">
            {heroBadges.map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-[9px] bg-white/85 px-4 py-[9px] rounded-full text-[13.5px] font-bold text-[#3f6470] shadow-[0_3px_10px_rgba(20,150,170,0.1)]"
              >
                <img
                  src={b.img}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
                <Jp>{b.label}</Jp>
              </span>
            ))}
          </div>
        </div>

        <div className="flex-[0_1_380px] min-w-[260px] flex justify-center relative">
          <div
            className="relative w-[min(380px,80vw)] aspect-square rounded-full p-3.5 shadow-[0_30px_60px_rgba(20,150,170,0.2)]"
            style={{
              background:
                "radial-gradient(circle at 50% 40%,#ffffff 0%,#d9f1f8 70%,#c9ebf5 100%)",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_0_0_0_6px_rgba(255,255,255,0.7)]">
              <img
                src="/assets/photos/ph-hero.png"
                alt="寄り添う訪問看護師"
                className="w-full h-full object-cover block"
              />
            </div>
            <img
              src="/assets/care-heart.png"
              alt=""
              className="absolute top-[-18px] right-1 w-[96px] animate-[floaty2_5s_ease-in-out_infinite]"
            />
            <img
              src="/assets/seagulls.png"
              alt=""
              className="absolute bottom-1.5 left-[-26px] w-[80px] opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
