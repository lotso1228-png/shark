import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import Jp from "./Jp.jsx";
import { recruitBadges } from "../content.js";

/** Home-page recruitment banner linking to /recruit. */
export default function RecruitBanner() {
  return (
    <section className="px-[22px] py-[clamp(54px,7vw,82px)] bg-[#fcf6ed]">
      <Reveal className="max-w-[1080px] mx-auto">
        <div
          className="rounded-[26px] p-[clamp(26px,4vw,46px)] flex flex-wrap items-center gap-8"
          style={{ background: "linear-gradient(160deg,#fef1f4,#fde8ee)" }}
        >
          <div className="flex-[1_1_460px] min-w-[280px]">
            <p className="text-pink font-bold text-[13px] tracking-[0.14em] m-0 mb-2">
              RECRUIT
            </p>
            <h2 className="font-zen font-black text-[#3f5867] m-0 mb-3 text-[clamp(22px,3vw,32px)]">
              <Jp>一緒に働く看護師を募集しています</Jp>
            </h2>
            <p className="text-[14.5px] text-[#6a5a60] m-0 mb-4 leading-[1.95]">
              <Jp>
                訪問看護が未経験でも、ブランクがあっても大丈夫。見学やカジュアル面談だけでも歓迎です。あなたの「聴く力」を、地域の暮らしを支える力に。
              </Jp>
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {recruitBadges.slice(0, 4).map((b) => (
                <span
                  key={b}
                  className="bg-white text-pink font-bold text-[12.5px] rounded-full px-3 py-1.5"
                >
                  {b}
                </span>
              ))}
            </div>
            <Link
              to="/recruit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-pink text-white no-underline font-bold text-[16px] shadow-[0_12px_24px_rgba(239,143,163,0.35)] transition-transform duration-200 hover:-translate-y-[3px]"
            >
              採用情報をくわしく見る <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="flex-[0_1_280px] min-w-[220px] mx-auto">
            <div className="rounded-[20px] overflow-hidden shadow-[0_14px_28px_rgba(120,70,90,0.16)] aspect-[4/3]">
              <img
                src="/assets/photos/ph-tablet.png"
                alt="働く看護師"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
