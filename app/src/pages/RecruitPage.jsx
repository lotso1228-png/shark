import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import Toc from "../components/Toc.jsx";
import Recruit from "../components/Recruit.jsx";
import RecruitDetails from "../components/RecruitDetails.jsx";
import RecruitDayFlow from "../components/RecruitDayFlow.jsx";
import RecruitVoices from "../components/RecruitVoices.jsx";
import RecruitFaqSection from "../components/RecruitFaqSection.jsx";
import RecruitApply from "../components/RecruitApply.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { pageMeta } from "../routes.js";
import { recruitBadges } from "../content.js";

export default function RecruitPage() {
  return (
    <SubPage meta={pageMeta.recruit}>
      <PageHero
        eyebrow="RECRUIT"
        title="看護師募集（正・准／常勤・非常勤）"
        lead="利用者様の暮らしに寄り添う看護師を募集しています。精神科訪問看護が未経験の方、ブランクのある方、子育て中の方も歓迎です。見学・カジュアル面談だけでも、お気軽にどうぞ。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "採用情報" }]}
      >
        <div className="flex flex-wrap gap-2 mt-5">
          {recruitBadges.map((b) => (
            <span
              key={b}
              className="bg-white text-pink font-bold text-[13px] rounded-full px-3.5 py-1.5 shadow-[0_3px_10px_rgba(200,140,120,0.14)]"
            >
              {b}
            </span>
          ))}
        </div>
      </PageHero>
      <Toc
        items={[
          { id: "points", label: "働く魅力" },
          { id: "onboarding", label: "教育体制" },
          { id: "requirements", label: "募集要項" },
          { id: "dayflow", label: "1日の流れ" },
          { id: "voices", label: "先輩の声" },
          { id: "recruit-faq", label: "採用FAQ" },
          { id: "apply-form", label: "応募・見学申込" },
        ]}
      />
      <Recruit />
      <RecruitDetails />
      <RecruitDayFlow />
      <RecruitVoices />
      <RecruitFaqSection />
      <RecruitApply />
      <CtaBand
        title="迷っている段階でも、話してみませんか？"
        lead="転職を決めていなくても大丈夫です。仕事内容や働き方について、まずは気軽にお話ししましょう。"
        showMascot={false}
      />
    </SubPage>
  );
}
