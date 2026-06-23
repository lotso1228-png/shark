import { useState } from "react";
import { EMAIL } from "../data.js";

const ROLES = ["ご本人", "ご家族", "医療・福祉関係者", "その他"];

const field =
  "w-full rounded-xl border border-[#d6e8ee] bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-teal transition-colors";
const labelCls = "block font-bold text-[13.5px] text-deep mb-1.5";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    role: ROLES[0],
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
    if (!form.message.trim()) er.message = "相談内容をご入力ください。";
    if (!form.agree) er.agree = "個人情報の取り扱いへの同意が必要です。";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `【お問い合わせ】${form.role}より`;
    const body = [
      `お名前：${form.name}`,
      `ご連絡先：${form.contact}`,
      `ご相談者：${form.role}`,
      "",
      "【相談内容】",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {sent && (
        <p
          role="status"
          className="bg-[#e7f8ef] border border-[#a9e4c6] text-[#1c7a4b] rounded-xl px-4 py-3 text-[14px] m-0"
        >
          メールソフトを起動しました。送信が完了しない場合は、お電話（{" "}
          <a href="tel:080-4767-0011" className="font-bold underline">
            080-4767-0011
          </a>
          ）でもお気軽にご相談ください。
        </p>
      )}

      <div>
        <label htmlFor="cf-name" className={labelCls}>
          お名前 <span className="text-pink">*</span>
        </label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cf-name-err" : undefined}
          className={field}
        />
        {errors.name && (
          <p id="cf-name-err" className="text-pink text-[12.5px] mt-1 mb-0">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cf-contact" className={labelCls}>
          ご連絡先（電話番号 / メール） <span className="text-pink">*</span>
        </label>
        <input
          id="cf-contact"
          type="text"
          inputMode="text"
          value={form.contact}
          onChange={set("contact")}
          placeholder="例）080-0000-0000 または mail@example.com"
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? "cf-contact-err" : undefined}
          className={field}
        />
        {errors.contact && (
          <p id="cf-contact-err" className="text-pink text-[12.5px] mt-1 mb-0">
            {errors.contact}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cf-role" className={labelCls}>
          ご相談者
        </label>
        <select
          id="cf-role"
          value={form.role}
          onChange={set("role")}
          className={field}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelCls}>
          相談内容 <span className="text-pink">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="ご相談内容やご希望、現在の状況などをご記入ください。"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          className={`${field} resize-y`}
        />
        {errors.message && (
          <p id="cf-message-err" className="text-pink text-[12.5px] mt-1 mb-0">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={set("agree")}
            aria-invalid={!!errors.agree}
            className="mt-1 w-[18px] h-[18px] accent-[#15b4c5]"
          />
          <span className="text-[13.5px] text-ink leading-[1.8]">
            個人情報を相談対応の目的でのみ利用することに同意します。
          </span>
        </label>
        {errors.agree && (
          <p className="text-pink text-[12.5px] mt-1 mb-0">{errors.agree}</p>
        )}
      </div>

      <button
        type="submit"
        className="self-start inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal text-white font-bold text-[16px] border-none cursor-pointer shadow-[0_12px_24px_rgba(20,179,197,0.3)] transition-transform duration-200 hover:-translate-y-[3px]"
      >
        入力内容を送信する
      </button>

      <p className="text-[12px] text-muted m-0 leading-[1.85]">
        ※ 本フォームは送信時にメールソフトを起動します（サーバー送信機能の接続も可能です）。お急ぎの場合はお電話・LINEもご利用ください。
      </p>
    </form>
  );
}
