// Single source of truth for routes + navigation.
// Pages are split per nav item; Header/Footer/sitemap all read from here.

export const navLinks = [
  { label: "サービス内容", to: "/service" },
  { label: "ご利用の流れ", to: "/flow" },
  { label: "対応エリア", to: "/flow#area" },
  { label: "よくある質問", to: "/faq" },
  { label: "事業所概要", to: "/company" },
  { label: "採用情報", to: "/recruit" },
];

// Per-page <title> / description used by useDocumentMeta.
export const SITE_NAME = "訪問看護ステーションSHARK";

export const pageMeta = {
  home: {
    title: `${SITE_NAME}｜奈良県全域対応・精神科訪問看護`,
    description:
      "奈良県全域対応の精神科訪問看護ステーションSHARK。24時間365日、気持ちに寄り添いながら服薬管理・ご家族支援・主治医連携までサポートします。",
  },
  service: {
    title: `サービス内容｜${SITE_NAME}`,
    description:
      "気持ちの整理・傾聴、服薬管理、ご家族への支援、主治医との連携など、SHARKのサービス内容と医療保険・自立支援医療制度についてご紹介します。",
  },
  flow: {
    title: `ご利用の流れ・対応エリア｜${SITE_NAME}`,
    description:
      "お問い合わせから訪問開始までの流れと、奈良県全域の訪問対応エリアについてご案内します。",
  },
  faq: {
    title: `よくある質問｜${SITE_NAME}`,
    description:
      "精神科訪問看護や自立支援医療制度、費用、対応エリアなど、よくある質問をまとめました。",
  },
  company: {
    title: `事業所概要｜${SITE_NAME}`,
    description: "訪問看護ステーションSHARK（株式会社B-Nuts）の事業所概要です。",
  },
  recruit: {
    title: `採用情報｜${SITE_NAME}`,
    description:
      "訪問看護ステーションSHARKでは、利用者様の暮らしに寄り添う看護師を募集しています。未経験・ブランクのある方もご相談ください。",
  },
  contact: {
    title: `お問い合わせ｜${SITE_NAME}`,
    description:
      "ご本人・ご家族・医療機関・施設関係者様からのご相談を受け付けています。電話・LINE・メールでお気軽にお問い合わせください。",
  },
  notFound: {
    title: `ページが見つかりません｜${SITE_NAME}`,
    description: "",
  },
};
