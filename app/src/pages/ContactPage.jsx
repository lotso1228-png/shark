import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import FinalCta from "../components/FinalCta.jsx";

export default function ContactPage() {
  return (
    <SubPage meta={pageMeta.contact}>
      <FinalCta showDecorations />
    </SubPage>
  );
}
