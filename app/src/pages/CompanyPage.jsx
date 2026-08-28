import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import Philosophy from "../components/Philosophy.jsx";
import Company from "../components/Company.jsx";
import AccessSection from "../components/AccessSection.jsx";
import RelatedSites from "../components/RelatedSites.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function CompanyPage() {
  return (
    <SubPage meta={pageMeta.company}>
      <PageHero
        eyebrow="COMPANY"
        title="事業所概要"
        lead="訪問看護ステーションSHARK（株式会社B-Nuts）の理念・事業所情報・アクセス・関連事業所をご紹介します。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "事業所概要" }]}
      />
      <Toc
        items={[
          { id: "philosophy", label: "理念" },
          { id: "outline", label: "事業所情報" },
          { id: "access", label: "アクセス" },
          { id: "related", label: "関連事業所" },
        ]}
      />
      <Philosophy id="philosophy" />
      <Company id="outline" />
      <AccessSection id="access" bg="#f0e8d6" />
      <RelatedSites id="related" bg="#f0e8d6" />
      <CtaBand />
    </SubPage>
  );
}
