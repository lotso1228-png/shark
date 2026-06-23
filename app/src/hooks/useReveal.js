import { useEffect, useRef } from "react";

/**
 * Mirrors the design's IntersectionObserver scroll-reveal.
 * Returns a ref to attach to a `.reveal` element; adds `.is-visible`
 * once it enters the viewport (threshold 0.12, rootMargin -8% bottom).
 */
export function useReveal(enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
