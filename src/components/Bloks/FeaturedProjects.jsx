import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResponsiveImg from "../ResponsiveImg";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { API_URL } from "../../config/api";
import "./FeaturedProjects.css";

const COUNT = 4;

// Home page "selected projects": the first few published projects in the admin's
// display order, laid out as an editorial 2-row grid (wide+narrow, narrow+wide).
const FeaturedProjects = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/projects/map`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data.slice(0, COUNT));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items.length) return null;

  const localized = (p) => {
    const tr = p.source_lang !== i18n.language && p.translations?.[i18n.language];
    return {
      name: (tr && tr.name) || p.name,
      city: (tr && tr.city) || p.city,
      country: (tr && tr.country) || p.country,
    };
  };

  return (
    <section className="featured">
      <div className="featured-inner">
        <div className="featured-head">
          <h2>{t("mainPage.featured.title", "Selected projects")}</h2>
          <Link to="/projects" className="featured-all" onClick={ScrollToTop}>
            {t("mainPage.featured.all", "All projects")}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className="featured-grid">
          {items.map((p, i) => {
            const { name, city, country } = localized(p);
            const place = [city, country].filter(Boolean).join(", ");
            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                onClick={ScrollToTop}
                className={`featured-card featured-card--${i % 2 === 0 ? "a" : "b"}${
                  i >= 2 ? " featured-card--flip" : ""
                }`}
              >
                <div className="featured-thumb">
                  <ResponsiveImg
                    file={p.img}
                    alt={name || ""}
                    sizes="(max-width: 800px) 100vw, 58vw"
                  />
                </div>
                <div className="featured-caption">
                  <h3>{name}</h3>
                  {place && <span>{place}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
