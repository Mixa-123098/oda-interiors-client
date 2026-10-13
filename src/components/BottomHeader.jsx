import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import HeaderText from "./HeaderText";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { useState } from "react";

// Module-level, not nested in BottomHeader: a component declared inside
// another is a new type on every render, so React remounted these links on
// every 6s slide tick - a tap that straddled it (easy on a tablet) was lost.
function BottomHeaderIcons() {
  return (
    <div className="bottomHeader-left">
      <a
        href="https://www.instagram.com/_svidoma_/"
        className="nav_icons_width social-icon-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>
      <a
        href="/"
        className="nav_icons_width social-icon-link"
        aria-label="Facebook"
      >
        <FaFacebookF />
      </a>
    </div>
  );
}

function BottomHeader() {
  const { t } = useTranslation();
  const [count, setCount] = useState(1);

  // Crossfade to slide `index` (1-based): only the active layer stays opaque,
  // and CSS transitions the opacity (apple-design §3/§4 — no hard display
  // cuts, no null-crash from querying a maybe-absent ".video.active").
  function showSlide(index) {
    document.querySelectorAll(".video").forEach((video, i) => {
      video.classList.toggle("active", i === index - 1);
      // Videos start lazily: play the one that just became active (unless
      // the connection is slow, see MainPageContainer), pause the rest.
      if (video.tagName === "VIDEO" && !video.dataset.lite) {
        if (i === index - 1) video.play().catch(() => {});
        else video.pause();
      }
    });
  }

  function handleClick(setCount, index) {
    setCount(index);
    showSlide(index);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount >= 3 ? 1 : prevCount + 1;
        showSlide(newCount);
        return newCount;
      });
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <HeaderText count={count} />

      <div className="bottomHeader d-flex align-items-center justify-content-between">
        <BottomHeaderIcons />
        <div className="bottomHeader-right">
          {[1, 2, 3].map((num) => (
            // Was a <span onClick>: not reachable by keyboard and announced as
            // plain text. A real button, with the current slide marked, and the
            // number padded to 01/02/03.
            <button
              key={num}
              type="button"
              className={`block_elem${count === num ? " active" : ""}`}
              onClick={() => handleClick(setCount, num)}
              aria-label={t("mainPage.slide", {
                defaultValue: "Slide {{num}}",
                num,
              })}
              aria-current={count === num ? "true" : undefined}
            >
              {String(num).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default BottomHeader;
