import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Faq from "../components/Faq.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function FaqPage() {
  return (
    <SubPage meta={pageMeta.faq}>
      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="対象・費用・訪問・体制・手続きについて、よくいただくご質問にお答えします。解決しない場合はお気軽にお問い合わせください。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "よくある質問" }]}
      />
      <Faq />
      <CtaBand />
    </SubPage>
  );
}
