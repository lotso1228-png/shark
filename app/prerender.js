// Post-build prerender: render every route to static HTML with per-page
// title/description/canonical/OG + structured data, and emit sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

const {
  render,
  ROUTE_META,
  SITE_URL,
  PRERENDER_PATHS,
  faqFull,
} = await import("./dist-ssr/entry-server.js");

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const faqSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqFull.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
};

// JobPosting for Google しごと検索 (Google for Jobs).
// datePosted is FIXED (auto-updating it each build reads as freshness spoofing —
// update only when the posting genuinely reopens). 常時募集 → no validThrough;
// when hiring closes, remove this schema or set validThrough to a past date.
const JOB_DATE_POSTED = "2026-08-13";
const jobPostingSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "訪問看護師（正看護師・准看護師）",
    description:
      "<p>奈良県（橿原市・大和高田市を中心に県全域対応）の精神科特化型訪問看護ステーションで、利用者様のご自宅を訪問し、服薬支援・症状観察・傾聴・ご家族支援などを行う看護師を募集します。</p><p>訪問看護・精神科ともに未経験の方、ブランクのある方も歓迎。入職後は先輩看護師との同行訪問から始め、段階的にひとり立ちできる教育体制です。常勤・非常勤どちらも相談可能で、子育てと両立できる時短勤務等も相談できます。見学・カジュアル面談のみのご連絡も歓迎です。</p>",
    datePosted: JOB_DATE_POSTED,
    employmentType: ["FULL_TIME", "PART_TIME"],
    hiringOrganization: {
      "@type": "Organization",
      name: "訪問看護ステーションSHARK（株式会社B-Nuts）",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/assets/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        postalCode: "635-0057",
        addressRegion: "奈良県",
        addressLocality: "大和高田市",
        streetAddress: "南陽町5-19",
        addressCountry: "JP",
      },
    },
    qualifications: "正看護師または准看護師の免許（精神科・訪問看護の経験は不問）",
    industry: "訪問看護",
    workHours: "日勤帯中心（シフト・時短相談可、24時間対応のオンコールあり）",
    jobBenefits: "各種社会保険、交通費支給、未経験者教育制度（詳細は面談時にご案内）",
    directApply: true,
    url: `${SITE_URL}/recruit`,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
};

// BlogPosting schema for column articles.
const articleSchema = (a, canonical) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ja",
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "訪問看護ステーションSHARK" },
    publisher: {
      "@type": "Organization",
      name: "訪問看護ステーションSHARK",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.png` },
    },
    image: `${SITE_URL}/assets/og-image.png`,
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
};

for (const route of PRERENDER_PATHS) {
  const meta = ROUTE_META[route];
  const appHtml = render(route);
  const canonical = SITE_URL + route;

  let head = "";
  head += `<link rel="canonical" href="${canonical}"/>`;
  head += `<meta property="og:url" content="${canonical}"/>`;
  if (route === "/") head += `<link rel="preload" as="image" href="/assets/photos/ph-hero.png"/>`;
  if (route === "/faq") head += faqSchema();
  if (route === "/recruit") head += jobPostingSchema();
  if (meta.article) head += articleSchema(meta.article, canonical);

  let html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(
      /(<meta name="description" content=")[\s\S]*?(")/,
      `$1${esc(meta.description)}$2`
    )
    .replace(
      /(<meta property="og:title" content=")[\s\S]*?(")/,
      `$1${esc(meta.title)}$2`
    )
    .replace(
      /(<meta property="og:description" content=")[\s\S]*?(")/,
      `$1${esc(meta.description)}$2`
    )
    .replace("</head>", `${head}</head>`);

  const outDir = route === "/" ? distDir : path.join(distDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`prerendered ${route} -> ${path.relative(__dirname, outDir)}/index.html`);
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PRERENDER_PATHS.map(
    (p) =>
      `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod>` +
      `<changefreq>monthly</changefreq><priority>${
        p === "/" ? "1.0" : p.startsWith("/column/") ? "0.6" : "0.8"
      }</priority></url>`
  ).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log("wrote sitemap.xml");
