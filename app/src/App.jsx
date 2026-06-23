import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import FlowPage from "./pages/FlowPage.jsx";
import FaqPage from "./pages/FaqPage.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import RecruitPage from "./pages/RecruitPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="flow" element={<FlowPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="recruit" element={<RecruitPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
