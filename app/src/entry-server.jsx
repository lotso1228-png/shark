import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";

// Re-export data the prerender script needs (so it loads from one bundle).
export { ROUTE_META, SITE_URL, PRERENDER_PATHS, SITE_NAME } from "./routes.js";
export { faqFull } from "./content.js";

/** Render a route to an HTML string for prerendering. */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
