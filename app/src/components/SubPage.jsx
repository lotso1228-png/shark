import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

/**
 * Wrapper for non-home pages: sets per-page <title>/description.
 * (Header offset is handled by each page's <PageHero>.)
 */
export default function SubPage({ meta, children }) {
  useDocumentMeta(meta);
  return <>{children}</>;
}
