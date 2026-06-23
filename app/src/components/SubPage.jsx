import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

/**
 * Wrapper for non-home pages: sets per-page <title>/description and
 * adds the top offset needed to clear the fixed 66px header
 * (the home hero handles that offset itself via its own padding).
 */
export default function SubPage({ meta, children }) {
  useDocumentMeta(meta);
  return <div className="pt-[66px]">{children}</div>;
}
