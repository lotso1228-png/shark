import { Link } from "react-router-dom";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";
import { articles } from "../articles.js";

/**
 * 採用ページから看護師向けコラムへの導線。
 * 「まだ応募までは決めきれない」段階の方に読み物を用意し、
 * 内部リンクでコラム側の評価も高める。
 */
export default function RecruitColumns() {
  const posts = [...articles]
    .filter((a) => a.category === "看護師向け")
    .sort((a, b) => b.date.localeCompare(a.date));

  if (posts.length === 0) return null;

  return (
    <Section id="recruit-columns" bg="#f0e8d6" maxWidth={900}>
      <SectionHeading
        label="COLUMN"
        title="転職を考えている看護師さんへ"
        className="mb-3"
      />
      <p className="text-center text-[14px] text-muted m-0 mb-9">
        <Jp>応募を決める前に。訪問看護の実際について書いた記事です。</Jp>
      </p>
      <div className="grid grid-cols-1 min-[720px]:grid-cols-2 gap-4">
        {posts.map((a) => (
          <Link
            key={a.slug}
            to={`/column/${a.slug}`}
            className="block no-underline bg-white border border-[#e8dec9] rounded-[18px] p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <h3 className="font-zen font-bold text-deep text-[16px] m-0 mb-2 leading-[1.6]">
              <Jp>{a.title}</Jp>
            </h3>
            <p className="text-[13px] text-muted m-0 leading-[1.85]">
              <Jp>{a.description}</Jp>
            </p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-teal-600 font-bold text-[13.5px]">
              読む <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
