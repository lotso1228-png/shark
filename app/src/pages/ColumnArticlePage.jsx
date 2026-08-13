import { Link, useParams } from "react-router-dom";
import SubPage from "../components/SubPage.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Jp from "../components/Jp.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { SITE_NAME } from "../routes.js";
import { getArticle, articles } from "../articles.js";

export default function ColumnArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug);
  if (!article) return <NotFoundPage />;

  const others = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <SubPage
      meta={{
        title: `${article.title}｜${SITE_NAME}`,
        description: article.description,
      }}
    >
      {/* Article header */}
      <section
        className="px-[22px] pt-[104px] pb-[42px]"
        style={{
          background:
            "linear-gradient(170deg,#fdf8ef 0%,#f3ebda 55%,#fdf9f1 100%)",
        }}
      >
        <div className="max-w-[780px] mx-auto">
          <Breadcrumbs
            items={[
              { label: "ホーム", to: "/" },
              { label: "コラム", to: "/column" },
              { label: article.title },
            ]}
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-white text-[#2f5867] text-[12px] font-bold rounded-full px-3 py-1">
              {article.category}
            </span>
            <time dateTime={article.date} className="text-[12.5px] text-muted">
              {article.date.replaceAll("-", ".")}
            </time>
          </div>
          <h1 className="font-zen font-black text-deep m-0 text-[clamp(22px,3.4vw,32px)] leading-[1.45]">
            <Jp>{article.title}</Jp>
          </h1>
        </div>
      </section>

      {/* Body */}
      <article className="px-[22px] py-[clamp(40px,6vw,64px)] bg-[#fcf6ed]">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[15.5px] text-ink leading-[2.05] m-0 mb-9">
            <Jp>{article.intro}</Jp>
          </p>

          {article.sections.map((s) => (
            <section key={s.h2} className="mb-10">
              <h2 className="font-zen font-bold text-deep text-[clamp(18px,2.4vw,22px)] m-0 mb-4 flex items-start gap-2.5 leading-[1.6]">
                <span
                  className="w-1.5 self-stretch rounded bg-teal inline-block flex-none"
                  aria-hidden="true"
                />
                <Jp>{s.h2}</Jp>
              </h2>
              {s.ps?.slice(0, s.list ? 1 : undefined).map((p, i) => (
                <p key={i} className="text-[15px] text-ink leading-[2.05] m-0 mb-4">
                  <Jp>{p}</Jp>
                </p>
              ))}
              {s.list && (
                <ul className="list-none m-0 mb-4 p-0 flex flex-col gap-2.5 bg-white rounded-[16px] p-5 border border-[#e8dec9]">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="flex-none w-[20px] h-[20px] rounded-full bg-teal text-white flex items-center justify-center text-[11px] font-bold mt-1">
                        ✓
                      </span>
                      <span className="text-[14px] text-ink leading-[1.9]">
                        <Jp>{item}</Jp>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {s.list &&
                s.ps?.slice(1).map((p, i) => (
                  <p key={i} className="text-[15px] text-ink leading-[2.05] m-0 mb-4">
                    <Jp>{p}</Jp>
                  </p>
                ))}
              {s.note && (
                <p className="text-[12.5px] text-muted leading-[1.9] m-0 bg-white/70 rounded-xl px-4 py-3">
                  <Jp>{s.note}</Jp>
                </p>
              )}
            </section>
          ))}

          {/* Related links */}
          <div className="bg-white border border-[#e8dec9] rounded-[18px] p-6 mb-4">
            <p className="font-zen font-bold text-deep text-[15px] m-0 mb-3">
              あわせて読みたい・ご案内
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {article.related.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="inline-flex items-center gap-1.5 no-underline text-teal-600 font-bold text-[14px] hover:underline"
                  >
                    <span aria-hidden="true">→</span> {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      {/* Other articles */}
      <section className="px-[22px] py-[clamp(40px,6vw,64px)] bg-[#f0e8d6]">
        <div className="max-w-[860px] mx-auto">
          <h2 className="font-zen font-bold text-deep text-[clamp(18px,2.4vw,22px)] m-0 mb-5">
            ほかの記事
          </h2>
          <div className="grid grid-cols-1 min-[680px]:grid-cols-3 gap-4">
            {others.map((a) => (
              <Link
                key={a.slug}
                to={`/column/${a.slug}`}
                className="block no-underline bg-white rounded-[16px] p-5 shadow-[0_6px_18px_rgba(20,130,150,0.06)] transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="text-[11.5px] font-bold text-muted">
                  {a.category}
                </span>
                <p className="font-zen font-bold text-deep text-[14px] m-0 mt-1.5 leading-[1.65]">
                  <Jp>{a.title}</Jp>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </SubPage>
  );
}
