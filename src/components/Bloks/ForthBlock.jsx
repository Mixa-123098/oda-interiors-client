import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

const ForthBlock = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="first-block bg-color">
        <div className="first-block-content-container">
          <h2 className="text-light"> {t("mainPage.block4.title")}</h2>
          <div className="row pt-4 pb-2">
            <div className="col">
              <p className="text-light">
                {t("mainPage.block4.mainTextPartOne")}
              </p>
            </div>
            <div className="col">
              <p className="text-light">
                {t("mainPage.block4.mainTextPartTwo")}
              </p>
            </div>
          </div>
          <button className="first-block-button-invert">
            <Link
              to="/contacts"
              className="link-style text-light"
              onClick={ScrollToTop}
            >
              {t("mainPage.block4.button")}
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default ForthBlock;
