# 訪問看護ステーションSHARK — Landing Site

奈良県全域対応・精神科訪問看護ステーション「SHARK」のウェブサイト。
Claude Design の DC プロトタイプ（`../project/SHARK訪問看護LP.dc.html`）をベースに、
競合分析・読みやすさ調査・専門領域のファクトチェックを反映して
**React + Vite + Tailwind CSS** のマルチページサイトへ拡充したものです。

## 開発

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:5173)
npm run build    # 本番ビルド -> dist/
npm run preview  # ビルド結果をプレビュー
```

## 技術構成

- **React 18 + Vite 6** — コンポーネントベース
- **React Router v6** — ナビ項目ごとの独立ページ（マルチページ）
- **Tailwind CSS v4**（`@tailwindcss/vite`、テーマは `src/index.css` の `@theme`）
- フォント: Zen Maru Gothic（見出し）/ Noto Sans JP（本文）

### ルーティングと主な内容

| パス | ページ | 主なセクション |
|---|---|---|
| `/` | ホーム | ヒーロー／数字で見る／お悩み／選ばれる理由／サービス／対象・対応疾患／スタッフ／流れ／利用者の声／CTA |
| `/service` | サービス内容 | 提供するケア(8)／対象・対応疾患／医療保険・自立支援／**料金（自立支援の月額上限表）** |
| `/flow` | ご利用の流れ | 7ステップの流れ（詳細）／対応エリア（市町村＋地図） |
| `/faq` | よくある質問 | カテゴリ別アコーディオン（17問・WAI-ARIA対応） |
| `/company` | 事業所概要 | 理念／代表挨拶／事業所情報／スタッフ紹介／アクセス（地図） |
| `/recruit` | 採用情報 | 働く魅力／募集要項／応募の流れ |
| `/contact` | お問い合わせ | 電話・LINE・メール／相談フォーム／アクセス |
| `*` | 404 | NotFound |

Header / Footer は共通 `Layout`（`<Outlet/>`）。ルート・ナビ・各ページ meta は
`src/routes.js` に集約（single source of truth）。

```
src/
  main.jsx / App.jsx / routes.js
  data.js              連絡先・短いコピー・アセット参照
  content.js           ★ファクトチェック済みの本文（対応疾患/料金/FAQ/理念ほか）
  index.css            Tailwind + テーマ + a11y（フォーカス/動き軽減）
  hooks/               useReveal（スクロール演出）/ useDocumentMeta（title・description）
  components/
    Layout / Header / Footer / ScrollToTop
    FloatingCta        スマホ固定の電話・LINE・メールバー
    BackToTop          ページトップへ戻る
    Breadcrumbs        パンくず（schema.org 構造化データ）
    PageHero / Toc / SubPage / Section(ui)   ページ骨格・目次
    Hero / StatsBand / Worries / Reasons
    Services / ServicesGrid / ConditionsSection / Insurance / PricingSection
    FlowSteps / AreaSection
    Philosophy / Greeting / Company / StaffSection / AccessSection
    Recruit / RecruitDetails
    Faq / Testimonials / ContactForm / CtaBand
  pages/               各ルート
public/assets/         透過素材・写真
```

## 「見やすさ」「信頼性」のための実装（調査ベース）

- **日本語の改行制御（BudouX）**: 文章を文節単位に分割し `word-break: keep-all` と
  組み合わせることで、**語句の途中での改行を防止**（全ブラウザ／iOS Safari対応）。`<Jp>` で適用
- **タイポグラフィ**: 本文17px・行間1.8・字間0.04em、JPフォントスタック、長文は読みやすい幅に制限
- **モバイル固定CTAバー**（電話／LINE／メール）＋ **受付時間をCTA近くに常時表示**
- **目次（Toc）／ページトップへ戻る／パンくず**で長いページでも迷わない
- **FAQはWAI-ARIA準拠アコーディオン**（`aria-expanded`/`aria-controls`/`role=region`）
- **アクセシビリティ**: 可視フォーカス、`prefers-reduced-motion`対応、セマンティックHTML、48px級タップ領域
- **信頼要素**（競合分析より）: 対応疾患リスト、対象となる方、料金（自立支援の月額上限表）、
  スタッフ紹介、多職種連携、利用者の声、理念・代表挨拶、Googleマップ、JSON-LD構造化データ

## ⚠️ 差し替え前提の「サンプル」コンテンツ

実在情報がないため、以下はサンプルです（`content.js` 内に `SAMPLE` 注記）。本番公開前に差し替えてください。

- **代表挨拶**（`greeting`）／お名前・お写真
- **スタッフ紹介**（`staff`）の氏名・役割・写真・コメント
- **利用者さま・ご家族の声**（`testimonials`） ※同意済みの実際の声に
- **採用 募集要項**（`recruitRequirements`）の給与・待遇・勤務条件
- **指定番号**（`data.js` の `company`）・運営規程／重要事項説明書
- 料金は制度上の**目安**表記。最終確認は大和高田市の窓口・主治医・各保険者へ
- お問い合わせフォームは送信時にメールソフトを起動します（サーバー送信の接続も可能）

> Vercel では `vercel.json` の `rewrites` で全パスを `index.html` にフォールバックし、
> `/service` などへの直接アクセス・リロードでも 404 になりません。
