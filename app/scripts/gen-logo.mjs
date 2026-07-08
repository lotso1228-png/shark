import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const raw = fs.readFileSync('public/assets/logo.svg', 'utf8');
// inner markup of the logo (strip outer <svg ...> ... </svg>)
const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const png = (svgStr, width) =>
  new Resvg(svgStr, { fitTo: { mode: 'width', value: width } }).render().asPng();

// transparent standalone logo
fs.writeFileSync('public/assets/logo-512.png', png(raw, 512));

// side-by-side preview on white + navy
const preview = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320" viewBox="0 0 720 320">
  <rect width="360" height="320" fill="#ffffff"/>
  <rect x="360" width="360" height="320" fill="#2f5867"/>
  <g transform="translate(108,48) scale(1.2)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
  <g transform="translate(468,48) scale(1.2)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
  <text x="180" y="300" font-family="sans-serif" font-size="17" fill="#46606a" text-anchor="middle">ヘッダー（白背景）</text>
  <text x="540" y="300" font-family="sans-serif" font-size="17" fill="#ffffff" text-anchor="middle">フッター（濃紺背景）</text>
</svg>`;
fs.writeFileSync('scripts/logo-preview.png', png(preview, 720));
console.log('generated logo-512.png + logo-preview.png');
