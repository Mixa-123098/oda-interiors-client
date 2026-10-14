import React from "react";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import { Link } from "../LocalizedLink";
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

// t() for a key that holds a list; [] until/unless it exists.
const listOf = (t, key) => {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? value : [];
};

// What the price buys: the design project's stages, author's supervision,
// timeline and common questions - the page used to be four price rows only.
const PriceDetails = () => {
  const { t } = useTranslation();
  const steps = listOf(t, "pricesPage.includes.items");
  const faq = listOf(t, "pricesPage.faq.items");
  if (!steps.length) return null;

  return (
    <div className="price-details">
      <section className="price-section">
        <h2 className="price-section-title">{t("pricesPage.includes.title")}</h2>
        <ol className="price-steps">
          {steps.map((step, index) => (
            <li className="price-step" key={step.title}>
              <span className="price-step-num">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="price-step-title">{step.title}</h3>
              <p className="price-step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="price-section">
        <dl className="price-facts">
          <div className="price-fact">
            <dt>{t("pricesPage.supervision.title")}</dt>
            <dd>{t("pricesPage.supervision.text")}</dd>
          </div>
          <div className="price-fact">
            <dt>{t("pricesPage.timeline.title")}</dt>
            <dd>{t("pricesPage.timeline.text")}</dd>
          </div>
        </dl>
      </section>

      {faq.length > 0 && (
        <section className="price-section">
          <h2 className="price-section-title">{t("pricesPage.faq.title")}</h2>
          <div className="price-faq">
            {faq.map((item) => (
              <div className="price-faq-item" key={item.q}>
                <h3 className="price-faq-q">{item.q}</h3>
                <p className="price-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const PricePage = () => {
  const { t } = useTranslation();

  return (
    <div className="price-page">
      <Seo
        title={t("seo.price.title")}
        description={t("seo.price.description")}
      />
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <main>
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
          <PriceDetails />
        </div>
      </main>
      <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
    </div>
  );
};

export default PricePage;
