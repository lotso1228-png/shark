import { useEffect } from "react";

/**
 * Lightweight per-page <title> + meta description setter
 * (no react-helmet dependency needed for a small SPA).
 */
export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description != null) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
