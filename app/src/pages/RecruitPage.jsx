import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import Recruit from "../components/Recruit.jsx";
import RecruitDetails from "../components/RecruitDetails.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";

export default function RecruitPage() {
  return (
    <SubPage meta={pageMeta.recruit}>
      <PageHero
        eyebrow="RECRUIT"
        title="採用情報"
        lead="利用者様の暮らしに寄り添う看護師を募集しています。精神科訪問看護が未経験の方、ブランクのある方、子育て中の方もご相談ください。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "採用情報" }]}
      />
      <Toc
        items={[
          { id: "points", label: "働く魅力" },
          { id: "requirements", label: "募集要項" },
          { id: "apply", label: "応募の流れ" },
        ]}
      />
      <Recruit />
      <RecruitDetails />
      <CtaBand
        title="まずは見学・ご相談から"
        lead="「話を聞いてみたい」「職場を見てみたい」だけでも歓迎です。お気軽にお問い合わせください。"
        showMascot={false}
      />
    </SubPage>
  );
}
