import { relatedSites } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/**
 * 関連事業所 — genuine partner-site links (no nofollow: these are real,
 * editorially relevant related services in the same area).
 */
export default function RelatedSites({ id = "related", bg = "#f0e8d6" }) {
  return (
    <Section id={id} bg={bg} maxWidth={920}>
      <SectionHeading label="RELATED" title="関連事業所" className="mb-3" />
      <p className="text-center text-[14px] text-muted m-0 mb-9">
        <Jp>
          地域で暮らしを支える、関連するサービスをご紹介します。住まいのご相談もあわせて承ります。
        </Jp>
      </p>

      {relatedSites.map((s) => (
        <div
          key={s.url}
          className="bg-white border border-[#e8dec9] rounded-[20px] p-6 min-[560px]:p-8 shadow-[0_8px_22px_rgba(20,130,150,0.07)]"
        >
          <h3 className="font-zen font-bold text-deep text-[19px] m-0 mb-1.5">
            {s.name}
          </h3>
          <p className="text-teal-600 text-[13px] font-bold m-0 mb-4">
            {s.service}
          </p>
          <p className="text-[14.5px] text-ink leading-[1.95] m-0 mb-6">
            <Jp>{s.desc}</Jp>
          </p>

          <dl className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-x-6 gap-y-2 m-0 mb-6">
            {s.meta.map((m) => (
              <div key={m.k} className="flex gap-2 text-[13px] leading-[1.8]">
                <dt className="flex-none w-[74px] text-muted font-bold m-0">
                  {m.k}
                </dt>
                <dd className="flex-1 text-ink m-0">
                  <Jp>{m.v}</Jp>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-teal text-white no-underline font-bold text-[15px] shadow-[0_10px_22px_rgba(20,179,197,0.28)] transition-transform duration-200 hover:-translate-y-[3px]"
          >
            {s.name}のサイトを見る <span aria-hidden="true">→</span>
          </a>
        </div>
      ))}
    </Section>
  );
}
