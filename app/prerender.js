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

for (const route of PRERENDER_PATHS) {
  const meta = ROUTE_META[route];
  const appHtml = render(route);
  const canonical = SITE_URL + route;

  let head = "";
  head += `<link rel="canonical" href="${canonical}"/>`;
  head += `<meta property="og:url" content="${canonical}"/>`;
  if (route === "/faq") head += faqSchema();

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
      `<changefreq>monthly</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`
  ).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log("wrote sitemap.xml");
