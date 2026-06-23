import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import Company from "../components/Company.jsx";

export default function CompanyPage() {
  return (
    <SubPage meta={pageMeta.company}>
      <Company />
    </SubPage>
  );
}
