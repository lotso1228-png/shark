import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import FlowSteps from "../components/FlowSteps.jsx";
import AreaSection from "../components/AreaSection.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function FlowPage() {
  return (
    <SubPage meta={pageMeta.flow}>
      <PageHero
        eyebrow="FLOW & AREA"
        title="ご利用の流れ・対応エリア"
        lead="お問い合わせから訪問開始まで、専門の手続きも当ステーションがサポートします。奈良県全域へ訪問対応しています。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "ご利用の流れ" }]}
      />
      <Toc
        items={[
          { id: "flow", label: "ご利用開始までの流れ" },
          { id: "area", label: "対応エリア" },
        ]}
      />
      <FlowSteps id="flow" />
      <AreaSection id="area" />
      <CtaBand />
    </SubPage>
  );
}
