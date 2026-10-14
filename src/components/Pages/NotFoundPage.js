import React from "react";
import { Link } from "../LocalizedLink";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import Footer from "../Footer";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <Helmet>
        <title>{`404 — ${t("notFoundPage.title")}`}</title>
        <meta name="robots" content="noindex" />
        {/* Read by the prerender service (prerender/server.js): bots get a
            real HTTP 404 instead of a 200 for a page that doesn't exist. */}
        <meta name="prerender-status-code" content="404" />
      </Helmet>
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <main className="not-found-main">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">{t("notFoundPage.title")}</h1>
        <p className="not-found-text">{t("notFoundPage.text")}</p>
        <div className="not-found-actions">
          <Link className="not-found-primary" to="/" onClick={ScrollToTop}>
            {t("notFoundPage.home")}
          </Link>
          <Link
            className="not-found-secondary"
            to="/projects"
            onClick={ScrollToTop}
          >
            {t("notFoundPage.projects")}
          </Link>
        </div>
      </main>
      <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
    </div>
  );
};

export default NotFoundPage;
