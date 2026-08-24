import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";
import "./MainCta.css";

// Closing call-to-action on the home page: a clear next step for a visitor
// who has scrolled the whole page. Click is tracked as a conversion event.
const MainCta = () => {
  const { t } = useTranslation();
  return (
    <section className="main-cta">
      <h2 className="main-cta-title">{t("mainPage.cta.title")}</h2>
      <p className="main-cta-subtitle">{t("mainPage.cta.subtitle")}</p>
      <Link
        to="/contacts"
        className="btn btn-dark btn-lg px-4"
        onClick={ScrollToTop}
        data-umami-event="cta-home-consultation"
      >
        {t("mainPage.cta.button")}
      </Link>
    </section>
  );
};

export default MainCta;
