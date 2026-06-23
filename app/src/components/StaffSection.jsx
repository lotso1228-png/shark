import { Link } from "react-router-dom";
import { staff } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** スタッフ紹介 (SAMPLE content — replace names/photos/words with real staff). */
export default function StaffSection({ id = "staff", compact = false, bg = "#fff" }) {
  return (
    <Section id={id} bg={bg} maxWidth={1080}>
      <SectionHeading label="STAFF" title="スタッフ紹介" className="mb-3" />
      <p className="text-center text-[14px] text-muted m-0 mb-9">
        <Jp>利用者様の気持ちに寄り添う、経験豊富なスタッフが対応します。</Jp>
      </p>

      <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-5">
        {staff.map((m) => (
          <figure
            key={m.name + m.role}
            className="m-0 bg-[#f6fcfe] border border-[#e3f4f8] rounded-[20px] overflow-hidden shadow-[0_8px_22px_rgba(20,130,150,0.07)]"
          >
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src={m.photo}
                alt=""
                className="w-full h-full object-cover block"
              />
            </div>
            <figcaption className="p-5">
              <p className="font-zen font-bold text-deep text-[16px] m-0">
                {m.name}
              </p>
              <p className="text-teal-600 text-[12.5px] font-bold m-0 mt-0.5 mb-2.5">
                {m.role}
              </p>
              <p className="text-[13.5px] text-muted m-0 leading-[1.85]">
                <Jp>{`「${m.words}」`}</Jp>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {compact && (
        <div className="text-center mt-8">
          <Link
            to="/company#staff"
            className="inline-flex items-center gap-1.5 text-teal-600 font-bold text-sm no-underline hover:gap-2.5 transition-all"
          >
            事業所・スタッフをくわしく見る <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}
