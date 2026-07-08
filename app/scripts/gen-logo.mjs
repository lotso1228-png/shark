import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const raw = fs.readFileSync('public/assets/logo.svg', 'utf8');
const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const png = (svgStr, width) =>
  new Resvg(svgStr, { fitTo: { mode: 'width', value: width } }).render().asPng();

const CREAM = '#f5efe2';

// apple-touch / favicon: logo on a cream rounded square
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="36" fill="${CREAM}"/>
  <g transform="translate(26,34)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
</svg>`;
fs.writeFileSync('public/assets/favicon-180.png', png(icon, 180));

// OGP 1200x630: cream bg + logo + SHARK wordmark
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect x="0" y="0" width="1200" height="12" fill="#15b4c5"/>
  <g transform="translate(430,120) scale(2.6)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
  <text x="600" y="500" font-family="sans-serif" font-size="96" font-weight="700" fill="#2f5867" text-anchor="middle" letter-spacing="6">SHARK</text>
  <text x="600" y="558" font-family="sans-serif" font-size="30" font-weight="700" fill="#0f97a8" text-anchor="middle" letter-spacing="4">HOME-VISIT NURSING</text>
</svg>`;
fs.writeFileSync('public/assets/og-image.png', png(og, 1200));

// side-by-side preview on cream (header) + navy (footer)
const preview = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320" viewBox="0 0 720 320">
  <rect width="360" height="320" fill="${CREAM}"/>
  <rect x="360" width="360" height="320" fill="#2f5867"/>
  <g transform="translate(108,48) scale(1.2)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
  <g transform="translate(468,48) scale(1.2)"><svg viewBox="0 0 128 112" width="128" height="112">${inner}</svg></g>
  <text x="180" y="300" font-family="sans-serif" font-size="16" fill="#46606a" text-anchor="middle">header (cream)</text>
  <text x="540" y="300" font-family="sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">footer (navy)</text>
</svg>`;
fs.writeFileSync('scripts/logo-preview.png', png(preview, 720));

console.log('generated favicon-180.png, og-image.png, logo-preview.png');
