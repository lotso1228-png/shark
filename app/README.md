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
- **React Router v6** — ナビ項目ごとに独立したページ（マルチページ）
- **Tailwind CSS v4**（`@tailwindcss/vite` プラグイン、設定は `src/index.css` の `@theme`）
- フォント: Zen Maru Gothic（見出し）/ Noto Sans JP（本文）

### ルーティング

| パス        | ページ            | 内容                                   |
| ----------- | ----------------- | -------------------------------------- |
| `/`         | ホーム            | ヒーロー＋お悩み＋選ばれる理由＋CTA    |
| `/service`  | サービス内容      | サービス4種＋医療保険・自立支援医療制度 |
| `/flow`     | ご利用の流れ      | 利用開始までの流れ＋対応エリア (`#area`) |
| `/faq`      | よくある質問      | FAQアコーディオン                      |
| `/company`  | 事業所概要        | 概要テーブル                           |
| `/recruit`  | 採用情報          | 採用カード                             |
| `/contact`  | お問い合わせ      | 最終CTA                                |
| `*`         | 404               | NotFound                               |

Header / Footer は全ページ共通の `Layout`（`<Outlet/>`）として共有。
ルートとナビは `src/routes.js` に集約（single source of truth）。

```
src/
  main.jsx             BrowserRouter で App をラップ
  App.jsx              <Routes> 定義（Layout + 各ページ）
  routes.js            ルート/ナビ/各ページ meta の単一定義
  data.js              コピー・アセット参照（デザインの renderVals を 1:1 で移植）
  index.css            Tailwind 読み込み + テーマ(配色/フォント) + keyframes
  hooks/
    useReveal.js       スクロール時フェードイン (IntersectionObserver)
    useDocumentMeta.js ページごとの <title> / description 設定
  components/
    Layout.jsx         Header + Outlet + Footer + ScrollToTop
    ScrollToTop.jsx    ルート遷移時のスクロール制御（ハッシュ対応）
    SubPage.jsx        サブページ共通ラッパ（ヘッダー余白 + meta）
    ui.jsx             Reveal / SectionHeading / ContactButtons (共通UI)
    Header.jsx         固定ヘッダー + スマホ用ハンバーガー（Router Link / アクティブ表示）
    Footer.jsx         フッター（Router Link）
    Hero.jsx           ヒーロー
    Worries.jsx        お悩み (CHECK)
    Reasons.jsx        選ばれる理由 (REASON)
    Services.jsx       サービス内容 (SERVICE)
    Insurance.jsx      医療保険・自立支援医療制度
    FlowArea.jsx       ご利用の流れ + 対応エリア
    Recruit.jsx        採用情報
    Faq.jsx            よくある質問 (アコーディオン)
    Company.jsx        事業所概要 (COMPANY)
    FinalCta.jsx       最終CTA
  pages/               各ルートのページ（上表）
public/assets/         デザインの透過素材・写真（project/assets からコピー）
```

> Vercel では `vercel.json` の `rewrites` で全パスを `index.html` にフォールバックし、
> `/service` などへの直接アクセス・リロードでも 404 にならないようにしています。

## 再現した要素

- 全11セクション（ヘッダー固定・スクロール追従、ヒーロー、お悩み、選ばれる理由、
  サービス4枚、医療保険・自立支援、流れ＋対応エリア、採用＋FAQ、事業所概要、最終CTA、フッター）
- 配色（ティール×水色×やわらかいピンク）と丸ゴシックの親しみある雰囲気
- インタラクション: ボタンホバー、スクロールでのフェードイン、FAQアコーディオン、
  レスポンシブ（880px でデスクトップ⇄ハンバーガー切替）
- 透過素材・実写真をデザイン通りに配置
