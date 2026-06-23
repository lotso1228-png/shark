# 訪問看護ステーションSHARK — Landing Page

奈良県全域対応・精神科訪問看護ステーション「SHARK」のランディングページ。
Claude Design からエクスポートされた DC プロトタイプ（`../project/SHARK訪問看護LP.dc.html`）を
**React + Vite + Tailwind CSS** で忠実に再実装したものです。

## 開発

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:5173)
npm run build    # 本番ビルド -> dist/
npm run preview  # ビルド結果をプレビュー
```

## 構成

- **React 18 + Vite 6** — コンポーネントベース構成
- **Tailwind CSS v4**（`@tailwindcss/vite` プラグイン、設定は `src/index.css` の `@theme`）
- フォント: Zen Maru Gothic（見出し）/ Noto Sans JP（本文）

```
src/
  App.jsx              全セクションの組み立て
  data.js              コピー・アセット参照（デザインの renderVals を 1:1 で移植）
  index.css            Tailwind 読み込み + テーマ(配色/フォント) + keyframes
  hooks/useReveal.js   スクロール時フェードイン (IntersectionObserver)
  components/
    ui.jsx             Reveal / SectionHeading / ContactButtons (共通UI)
    Header.jsx         固定ヘッダー + スマホ用ハンバーガーメニュー
    Hero.jsx           ヒーロー
    Worries.jsx        お悩み (CHECK)
    Reasons.jsx        選ばれる理由 (REASON)
    Services.jsx       サービス内容 (SERVICE)
    Insurance.jsx      医療保険・自立支援医療制度
    FlowArea.jsx       ご利用の流れ + 対応エリア
    RecruitFaq.jsx     採用情報 + よくある質問 (アコーディオン)
    Company.jsx        事業所概要 (COMPANY)
    FinalCta.jsx       最終CTA
    Footer.jsx         フッター
public/assets/         デザインの透過素材・写真（project/assets からコピー）
```

## 再現した要素

- 全11セクション（ヘッダー固定・スクロール追従、ヒーロー、お悩み、選ばれる理由、
  サービス4枚、医療保険・自立支援、流れ＋対応エリア、採用＋FAQ、事業所概要、最終CTA、フッター）
- 配色（ティール×水色×やわらかいピンク）と丸ゴシックの親しみある雰囲気
- インタラクション: ボタンホバー、スクロールでのフェードイン、FAQアコーディオン、
  レスポンシブ（880px でデスクトップ⇄ハンバーガー切替）
- 透過素材・実写真をデザイン通りに配置
