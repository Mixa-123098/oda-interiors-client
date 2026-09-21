import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ResponsiveImg from "./ResponsiveImg";
import "./Lightbox.css";

// How far a photo may be enlarged past its own pixels before it turns soft.
const MAX_UPSCALE = 1.5;

// Fullscreen photo viewer. The gallery grid crops every photo to one shared
// ratio so the page reads as a designed sheet; this is where the whole frame
// is shown, uncropped.
//
// Rendered through a portal into <body>: any ancestor with a transform or a
// backdrop-filter would become the containing block for position:fixed and
// shrink the overlay to that element (the same trap the header ran into).
const Lightbox = ({ items, index, onClose, onIndex }) => {
  const { t } = useTranslation();
  const [natural, setNatural] = useState(null);
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === "undefined" ? 0 : window.innerWidth,
    h: typeof window === "undefined" ? 0 : window.innerHeight,
  }));
  const closeRef = useRef(null);
  const touchStartX = useRef(null);
  const open = index !== null && index >= 0 && items.length > 0;

  const count = items.length;
  const go = useCallback(
    (delta) => onIndex((index + delta + count) % count),
    [index, count, onIndex]
  );

  // Natural size is per photo, so forget the previous one when the index moves.
  useEffect(() => setNatural(null), [index]);

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);

    // Freeze the page behind the overlay. Compensating for the scrollbar keeps
    // the layout from jumping sideways on desktop as it disappears.
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const returnFocusTo = document.activeElement;
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      if (returnFocusTo instanceof HTMLElement) returnFocusTo.focus();
    };
  }, [open, onClose, go]);

  if (!open) return null;
  const item = items[index];
  if (!item) return null;

  // Many source photos are small (~380-700px wide). Blowing one up to fill a
  // 1440px screen just makes it soft, so the enlargement is capped at 1.5x its
  // own pixels - but it should still use that allowance rather than sit at its
  // intrinsic size in the middle of the screen. max-width/height alone only
  // ever shrink, so the displayed box is worked out here instead.
  const fit =
    natural && viewport.w && viewport.h
      ? (() => {
          const room = viewport.w < 700 ? { w: 1, h: 0.82 } : { w: 0.92, h: 0.88 };
          const scale = Math.min(
            (viewport.w * room.w) / natural.w,
            (viewport.h * room.h) / natural.h,
            MAX_UPSCALE
          );
          return {
            width: Math.round(natural.w * scale),
            height: Math.round(natural.h * scale),
          };
        })()
      : undefined;

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t("gallery.viewer", { defaultValue: "Photo viewer" })}
      onClick={(e) => {
        // only the backdrop closes, never a click on the photo itself
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox-btn lightbox-close"
        onClick={onClose}
        aria-label={t("gallery.close", { defaultValue: "Close" })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {count > 1 && (
        <button
          type="button"
          className="lightbox-btn lightbox-prev"
          onClick={() => go(-1)}
          aria-label={t("gallery.prev", { defaultValue: "Previous photo" })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
            <polyline points="15,3 5,12 15,21" />
          </svg>
        </button>
      )}

      <figure className="lightbox-figure">
        <ResponsiveImg
          key={item.id}
          file={item.img}
          alt={item.alt || ""}
          className="lightbox-img"
          sizes="92vw"
          eager
          style={fit}
          onLoad={(e) =>
            setNatural({
              w: e.currentTarget.naturalWidth,
              h: e.currentTarget.naturalHeight,
            })
          }
        />
      </figure>

      {count > 1 && (
        <button
          type="button"
          className="lightbox-btn lightbox-next"
          onClick={() => go(1)}
          aria-label={t("gallery.next", { defaultValue: "Next photo" })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
            <polyline points="9,3 19,12 9,21" />
          </svg>
        </button>
      )}

      {count > 1 && (
        <div className="lightbox-counter" aria-live="polite">
          {String(index + 1).padStart(2, "0")}
          <span className="lightbox-counter-sep">/</span>
          {String(count).padStart(2, "0")}
        </div>
      )}
    </div>,
    document.body
  );
};

export default Lightbox;
