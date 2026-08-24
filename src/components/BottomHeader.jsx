import React, { useEffect } from "react";
import HeaderText from "./HeaderText";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { useState } from "react";

function BottomHeader() {
  const [count, setCount] = useState(1);

  // Crossfade to slide `index` (1-based): only the active layer stays opaque,
  // and CSS transitions the opacity (apple-design §3/§4 — no hard display
  // cuts, no null-crash from querying a maybe-absent ".video.active").
  function showSlide(index) {
    document.querySelectorAll(".video").forEach((video, i) => {
      video.classList.toggle("active", i === index - 1);
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

  return (
    <>
      <HeaderText count={count} />

      <div className="bottomHeader d-flex align-items-center justify-content-between">
        <BottomHeaderIcons />
        <div className="bottomHeader-right d-flex">
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              className={`block_elem${count === num ? " active" : ""}`}
              onClick={() => handleClick(setCount, num)}
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default BottomHeader;
