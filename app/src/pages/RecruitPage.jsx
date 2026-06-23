import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import Recruit from "../components/Recruit.jsx";

export default function RecruitPage() {
  return (
    <SubPage meta={pageMeta.recruit}>
      <Recruit />
    </SubPage>
  );
}
