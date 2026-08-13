import { useEffect } from "react";

const setNamedMeta = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

/**
 * Lightweight per-page <title> / description / robots setter
 * (no react-helmet dependency needed for a small SPA).
 * robots: pass "noindex, follow" on 404-type pages; other pages restore index.
 */
export function useDocumentMeta({ title, description, robots } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description != null) setNamedMeta("description", description);
    setNamedMeta("robots", robots || "index, follow");
  }, [title, description, robots]);
}
