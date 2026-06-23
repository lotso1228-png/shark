import { Link } from "react-router-dom";

/**
 * パンくずリスト. items: [{ label, to? }] — last item is the current page.
 * Emits schema.org BreadcrumbList markup for SEO.
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="パンくずリスト"
      className="text-[12.5px] text-muted mb-3"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex flex-wrap items-center gap-1.5 list-none m-0 p-0">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={it.label}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {last || !it.to ? (
                <span itemProp="name" className="text-slate font-medium">
                  {it.label}
                </span>
              ) : (
                <Link
                  to={it.to}
                  itemProp="item"
                  className="no-underline text-teal-600 hover:underline"
                >
                  <span itemProp="name">{it.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(i + 1)} />
              {!last && <span className="text-[#9fc0c9]">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
