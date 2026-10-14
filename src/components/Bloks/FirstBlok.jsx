import React from "react";
import "./FirstBlock.css";
import { Link } from "../LocalizedLink";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

// FirstBlock.css also styles the other home text section (FifthBlock),
// so it must stay imported here.
const FirstBlok = () => {
  const { t } = useTranslation();

  return (
    <div className="first-block first-block--intro">
      <div className="first-block-content-container">
        <h1>
          {t("mainPage.block1.titlePartOne")}
          {/* The space keeps the two lines apart in the page's plain text
              (what crawlers read): <br> alone glued them into one word. */}{" "}
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
