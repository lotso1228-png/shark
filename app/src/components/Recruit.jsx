import { Link } from "react-router-dom";
import { TEL } from "../data.js";
import { Reveal } from "./ui.jsx";

export default function Recruit() {
  return (
    <section className="px-[22px] pt-[80px] pb-[88px] bg-white">
      <Reveal className="max-w-[760px] mx-auto">
        <div
          id="recruit"
          className="scroll-mt-20 rounded-[24px] p-[clamp(26px,3vw,38px)]"
          style={{ background: "linear-gradient(160deg,#fef1f4,#fde8ee)" }}
        >
          <h2 className="font-zen font-black text-[#3f5867] m-0 mb-3.5 text-[clamp(20px,2.5vw,26px)]">
            一緒に働く看護師を募集しています
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
              訪問看護ステーションSHARKでは、利用者様の暮らしに寄り添う看護師を募集しています。訪問看護未経験の方、子育て中の方、ブランクのある方もご相談ください。常勤・非常勤どちらも相談可能です。
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-6 max-w-[420px]">
            <Link
              to="/contact"
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-pink text-white no-underline font-bold text-base shadow-[0_10px_22px_rgba(239,143,163,0.32)] transition-transform duration-200 hover:-translate-y-[3px]"
            >
              <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                <img
                  src="/assets/ic-people.png"
                  alt=""
                  className="w-[22px] brightness-0 invert"
                />
              </span>
              採用について相談する
            </Link>
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
