import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScrollToTop from "../custom-hooks/ScrollToTop";
import "./Footer.css";

// The map (library + tiles + fonts, ~0.5MB) is fetched only once the footer
// nears the viewport, so it never competes with the page content for a slow
// connection.
const LazyProjectsMap = (props) => {
  const holder = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    let timer;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          // Short pages (e.g. a list that is still loading) have the footer
          // in view immediately; give the real content a head start.
          timer = setTimeout(() => setNear(true), 1500);
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={holder} style={{ minHeight: props.height }}>
      {near && (
        <Suspense fallback={<div style={{ height: props.height }} />}>
          <ProjectsMap {...props} />
        </Suspense>
      )}
    </div>
  );
};

// Map library is ~0.8MB: keep it out of the main bundle, load it with the footer.
const ProjectsMap = lazy(() => import("./ProjectsMap"));

const LIGHT_BACKGROUNDS = ["white", "#fff", "#ffffff"];

// hideMap: the /map page already shows the full map, so no second copy there.
const Footer = ({ settings, hideMap = false }) => {
  const { bgColor } = settings || {};
  const isLight = LIGHT_BACKGROUNDS.includes((bgColor || "").toLowerCase());
  const { t } = useTranslation();

  const contactInfo = {
    phone: "+380 67 639 70 18",
    phoneHref: "tel:+380676397018",
    email: "marynaprokhorova@gmail.com",
  };

  const socialMediaLinks = [
    {
      name: t("footer.social_media.viber"),
      url: "viber://chat?number=%2B380676397018",
    },
    {
      name: t("footer.social_media.instagram"),
      url: "https://www.instagram.com/_svidoma_/",
    },
    {
      name: t("footer.social_media.telegram"),
      url: "https://t.me/marynaprokhorova_design",
    },
  ];

  const businessHours = [
    { day: t("footer.working_hours.Monday-Friday"), hours: "9:00 - 18:00" },
    { day: t("footer.working_hours.Saturday"), hours: "10:00 - 14:00" },
    {
      day: t("footer.working_hours.Sunday"),
      hours: t("footer.working_hours.closed"),
    },
  ];

  return (
    <footer
      className={`site-footer ${
        isLight ? "site-footer--light" : "site-footer--dark"
      }`}
    >
      <div className="container">
        <div className="site-footer-grid">
          <div>
            <h4 className="site-footer-title">{t("footer.contacts.title")}</h4>
            <div className="site-footer-item">
              <span className="site-footer-label">
                {t("footer.contacts.phone")}
              </span>
              <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
            </div>
            <div className="site-footer-item">
              <span className="site-footer-label">
                {t("footer.contacts.email")}
              </span>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
          </div>

          <div>
            <h4 className="site-footer-title">
              {t("footer.social_media.title")}
            </h4>
            <ul className="site-footer-list">
              {socialMediaLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="site-footer-title">
              {t("footer.working_hours.title")}
            </h4>
            <ul className="site-footer-list site-footer-hours">
              {businessHours.map((item, index) => (
                <li key={index}>
                  <span>{item.day}</span>
                  <b>{item.hours}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!hideMap && (
        <div className="site-footer-map">
          <div className="site-footer-map-head">
            <h4 className="site-footer-title mb-0">{t("footer.map")}</h4>
            <Link className="site-footer-maplink" to="/map" onClick={ScrollToTop}>
              {t("footer.mapAll")}
            </Link>
          </div>
          <LazyProjectsMap variant={isLight ? "light" : "dark"} height={340} />
        </div>
        )}

        <div className="site-footer-bottom">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
