import { testimonials } from "../content.js";
import { Section, SectionHeading } from "./ui.jsx";
import Jp from "./Jp.jsx";

/** 利用者さま・ご家族の声 (SAMPLE — replace with real, consented voices). */
export default function Testimonials({ id = "voice", bg = "#ece3d1" }) {
  return (
    <Section id={id} bg={bg} maxWidth={1080}>
      <SectionHeading label="VOICE" title="利用者さま・ご家族の声" className="mb-9" />
      <div className="grid grid-cols-1 min-[760px]:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <figure
            key={t.who}
            className="m-0 bg-white rounded-[20px] p-6 shadow-[0_8px_22px_rgba(20,130,150,0.07)] flex flex-col"
          >
            <span
              className="font-zen text-teal text-[40px] leading-none"
              aria-hidden="true"
            >
              “
            </span>
            <blockquote className="m-0 text-[14px] text-ink leading-[1.95] flex-1">
              <Jp>{t.text}</Jp>
            </blockquote>
            <figcaption className="text-[12.5px] text-muted font-bold mt-4">
              — {t.who}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-[11.5px] text-muted text-center m-0 mt-6">
        ※ 掲載内容はサンプルです。実際の感想は個人により異なります。
      </p>
    </Section>
  );
}
