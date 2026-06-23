import { Reveal, ContactButtons, Reception } from "./ui.jsx";

/**
 * Teal contact band reused at the bottom of most pages (and as the home/contact CTA).
 */
export default function CtaBand({
  id,
  title = "まずはお気軽にご相談ください",
  lead = (
    <>
      ご本人・ご家族・医療機関・施設関係者様からのご相談を受け付けています。
      <br className="hidden min-[680px]:block" />
      訪問看護の利用を迷っている段階でも、お気軽にお問い合わせください。
    </>
  ),
  showMascot = true,
  showDecorations = true,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 relative overflow-hidden px-[22px] pt-[72px] pb-[80px]"
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
        <div
          className={`min-w-[300px] text-white text-center ${
            showMascot ? "flex-[1_1_520px]" : "flex-1"
          }`}
        >
          <h2 className="font-zen font-black m-0 mb-4 text-[clamp(24px,3.4vw,36px)]">
            {title}
          </h2>
          <p className="text-[15px] opacity-95 m-0 mb-6 leading-[1.9]">{lead}</p>
          <ContactButtons variant="cta" className="justify-center" />
          <Reception tone="dark" className="mt-5 text-center" />
        </div>
        {showMascot && (
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
        )}
      </Reveal>
    </section>
  );
}
