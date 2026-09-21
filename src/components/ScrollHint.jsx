import React, { useEffect, useState } from "react";
import "./ScrollHint.css";

// "Scroll down" cue for full-screen heroes: a hairline arrow that starts short, then
// stretches downward with its head falling along, and fades out at the end. Sits in the nearest positioned ancestor, fades out as soon as the
// visitor starts scrolling, and a click/tap scrolls one screen down.
const ScrollHint = ({ label = "Scroll", className = "" }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () =>
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  return (
    <button
      type="button"
      className={`scroll-hint${hidden ? " scroll-hint--hidden" : ""} ${className}`}
      onClick={scrollDown}
      aria-label={label}
      tabIndex={hidden ? -1 : 0}
    >
      <svg
        className="scroll-hint-arrow"
        viewBox="0 0 24 72"
        width="24"
        height="72"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      >
        <line className="scroll-hint-shaft" x1="12" y1="0" x2="12" y2="70" />
        <polyline className="scroll-hint-head" points="4,62 12,70 20,62" />
      </svg>
    </button>
  );
};

export default ScrollHint;
