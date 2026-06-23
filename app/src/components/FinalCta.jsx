import { Reveal, ContactButtons } from "./ui.jsx";

export default function FinalCta({ showDecorations = true }) {
  return (
    <section
      id="contact"
      className="scroll-mt-20 relative overflow-hidden px-[22px] pt-[84px] pb-[90px]"
      style={{ background: "linear-gradient(160deg,#19b9cb,#1aa7c4)" }}
    >
      {showDecorations && (
        <img
          src="/assets/wave-soft.png"
          alt=""
          className="absolute top-0 left-0 w-full opacity-25"
        />
      )}
      <Reveal className="max-w-[1080px] mx-auto relative z-[2] flex flex-wrap items-center gap-[34px] justify-center">
        <div className="flex-[1_1_520px] min-w-[300px] text-white text-center">
          <h2 className="font-zen font-black m-0 mb-4 text-[clamp(25px,3.4vw,38px)]">
            まずはお気軽にご相談ください
          </h2>
          <p className="text-[15px] opacity-95 m-0 mb-[30px]">
            ご本人・ご家族・医療機関・施設関係者様からのご相談を受け付けています。
            <br />
            訪問看護の利用を迷っている段階でも、お気軽にお問い合わせください。
          </p>
          <ContactButtons variant="cta" className="justify-center" />
        </div>
        <div className="flex-[0_0_200px] flex flex-col items-center">
          <div className="w-[190px] h-[190px] rounded-full bg-white flex flex-col items-center justify-center text-center shadow-[0_16px_34px_rgba(0,0,0,0.16)] p-3.5">
            <img
              src="/assets/woman-heart.png"
              alt=""
              className="w-[84px] mb-0.5"
            />
            <p className="font-zen font-bold text-pink text-base m-0 leading-[1.4]">
              相談だけでも
              <br />
              大丈夫です
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
