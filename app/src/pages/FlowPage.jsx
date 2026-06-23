import SubPage from "../components/SubPage.jsx";
import { pageMeta } from "../routes.js";
import FlowArea from "../components/FlowArea.jsx";

export default function FlowPage() {
  return (
    <SubPage meta={pageMeta.flow}>
      <FlowArea />
    </SubPage>
  );
}
