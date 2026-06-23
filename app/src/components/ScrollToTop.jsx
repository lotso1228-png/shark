import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * On route change: scroll to the hash target if present (offset for the
 * fixed header), otherwise scroll to the top. Mirrors the in-page anchor
 * behaviour the single-page version had.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick so the target element is mounted.
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.scrollTo(0, 0);
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
