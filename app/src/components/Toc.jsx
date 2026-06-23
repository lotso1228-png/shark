/**
 * 目次 (table of contents) for long pages. items: [{ id, label }].
 * Anchor links smooth-scroll to in-page sections (scroll-margin handles offset).
 */
export default function Toc({ items = [] }) {
  return (
    <nav
      aria-label="目次"
      className="max-w-[1100px] mx-auto px-[22px] -mt-3 mb-2"
    >
      <div className="bg-white border border-[#e3f4f8] rounded-2xl px-5 py-4 shadow-[0_6px_18px_rgba(20,130,150,0.06)]">
        <p className="font-zen font-bold text-deep text-sm m-0 mb-2.5">目次</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className="inline-flex items-center gap-1.5 no-underline text-[13.5px] text-slate hover:text-teal transition-colors"
              >
                <span className="text-teal" aria-hidden="true">
                  ●
                </span>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
