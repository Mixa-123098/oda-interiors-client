import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import maplibregl, { MAP_STYLES } from "../../lib/maplibre";
import { API_URL } from "../../config/api";
import "../ProjectsMap.css";

const WORLD_CENTER = [20, 40];

// Shows where the project is pinned on the public map. The pin is found
// automatically from city/country; click the map or drag the pin to correct
// it (that switches the project to a hand-placed point the auto lookup won't
// overwrite), or reset to hand control back to the automatic lookup.
const ProjectLocationPicker = ({ project }) => {
  const { t } = useTranslation();
  const nodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [point, setPoint] = useState(
    Number.isFinite(project.lat) && Number.isFinite(project.lng)
      ? { lat: project.lat, lng: project.lng }
      : null
  );
  const [manual, setManual] = useState(!!project.geo_manual);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  const save = async (next) => {
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/projects/${project.id}/location`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          next ? { lat: next.lat, lng: next.lng } : { lat: null, lng: null }
        ),
      });
      if (!res.ok) throw new Error("save_failed");
      const data = await res.json();
      setManual(!!data.geo_manual);
      setPoint(data.lat === null ? null : { lat: data.lat, lng: data.lng });
      setStatus("saved");
    } catch (e) {
      console.error("Error saving location:", e);
      setStatus("error");
    }
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: nodeRef.current,
      style: MAP_STYLES.light,
      center: point ? [point.lng, point.lat] : WORLD_CENTER,
      zoom: point ? 8 : 2,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
    mapRef.current = map;
    map.on("click", (e) => save({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the draggable pin in sync with the saved point.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!point) {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      const el = document.createElement("span");
      el.className = "pmap-pin";
      markerRef.current = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat([point.lng, point.lat])
        .addTo(map);
      markerRef.current.on("dragend", () => {
        const { lat, lng } = markerRef.current.getLngLat();
        save({ lat, lng });
      });
    } else {
      markerRef.current.setLngLat([point.lng, point.lat]);
    }
    map.easeTo({ center: [point.lng, point.lat], duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  return (
    <div className="mt-3">
      <div className="small text-muted mb-2">
        {t("editPage.editProject.location.hint")}
      </div>
      <div className="pmap pmap--light" style={{ height: 260 }}>
        <div ref={nodeRef} className="pmap-canvas" />
      </div>
      <div className="d-flex flex-wrap align-items-center gap-3 mt-2 small">
        <span>
          {point
            ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`
            : t("editPage.editProject.location.none")}
          {" · "}
          {manual
            ? t("editPage.editProject.location.manual")
            : t("editPage.editProject.location.auto")}
        </span>
        {manual && (
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={() => save(null)}
            disabled={status === "saving"}
          >
            {t("editPage.editProject.location.reset")}
          </button>
        )}
        {status === "saved" && (
          <span className="text-success">
            {t("editPage.editProject.location.saved")}
          </span>
        )}
        {status === "error" && (
          <span className="text-danger">
            {t("editPage.editProject.location.error")}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectLocationPicker;
