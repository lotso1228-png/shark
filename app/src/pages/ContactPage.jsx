import SubPage from "../components/SubPage.jsx";
import PageHero from "../components/PageHero.jsx";
import AccessSection from "../components/AccessSection.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { Section, ContactButtons, Reception } from "../components/ui.jsx";
import { pageMeta } from "../routes.js";

export default function ContactPage() {
  return (
    <SubPage meta={pageMeta.contact}>
      <PageHero
        eyebrow="CONTACT"
        title="お問い合わせ"
        lead="ご本人・ご家族・医療機関・施設関係者・ケアマネジャー様など、どなたからのご相談も承ります。利用を迷っている段階でもお気軽にどうぞ。"
        crumbs={[{ label: "ホーム", to: "/" }, { label: "お問い合わせ" }]}
      />

      {/* 連絡方法 */}
      <Section bg="#fff" maxWidth={820}>
        <div className="text-center">
          <h2 className="font-zen font-black text-deep m-0 mb-3 text-[clamp(20px,2.6vw,28px)]">
            電話・LINE・メールでご相談
          </h2>
          <p className="text-[14.5px] text-muted m-0 mb-7 leading-[1.9]">
            お急ぎの方・直接お話ししたい方はお電話が確実です。
            <br className="hidden min-[680px]:block" />
            まずは聞いてみたい、という方はLINE・メールもご利用ください。
          </p>
          <ContactButtons variant="hero" className="justify-center" />
          <Reception className="mt-5 text-center" />
        </div>
      </Section>

      {/* 相談フォーム */}
      <Section bg="#f0fafd" maxWidth={720}>
        <h2 className="font-zen font-black text-deep m-0 mb-2 text-[clamp(20px,2.6vw,26px)] text-center">
          相談フォーム
        </h2>
        <p className="text-[14px] text-muted text-center m-0 mb-8 leading-[1.9]">
          下記の項目をご入力ください。担当者よりご連絡いたします。
        </p>
        <div className="bg-white rounded-[20px] p-6 min-[560px]:p-8 shadow-[0_10px_26px_rgba(20,130,150,0.08)]">
          <ContactForm />
        </div>
        <p className="text-[12px] text-muted m-0 mt-5 leading-[1.9]">
          【個人情報の取り扱い】ご入力いただいた個人情報は、ご相談への対応の目的にのみ利用し、ご本人の同意なく第三者へ提供することはありません。
        </p>
      </Section>

      <AccessSection id="access" bg="#fff" />
    </SubPage>
  );
}
