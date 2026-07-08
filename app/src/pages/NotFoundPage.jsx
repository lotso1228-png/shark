import { Link } from "react-router-dom";
import SubPage from "../components/SubPage.jsx";
import Jp from "../components/Jp.jsx";
import { pageMeta } from "../routes.js";

export default function NotFoundPage() {
  return (
    <SubPage meta={pageMeta.notFound}>
      <section className="px-[22px] pt-[90px] pb-[110px] bg-[#f0e8d6] text-center">
        <div className="max-w-[560px] mx-auto">
          <p className="font-zen font-black text-teal text-[64px] leading-none m-0">
            404
          </p>
          <h1 className="font-zen font-black text-deep m-0 mt-3 mb-3 text-[clamp(20px,3vw,28px)]">
            <Jp>お探しのページが見つかりません</Jp>
          </h1>
          <p className="text-[15px] text-muted m-0 mb-8">
            <Jp>
              ページが移動または削除された可能性があります。お手数ですが、トップページからお探しください。
            </Jp>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-[26px] py-[15px] rounded-full bg-teal text-white no-underline font-bold text-base shadow-[0_12px_24px_rgba(20,179,197,0.3)] transition-transform duration-200 hover:-translate-y-[3px]"
          >
            トップページへ戻る
          </Link>
        </div>
      </section>
    </SubPage>
  );
}
