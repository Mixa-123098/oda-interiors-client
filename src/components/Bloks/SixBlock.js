import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

const SixBlock = () => {
  const { t } = useTranslation();

  return (
    <div className="first-block">
      <div className="first-block-content-container">
        <h2>{t("mainPage.block3.title")}</h2>
        <div className="row pt-4 pb-2">
          <div className="col">
            <p>{t("mainPage.block3.mainTextPartOne")}</p>
          </div>
          <div className="col">
            <p>{t("mainPage.block3.mainTextPartTwo")}</p>
          </div>
        </div>
        <button className="first-block-button">
          <Link to="/about" className="link-style" onClick={ScrollToTop}>
            {t("mainPage.block3.button")}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default SixBlock;
