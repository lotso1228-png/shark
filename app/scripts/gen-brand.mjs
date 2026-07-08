// Build brand images from the real uploaded logo:
// - logo.png (canonical, used by header/footer/favicon)
// - favicon-180.png (logo on cream square)
// - og-image.png (1200x630 cream card + logo + SHARK wordmark)
// Also prints the sampled cream background color so the site can match it.
import Jimp from 'jimp';
import fs from 'node:fs';

// Regenerate favicon/OGP from the canonical logo. Overwrite logo.png with new
// artwork, then run `node scripts/gen-brand.mjs` to refresh favicon + OGP.
const SRC = 'public/assets/logo.png';

const logo = await Jimp.read(SRC);
const c = Jimp.intToRGBA(logo.getPixelColor(3, 3)); // corner = cream background
const hex = '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('');
const cream = Jimp.rgbaToInt(c.r, c.g, c.b, 255);
console.log(`SAMPLED_CREAM=${hex}  size=${logo.bitmap.width}x${logo.bitmap.height}`);

// favicon 180 square on cream
const fav = new Jimp(180, 180, cream);
const l1 = logo.clone().resize(150, Jimp.AUTO);
fav.composite(l1, Math.round((180 - l1.bitmap.width) / 2), Math.round((180 - l1.bitmap.height) / 2));
await fav.writeAsync('public/assets/favicon-180.png');

// OGP 1200x630 cream + logo + wordmark
const og = new Jimp(1200, 630, cream);
const bar = new Jimp(1200, 12, Jimp.rgbaToInt(21, 180, 197, 255));
og.composite(bar, 0, 0);
const l2 = logo.clone().resize(Jimp.AUTO, 360);
og.composite(l2, Math.round((1200 - l2.bitmap.width) / 2), 110);
const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
const txt = 'SHARK';
const tw = Jimp.measureText(font, txt);
og.print(font, Math.round((1200 - tw) / 2), 470, txt);
await og.writeAsync('public/assets/og-image.png');

console.log('generated logo.png, favicon-180.png, og-image.png');
