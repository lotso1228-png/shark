import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--nf-display",
  display: "swap",
});

const mincho = Shippori_Mincho({
  weight: ["400", "600", "700", "800"],
  variable: "--nf-mincho",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "LAST TALK — 卒業するその前に、聞いておきたい話がある。",
  description: "卒業生を送り出す懇親会のための、参加型トークゲーム。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${display.variable} ${mincho.variable}`}>
      <body>{children}</body>
    </html>
  );
}
