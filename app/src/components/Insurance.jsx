import { insurance } from "../data.js";
import { Reveal } from "./ui.jsx";
import Jp from "./Jp.jsx";

export default function Insurance() {
  return (
    <section className="px-[22px] pt-[78px] pb-[84px] bg-white">
      <Reveal className="max-w-[1080px] mx-auto">
        <div
          className="rounded-[26px] p-[clamp(28px,4vw,52px)] flex flex-wrap items-center gap-[34px]"
          style={{ background: "linear-gradient(150deg,#f3fbfd,#e8f6fb)" }}
        >
          <div className="flex-[1_1_420px] min-w-[280px]">
            <h2 className="font-zen font-black text-deep m-0 mb-6 text-[clamp(22px,2.8vw,30px)]">
              <Jp>医療保険・自立支援医療制度について</Jp>
            </h2>
            {insurance.map((i) => (
              <div key={i} className="flex items-start gap-3 mb-[15px]">
                <span className="flex-none w-[26px] h-[26px] rounded-full bg-teal text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-[15px] text-ink font-medium">
                  <Jp>{i}</Jp>
                </span>
              </div>
            ))}
          </div>
          <div className="flex-[1_1_280px] min-w-[240px] flex flex-col items-center gap-[18px]">
            <div className="relative w-[min(300px,72vw)]">
              <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_16px_30px_rgba(20,150,170,0.16)]">
                <img
                  src="/assets/photos/ph-care.png"
                  alt="寄り添う看護師"
                  className="w-full h-full object-cover block"
                />
              </div>
              <img
                src="/assets/care-heart.png"
                alt=""
                className="absolute -bottom-[22px] -right-3 w-[80px]"
              />
            </div>
            <p className="text-sm text-muted text-center m-0 max-w-[340px]">
              <Jp>
                訪問看護ステーションSHARKでは、医療保険での訪問看護に対応しています。自立支援医療制度をご利用いただくことで、自己負担を抑えて訪問看護をご利用いただける場合があります。
              </Jp>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
