// スマホだけで使えるよう、アプリ全体を1つの HTML ファイルにまとめる。
// 出力: standalone/last-talk.html（どこに置いても、開くだけで動く）
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUT_DIR = "standalone";
mkdirSync(OUT_DIR, { recursive: true });

execFileSync("npx", ["@tailwindcss/cli", "-i", "src/app/globals.css", "-o", `${OUT_DIR}/app.css`, "--minify"], {
  stdio: "inherit",
});

const js = await build({
  stdin: {
    contents: `
      import { createRoot } from "react-dom/client";
      import { App } from "@/components/App";
      createRoot(document.getElementById("root")).render(<App />);
    `,
    loader: "tsx",
    resolveDir: ".",
  },
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "error",
});

const css = readFileSync(`${OUT_DIR}/app.css`, "utf8");
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const html = `<title>LAST TALK</title>
<meta name="theme-color" content="#07090f">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Shippori+Mincho:wght@400;600;700;800&display=swap">
<style>
:root{--nf-display:"Cormorant Garamond";--nf-mincho:"Shippori Mincho";color-scheme:dark}
html{box-sizing:border-box;height:100%;background:#07090f}
body,#root{height:100%}
main.stage{height:100%!important}
${css}
</style>
<div id="root"></div>
<script>${script}</script>
`;
writeFileSync(`${OUT_DIR}/last-talk.html`, html);
console.log(`standalone/last-talk.html  ${(html.length / 1024).toFixed(0)} KB`);

// GitHub Pages など、普通の Web サーバーに置く用（完全な HTML 文書）
mkdirSync("site", { recursive: true });
const page = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="description" content="卒業するその前に、聞いておきたい話がある。">
${html.replace("<div id=\"root\"></div>", "</head>\n<body style=\"margin:0\">\n<div id=\"root\"></div>")}
</body>
</html>
`;
writeFileSync("site/index.html", page);
writeFileSync("site/.nojekyll", "");
console.log("site/index.html");
