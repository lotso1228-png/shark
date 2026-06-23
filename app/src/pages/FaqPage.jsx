import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import Faq from "../components/Faq.jsx";

export default function FaqPage() {
  return (
    <SubPage meta={pageMeta.faq}>
      <Faq />
    </SubPage>
  );
}
