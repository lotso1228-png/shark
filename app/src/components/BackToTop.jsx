import { useEffect, useState } from "react";

/** "ページトップへ戻る" button that appears after scrolling down. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="ページトップへ戻る"
      className="fixed right-4 z-[170] bottom-[84px] min-[880px]:bottom-6 w-12 h-12 rounded-full bg-white text-teal-600 border border-[#d6eef3] shadow-[0_8px_20px_rgba(20,150,170,0.22)] flex items-center justify-center text-xl transition-transform duration-200 hover:-translate-y-1 hover:text-teal"
    >
      ↑
    </button>
  );
}
