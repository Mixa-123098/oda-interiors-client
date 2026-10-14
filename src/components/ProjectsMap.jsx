import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLang from "../lib/useLang";
import { useTranslation } from "react-i18next";
import maplibregl, { MAP_STYLES } from "../lib/maplibre";
import { API_URL } from "../config/api";
import "./ProjectsMap.css";

// Projects in the same city share (almost) one point; they become a single
// pin with a count instead of a stack of overlapping dots.
function groupByPlace(projects) {
  const groups = new Map();
  for (const p of projects) {
    const key = `${p.lat.toFixed(2)},${p.lng.toFixed(2)}`;
    if (!groups.has(key)) groups.set(key, { lat: p.lat, lng: p.lng, items: [] });
    groups.get(key).items.push(p);
  }
  return [...groups.values()];
}

const localized = (p, lang, field) =>
  (p.translations?.[lang]?.[field] || p[field] || "").trim();

// Real map of where finished projects are. Coordinates come from the server
// (geocoded from each project's city/country), so a new project appears here
// with no extra step. `variant` picks the tile theme; `interactive` enables
// scroll-zoom (off in the footer so the map doesn't hijack page scrolling).
const ProjectsMap = ({ variant = "light", height = 320, interactive = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lp } = useLang();
  const nodeRef = useRef(null);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/projects/map`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => !cancelled && setProjects(data))
      .catch(() => !cancelled && setProjects([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const hasPoints = !!projects && projects.length > 0;

  useEffect(() => {
    if (!hasPoints || !nodeRef.current) return undefined;
    const lang = i18n.language;
    const groups = groupByPlace(projects);
    const bounds = new maplibregl.LngLatBounds();
    groups.forEach((g) => bounds.extend([g.lng, g.lat]));

    const map = new maplibregl.Map({
      container: nodeRef.current,
      style: MAP_STYLES[variant],
      bounds,
      fitBoundsOptions: { padding: 56, maxZoom: 6 },
      minZoom: 1.5,
      // In the footer (and on touch screens everywhere) the map sits in the
      // middle of a scrolling page, so it takes ctrl+wheel / two-finger
      // gestures instead of trapping one-finger scrolling.
      cooperativeGestures:
        !interactive || window.matchMedia("(pointer: coarse)").matches,
      attributionControl: { compact: true },
    });
    if (interactive) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
    }

    for (const g of groups) {
      const count = g.items.length;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "pmap-icon";
      el.setAttribute("aria-label", `${count}`);
      const pin = document.createElement("span");
      pin.className = "pmap-pin";
      if (count > 1) pin.textContent = String(count);
      el.appendChild(pin);

      const box = document.createElement("div");
      box.className = "pmap-popup";
      const place = document.createElement("p");
      place.className = "pmap-popup-place";
      place.textContent = [
        localized(g.items[0], lang, "city"),
        localized(g.items[0], lang, "country"),
      ]
        .filter(Boolean)
        .join(", ");
      box.appendChild(place);
      for (const p of g.items) {
        const a = document.createElement("a");
        a.href = lp(`/projects/${p.id}`);
        a.className = "pmap-popup-link";
        a.textContent = localized(p, lang, "name");
        a.addEventListener("click", (e) => {
          e.preventDefault();
          navigate(lp(`/projects/${p.id}`));
          window.scrollTo(0, 0);
        });
        box.appendChild(a);
      }
      const popup = new maplibregl.Popup({
        closeButton: false,
        offset: 16,
        maxWidth: "280px",
        focusAfterOpen: false,
      }).setDOMContent(box);
      // MapLibre doesn't pan for popups, so in the short footer map the card used to
      // open below the pin and get cut off. Nudge the map up just enough to show it.
      popup.on("open", () => {
        requestAnimationFrame(() => {
          const card = popup.getElement();
          if (!card) return;
          const pt = map.project([g.lng, g.lat]);
          const room = map.getContainer().clientHeight - 8;
          const excess = pt.y + card.offsetHeight + 16 - room;
          const shift = Math.min(excess, pt.y - 40);
          if (shift > 0) map.panBy([0, shift], { duration: 350 });
        });
      });
      new maplibregl.Marker({ element: el }).setLngLat([g.lng, g.lat]).setPopup(popup).addTo(map);
    }

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(nodeRef.current);

    return () => {
      ro.disconnect();
      map.remove();
    };
  }, [projects, hasPoints, variant, interactive, i18n.language, navigate, lp]);

  if (projects && projects.length === 0) return null;

  return (
    <div
      className={`pmap pmap--${variant}`}
      style={{ height }}
      role="region"
      aria-label={t("mapPage.title")}
    >
      <div ref={nodeRef} className="pmap-canvas" />
    </div>
  );
};

export default ProjectsMap;
