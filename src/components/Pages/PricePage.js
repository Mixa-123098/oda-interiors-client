import React from "react";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import "../../App.css";
import "./PricePage.css";
import { useTranslation } from "react-i18next";

const PriceCard = ({ title, price }) => {
  const { t } = useTranslation();

  return (
    <div className="price-row">
      <div>
        <h3 className="price-row-title">{title}</h3>
        <p className="price-row-value">{price}</p>
      </div>
      <Link className="price-row-cta" to={"/contacts"} onClick={ScrollToTop}>
        {t("pricesPage.button")}
      </Link>
    </div>
  );
};

const PricePage = () => {
  const { t } = useTranslation();

  return (
    <div className="price-page">
      <Seo
        title="Prices"
        description="Pricing for interior design and architecture services from ODA, a studio based in Ukraine and working worldwide."
      />
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <PagesHeader title={t("pricesPage.ourPrices")} />
      <div className="container mt-5 mb-5">
        <div className="price-list">
          <PriceCard
            title={t("pricesPage.tariff1.size")}
            price={t("pricesPage.tariff1.price")}
          />
          <PriceCard
            title={t("pricesPage.tariff2.size")}
            price={t("pricesPage.tariff2.price")}
          />
          <PriceCard
            title={t("pricesPage.tariff3.size")}
            price={t("pricesPage.tariff3.price")}
          />
          <PriceCard
            title={t("pricesPage.tariff4.size")}
            price={t("pricesPage.tariff4.price")}
          />
        </div>
        <p className="price-note">{t("pricesPage.additionalInfo")}</p>
      </div>
      <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
    </div>
  );
};

export default PricePage;
