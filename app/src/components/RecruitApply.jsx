import { useState } from "react";
import { Section, SectionHeading } from "./ui.jsx";
import { TEL, EMAIL, LINE_URL, RECEPTION } from "../data.js";
import Jp from "./Jp.jsx";

const QUALS = ["正看護師", "准看護師", "その他・取得見込み"];
const WISHES = [
  "まずは見学したい",
  "カジュアル面談を希望",
  "応募したい（常勤）",
  "応募したい（非常勤）",
  "質問したい",
];

const applyFlow = [
  { n: 1, t: "お問い合わせ・見学申込", d: "LINE・電話・フォームからお気軽に。" },
  { n: 2, t: "面談・職場見学", d: "仕事内容や働き方をざっくばらんに。" },
  { n: 3, t: "体験同行（任意）", d: "ご希望に応じて訪問に同行できます。" },
  { n: 4, t: "採用・入職", d: "先輩の同行から無理なくスタート。" },
];

const field =
  "w-full rounded-xl border border-[#ddccb0] bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-pink transition-colors";
const labelCls = "block font-bold text-[13.5px] text-deep mb-1.5";

/** 応募・見学申込 — low-friction application section (LINE / phone / short form). */
export default function RecruitApply({ id = "apply-form", bg = "#fcf6ed" }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    qual: QUALS[0],
    wish: WISHES[0],
    message: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "お名前をご入力ください。";
    if (!form.contact.trim())
      er.contact = "ご連絡先（電話番号またはメールアドレス）をご入力ください。";
    if (!form.agree) er.agree = "個人情報の取り扱いへの同意が必要です。";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `【採用】${form.wish}（${form.qual}）`;
    const body = [
      `お名前：${form.name}`,
      `ご連絡先：${form.contact}`,
      `資格：${form.qual}`,
      `ご希望：${form.wish}`,
      "",
      "【メッセージ】",
      form.message || "（なし）",
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <Section id={id} bg={bg} maxWidth={820}>
      <SectionHeading label="ENTRY" title="応募・見学のお申込み" className="mb-3" />
      <p className="text-center text-[14.5px] text-muted m-0 mb-8 leading-[1.9]">
        <Jp>
          「話を聞いてみたいだけ」「見学だけ」も大歓迎です。履歴書は面談が決まってからで大丈夫です。
        </Jp>
      </p>

      {/* 応募の流れ */}
      <div className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-3 mb-9">
        {applyFlow.map((s) => (
          <div
            key={s.n}
            className="bg-white border border-[#e8dec9] rounded-[16px] px-3.5 py-4 text-center"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink text-white font-zen font-bold text-[16px] mb-2">
              {s.n}
            </span>
            <h3 className="font-zen font-bold text-deep text-[13.5px] m-0 mb-1.5 leading-[1.5]">
              <Jp>{s.t}</Jp>
            </h3>
            <p className="text-[11.5px] text-muted m-0 leading-[1.7]">
              <Jp>{s.d}</Jp>
            </p>
          </div>
        ))}
      </div>

      {/* Low-friction channels first */}
      <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-3.5 mb-8">
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-line text-white no-underline font-bold text-[16px] shadow-[0_10px_22px_rgba(6,199,85,0.28)] transition-transform duration-200 hover:-translate-y-[3px]"
        >
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src="/assets/ic-line.png" alt="" className="w-8 h-8" />
          </span>
          LINEで気軽に相談・応募
        </a>
        <a
          href={`tel:${TEL}`}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-teal text-white no-underline font-bold text-[16px] shadow-[0_10px_22px_rgba(20,179,197,0.28)] transition-transform duration-200 hover:-translate-y-[3px]"
        >
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src="/assets/ic-phone.png" alt="" className="w-8 h-8" />
          </span>
          電話で問い合わせる
        </a>
      </div>
      <p className="text-[12.5px] text-muted text-center m-0 mb-8">
        <span aria-hidden="true">🕒</span> {RECEPTION}／担当者不在時は折り返します
      </p>

      {/* Short form */}
      <div className="bg-white rounded-[20px] p-6 min-[560px]:p-8 shadow-[0_10px_26px_rgba(20,130,150,0.08)]">
        <p className="font-zen font-bold text-deep text-[16px] m-0 mb-5">
          フォームで申し込む（約30秒）
        </p>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          {sent && (
            <p
              role="status"
              className="bg-[#e7f8ef] border border-[#a9e4c6] text-[#1c7a4b] rounded-xl px-4 py-3 text-[14px] m-0"
            >
              メールソフトを起動しました。送信が完了しない場合は、お電話（
              <a href={`tel:${TEL}`} className="font-bold underline">
                {TEL}
              </a>
              ）またはLINEでもお気軽にご連絡ください。
            </p>
          )}

          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-5">
            <div>
              <label htmlFor="rf-name" className={labelCls}>
                お名前 <span className="text-pink">*</span>
              </label>
              <input
                id="rf-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "rf-name-err" : undefined}
                className={field}
              />
              {errors.name && (
                <p id="rf-name-err" className="text-pink text-[12.5px] mt-1 mb-0">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="rf-contact" className={labelCls}>
                ご連絡先（電話 / メール） <span className="text-pink">*</span>
              </label>
              <input
                id="rf-contact"
                type="text"
                value={form.contact}
                onChange={set("contact")}
                placeholder="例）080-0000-0000"
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? "rf-contact-err" : undefined}
                className={field}
              />
              {errors.contact && (
                <p id="rf-contact-err" className="text-pink text-[12.5px] mt-1 mb-0">
                  {errors.contact}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-5">
            <div>
              <label htmlFor="rf-qual" className={labelCls}>
                お持ちの資格
              </label>
              <select
                id="rf-qual"
                value={form.qual}
                onChange={set("qual")}
                className={field}
              >
                {QUALS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rf-wish" className={labelCls}>
                ご希望
              </label>
              <select
                id="rf-wish"
                value={form.wish}
                onChange={set("wish")}
                className={field}
              >
                {WISHES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="rf-message" className={labelCls}>
              メッセージ（任意）
            </label>
            <textarea
              id="rf-message"
              rows={3}
              value={form.message}
              onChange={set("message")}
              placeholder="希望の働き方、質問などがあればご記入ください。"
              className={`${field} resize-y`}
            />
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={set("agree")}
                aria-invalid={!!errors.agree}
                className="mt-1 w-[18px] h-[18px] accent-[#ef8fa3]"
              />
              <span className="text-[13.5px] text-ink leading-[1.8]">
                個人情報を採用選考・ご連絡の目的でのみ利用することに同意します。
              </span>
            </label>
            {errors.agree && (
              <p className="text-pink text-[12.5px] mt-1 mb-0">{errors.agree}</p>
            )}
          </div>

          <button
            type="submit"
            className="self-start inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-pink text-white font-bold text-[16px] border-none cursor-pointer shadow-[0_12px_24px_rgba(239,143,163,0.32)] transition-transform duration-200 hover:-translate-y-[3px]"
          >
            この内容で申し込む
          </button>

          <p className="text-[12px] text-muted m-0 leading-[1.85]">
            <Jp>
              ※ 本フォームは送信時にメールソフトを起動します。うまく送れない場合はLINE・お電話をご利用ください。応募情報が在籍中の職場に伝わることはありません。
            </Jp>
          </p>
        </form>
      </div>
    </Section>
  );
}
