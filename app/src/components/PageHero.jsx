import Breadcrumbs from "./Breadcrumbs.jsx";

/**
 * Intentional page-title band for sub-pages: breadcrumb + eyebrow + h1 + lead.
 * Handles the fixed-header offset itself (pt clears the 66px header).
 */
export default function PageHero({ eyebrow, title, lead, crumbs }) {
  return (
    <section
      className="relative overflow-hidden px-[22px] pt-[104px] pb-[48px]"
      style={{
        background:
          "linear-gradient(170deg,#eafaff 0%,#e3f5fb 55%,#f4fcff 100%)",
      }}
    >
      <img
        src="/assets/leaf-branch.png"
        alt=""
        className="hidden min-[680px]:block absolute bottom-3 right-[5%] w-[70px] opacity-60"
      />
      <div className="max-w-[1100px] mx-auto relative z-[2]">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <p className="text-teal-600 font-bold text-[13px] tracking-[0.14em] m-0 mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-zen font-black text-deep m-0 text-[clamp(26px,4vw,40px)] leading-[1.3]">
          {title}
        </h1>
        {lead && (
          <p className="text-[15.5px] text-muted-2 mt-4 mb-0 max-w-[760px]">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
