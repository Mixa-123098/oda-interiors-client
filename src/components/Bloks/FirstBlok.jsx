import React from "react";
import "./FirstBlock.css";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

// FirstBlock.css also styles the other home text sections (Third/Forth/Fifth/SixBlock),
// so it must stay imported here.
const FirstBlok = () => {
  const { t } = useTranslation();

  return (
    <div className="first-block first-block--intro">
      <div className="first-block-content-container">
        <h1>
          {t("mainPage.block1.titlePartOne")}
          <br />
          {t("mainPage.block1.titlePartTwo")}
        </h1>
        <div className="row pt-4 pb-2">
          <div className="col">
            <p>{t("mainPage.block1.mainTextPartOne")}</p>
          </div>
          <div className="col">
            <p className="">{t("mainPage.block1.mainTextPartTwo")}</p>
          </div>
        </div>
        <button className="first-block-button">
          <Link to="/projects" className="link-style" onClick={ScrollToTop}>
            {t("mainPage.block1.button")}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FirstBlok;
