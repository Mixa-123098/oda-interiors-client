import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ScrollToTopButton.css";

// Back to top. The visual counterpart of <ScrollHint>: the same 1px arrow,
// turned upward, on a translucent plate so it stays legible over photos.
//
// Only the "past ~80% of a screen" threshold matters, so the boolean is what
// lives in state - the component then re-renders when the button's visibility
// actually flips, not on every scroll event. rAF-throttled, passive listener,
// attached once.
const ScrollToTopButton = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.8);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    // html { scroll-behavior: smooth } would already smooth this, but say it
    // explicitly so the reduced-motion case is handled here rather than by
    // whatever the page happens to set.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  // Always rendered so it can fade out; hidden from the tab order while it is
  // invisible, the same way <ScrollHint> does it.
  return (
    <button
      type="button"
      className={`scroll-top${visible ? " scroll-top--visible" : ""}`}
      onClick={scrollToTop}
      aria-label={t("scrollTop", { defaultValue: "Back to top" })}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        className="scroll-top-arrow"
        viewBox="0 0 24 26"
        width="24"
        height="26"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      >
        <line x1="12" y1="25" x2="12" y2="2" />
        <polyline points="4,10 12,2 20,10" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
