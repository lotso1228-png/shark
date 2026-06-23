import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import ConditionsSection from "../components/ConditionsSection.jsx";
import Insurance from "../components/Insurance.jsx";
import PricingSection from "../components/PricingSection.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function ServicePage() {
  return (
    <SubPage meta={pageMeta.service}>
      <PageHero
        eyebrow="SERVICE"
        title="サービス内容"
        lead="精神疾患のある方が、住み慣れた地域で安心して暮らせるよう、看護師などの専門職がご自宅にうかがい、医療と暮らしの両面から支援します。"
        crumbs={[
          { label: "ホーム", to: "/" },
          { label: "サービス内容" },
        ]}
      />
      <Toc
        items={[
          { id: "service", label: "提供するケア" },
          { id: "target", label: "対象・対応疾患" },
          { id: "fee", label: "料金・保険" },
        ]}
      />
      <ServicesGrid id="service" />
      <ConditionsSection id="target" />
      <Insurance />
      <PricingSection id="fee" />
      <CtaBand />
    </SubPage>
  );
}
