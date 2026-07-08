import { Link } from "react-router-dom";
import { flowDetailed } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/**
 * ご利用開始までの流れ — numbered timeline.
 * compact=true → home teaser (titles only, link to full page).
 */
export default function FlowSteps({ id = "flow", compact = false, bg = "#ece3d1" }) {
  const items = flowDetailed;
  return (
    <Section id={id} bg={bg} maxWidth={920}>
      <SectionHeading label="FLOW" title="ご利用開始までの流れ" className="mb-10" />

      <ol className="list-none m-0 p-0 relative">
        {items.map((st, i) => (
          <li key={st.n} className="flex gap-4 min-[560px]:gap-6 pb-6 last:pb-0">
            {/* number + connector */}
            <div className="flex flex-col items-center flex-none">
              <span className="w-11 h-11 rounded-full bg-teal text-white flex items-center justify-center font-zen font-bold text-[18px] shadow-[0_6px_14px_rgba(20,179,197,0.3)]">
                {st.n}
              </span>
              {i < items.length - 1 && (
                <span className="w-px flex-1 bg-[#d8c8ac] mt-1" aria-hidden="true" />
              )}
            </div>
            {/* card */}
            <div className="flex-1 bg-white rounded-[18px] p-5 min-[560px]:p-6 shadow-[0_6px_18px_rgba(20,130,150,0.07)] -mt-0.5">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-zen font-bold text-[16.5px] text-deep m-0">
                  <Jp>{st.title}</Jp>
                </h3>
                <img
                  src={st.img}
                  alt=""
                  className="w-7 h-7 object-contain ml-auto opacity-90"
                />
              </div>
              {!compact && (
                <p className="text-[14px] text-muted m-0 leading-[1.9]">
                  <Jp>{st.desc}</Jp>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {compact && (
        <div className="text-center mt-8">
          <Link
            to="/flow"
            className="inline-flex items-center gap-1.5 text-teal-600 font-bold text-sm no-underline hover:gap-2.5 transition-all"
          >
            流れと対応エリアをくわしく見る <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}
