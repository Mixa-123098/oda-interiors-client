import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import ProjectsMap from "../ProjectsMap";
import { API_URL } from "../../config/api";
import "../../App.css";
import "../ProjectsMap.css";

const MapPage = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/projects/map`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCount(d.length))
      .catch(() => setCount(null));
  }, []);

  return (
    <div className="map-page">
      <Seo
        title={t("mapPage.title")}
        description="Map of completed interior design and architecture projects by ODA."
      />
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <PagesHeader title={t("mapPage.title")} />
      <div className="container map-page-body">
        <div className="map-page-meta">
          <span>{t("mapPage.subtitle")}</span>
          {count !== null && <span>{t("mapPage.count", { count })}</span>}
        </div>
        <ProjectsMap variant="light" height="min(70vh, 640px)" interactive />
        <p className="map-page-hint">{t("mapPage.hint")}</p>
      </div>
      <Footer
        settings={{ color: "black", bgColor: "white", shadow: true }}
        hideMap
      />
    </div>
  );
};

export default MapPage;
