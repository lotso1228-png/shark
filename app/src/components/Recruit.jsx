import { TEL, LINE_URL } from "../data.js";
import { Reveal } from "./ui.jsx";
import Jp from "./Jp.jsx";

export default function Recruit() {
  return (
    <section className="px-[22px] pt-[80px] pb-[88px] bg-[#fcf6ed]">
      <Reveal className="max-w-[760px] mx-auto">
        <div
          id="recruit"
          className="scroll-mt-20 rounded-[24px] p-[clamp(26px,3vw,38px)]"
          style={{ background: "linear-gradient(160deg,#fef1f4,#fde8ee)" }}
        >
          <h2 className="font-zen font-black text-[#3f5867] m-0 mb-3.5 text-[clamp(20px,2.5vw,26px)]">
            <Jp>ひとりで訪問しても、ひとりで判断させません。</Jp>
          </h2>
          <div className="flex gap-[18px] items-start flex-wrap">
            <div className="w-[130px] h-[130px] flex-none rounded-[18px] overflow-hidden shadow-[0_10px_20px_rgba(120,70,90,0.14)]">
              <img
                src="/assets/photos/ph-tablet.png"
                alt="業務にあたる看護師"
                className="w-full h-full object-cover block"
              />
            </div>
            <p className="flex-1 min-w-[180px] text-sm text-[#6a5a60] m-0">
              <Jp>
                訪問看護でいちばん多い不安は「ひとりで訪問し、ひとりで判断すること」。SHARKでは同行訪問から始め、ひとり立ち後も判断に迷えばいつでも電話で相談できます。訪問看護未経験の方、子育て中の方、ブランクのある方も、常勤・非常勤どちらでもご相談ください。
              </Jp>
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-6 max-w-[420px]">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-line text-white no-underline font-bold text-base shadow-[0_10px_22px_rgba(6,199,85,0.28)] transition-transform duration-200 hover:-translate-y-[3px]"
            >
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="/assets/ic-line.png" alt="" className="w-8 h-8" />
              </span>
              LINEで気軽に質問してみる
            </a>
            <a
              href="#apply-form"
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-pink text-white no-underline font-bold text-base shadow-[0_10px_22px_rgba(239,143,163,0.32)] transition-transform duration-200 hover:-translate-y-[3px]"
            >
              <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                <img
                  src="/assets/ic-people.png"
                  alt=""
                  className="w-[22px] brightness-0 invert"
                />
              </span>
              見学・カジュアル面談を申し込む
            </a>
            <a
              href={`tel:${TEL}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-teal text-white no-underline font-bold text-base shadow-[0_10px_22px_rgba(20,179,197,0.28)] transition-transform duration-200 hover:-translate-y-[3px]"
            >
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="/assets/ic-phone.png" alt="" className="w-8 h-8" />
              </span>
              電話で問い合わせる
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
