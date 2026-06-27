import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const el = document.getElementById("root");
// Prerendered pages have server markup → hydrate; otherwise client-render.
if (el.hasChildNodes()) {
  hydrateRoot(el, app);
} else {
  createRoot(el).render(app);
}
