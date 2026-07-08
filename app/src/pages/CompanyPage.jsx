import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import Philosophy from "../components/Philosophy.jsx";
import Greeting from "../components/Greeting.jsx";
import Company from "../components/Company.jsx";
import StaffSection from "../components/StaffSection.jsx";
import AccessSection from "../components/AccessSection.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function CompanyPage() {
  return (
    <SubPage meta={pageMeta.company}>
      <PageHero
        eyebrow="COMPANY"
        title="事業所概要"
        lead="訪問看護ステーションSHARK（株式会社B-Nuts）の理念・代表挨拶・事業所情報・スタッフ・アクセスをご紹介します。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "事業所概要" }]}
      />
      <Toc
        items={[
          { id: "philosophy", label: "理念" },
          { id: "greeting", label: "代表挨拶" },
          { id: "outline", label: "事業所情報" },
          { id: "staff", label: "スタッフ紹介" },
          { id: "access", label: "アクセス" },
        ]}
      />
      <Philosophy id="philosophy" />
      <Greeting id="greeting" />
      <Company id="outline" />
      <StaffSection id="staff" bg="#f0e8d6" />
      <AccessSection id="access" bg="#fcf6ed" />
      <CtaBand />
    </SubPage>
  );
}
