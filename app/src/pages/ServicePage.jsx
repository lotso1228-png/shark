import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import Services from "../components/Services.jsx";
import Insurance from "../components/Insurance.jsx";

export default function ServicePage() {
  return (
    <SubPage meta={pageMeta.service}>
      <Services />
      <Insurance />
    </SubPage>
  );
}
