// All copy + asset references, mirrored 1:1 from the SHARK design (renderVals).

export const TEL = "080-4767-0011";
export const EMAIL = "tokumoto.bnuts@gmail.com";
export const RECEPTION = "24時間365日 相談受付";
export const ADDRESS = "〒635-0057 奈良県大和高田市南陽町5-19";
export const CORP = "株式会社B-Nuts";

// Nav lives in routes.js (navLinks) now that the site is multi-page.

export const heroBadges = [
  { img: "/assets/ic-mind.png", label: "精神科訪問看護対応" },
  { img: "/assets/ic-pin.png", label: "奈良県全域対応" },
  { img: "/assets/ic-clock.png", label: "24時間365日対応" },
  { img: "/assets/ic-clipboard-heart.png", label: "自立支援医療制度に対応" },
];

export const worries = [
  "気持ちが不安定で、日常生活に不安がある",
  "薬の飲み忘れや服薬管理が心配",
  "家族だけで支えることに限界を感じている",
  "退院後の生活に不安がある",
  "誰に相談していいかわからない",
  "主治医や支援者との連携が必要",
  "孤立してしまい、外とのつながりが少ない",
];

export const reasons = [
  {
    img: "/assets/heart-mint.png",
    title: "精神科訪問看護に強い",
    desc: "精神疾患のある方の暮らしに寄り添い、気持ちの整理や生活の安定をサポートします。",
  },
  {
    img: "/assets/ic-24h.png",
    title: "24時間365日対応",
    desc: "急な不安や体調の変化にも、いつでも相談できる体制を整えています。",
  },
  {
    img: "/assets/ic-talk.png",
    title: "相談しやすい雰囲気",
    desc: "はじめての方やご家族も、安心して相談できるやわらかい対応を大切にしています。",
  },
  {
    img: "/assets/ic-people.png",
    title: "経験豊富なスタッフが対応",
    desc: "利用者様の状況に合わせて、無理のない支援を行います。",
  },
  {
    img: "/assets/ic-handshake.png",
    title: "主治医・関係機関と連携",
    desc: "主治医、相談支援専門員、障がい福祉サービスなどと連携しながら、継続的な支援を行います。",
  },
];

export const services = [
  {
    photo: "/assets/photos/ph-listen.png",
    icon: "/assets/sv-talk.png",
    title: "気持ちの整理・傾聴",
    desc: "不安や悩みを丁寧に伺い、安心して過ごせるようサポートします。",
  },
  {
    photo: "/assets/photos/ph-pills.png",
    icon: "/assets/sv-pills.png",
    title: "服薬管理",
    desc: "薬の飲み忘れや飲み方の不安を解消し、安定した生活を支えます。",
  },
  {
    photo: "/assets/photos/ph-family.png",
    icon: "/assets/sv-family.png",
    title: "ご家族への支援",
    desc: "ご本人だけでなく、ご家族の不安やご負担にも寄り添います。",
  },
  {
    photo: "/assets/photos/ph-stetho.png",
    icon: "/assets/ic-stetho.png",
    title: "主治医との連携",
    desc: "主治医の指示のもと、必要な情報共有を行いながら支援します。",
  },
];

export const insurance = [
  "医療保険での訪問看護に対応",
  "自立支援医療制度を利用可能",
  "自立支援医療制度の利用で、自己負担を抑えて訪問看護をご利用いただけます",
  "詳細は状況により異なるため、まずはお気軽にご相談ください",
];

// Detailed flow (flowDetailed) and full FAQ (faqFull) live in content.js.

export const company = [
  { k: "事業所名", v: "訪問看護ステーションSHARK" },
  { k: "法人名", v: "株式会社B-Nuts" },
  { k: "住所", v: "〒635-0057 奈良県大和高田市南陽町5-19" },
  { k: "電話番号", v: "080-4767-0011" },
  { k: "メール", v: "tokumoto.bnuts@gmail.com" },
  { k: "指定番号", v: "（準備中）" }, // SAMPLE — 実際の指定事業所番号に差し替え
  { k: "対応エリア", v: "奈良県全域（大和高田市を拠点）" },
  { k: "対応時間", v: "24時間365日対応" },
  {
    k: "主なサービス",
    v: "精神科訪問看護、服薬管理・症状観察、傾聴・相談、生活支援、社会復帰支援、ご家族への支援、主治医・多職種連携",
  },
  { k: "各種制度", v: "医療保険／自立支援医療制度に対応" },
];
