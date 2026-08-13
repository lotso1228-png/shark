import { Link } from "react-router-dom";
import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { Section } from "../components/ui.jsx";
import Jp from "../components/Jp.jsx";
import { pageMeta } from "../routes.js";
import { articles } from "../articles.js";

export default function ColumnListPage() {
  return (
    <SubPage meta={pageMeta.column}>
      <PageHero
        eyebrow="COLUMN"
        title="コラム・お役立ち情報"
        lead="精神科訪問看護のこと、費用や制度のこと、ご家族の関わり方のこと。知っておくと安心な情報をわかりやすくお届けします。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "コラム" }]}
      />
      <Section bg="#fcf6ed" maxWidth={860}>
        <div className="flex flex-col gap-4">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/column/${a.slug}`}
              className="block no-underline bg-white border border-[#e8dec9] rounded-[18px] p-6 shadow-[0_6px_18px_rgba(20,130,150,0.06)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#f0e8d6] text-[#2f5867] text-[12px] font-bold rounded-full px-3 py-1">
                  {a.category}
                </span>
                <time dateTime={a.date} className="text-[12px] text-muted">
                  {a.date.replaceAll("-", ".")}
                </time>
              </div>
              <h2 className="font-zen font-bold text-deep text-[17px] m-0 mb-2 leading-[1.6]">
                <Jp>{a.title}</Jp>
              </h2>
              <p className="text-[13.5px] text-muted m-0 leading-[1.85]">
                <Jp>{a.description}</Jp>
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-teal-600 font-bold text-[13.5px]">
                読む <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </SubPage>
  );
}
