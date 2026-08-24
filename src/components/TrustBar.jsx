import React from "react";
import { useTranslation } from "react-i18next";
import "./TrustBar.css";

// Trust strip on the home page — a few honest credibility signals right before
// the closing call-to-action. Values come from the studio's real profile
// (20+ years, works in Kyiv & Dnipro, full-cycle concept→implementation).
const TrustBar = () => {
  const { t } = useTranslation();
  const items = [
    {
      value: t("mainPage.trust.item1Value"),
      label: t("mainPage.trust.item1Label"),
    },
    {
      value: t("mainPage.trust.item2Value"),
      label: t("mainPage.trust.item2Label"),
    },
    {
      value: t("mainPage.trust.item3Value"),
      label: t("mainPage.trust.item3Label"),
    },
  ];

  return (
    <section className="trust-bar">
      {items.map((it, i) => (
        <div className="trust-item" key={i}>
          <div className="trust-value">{it.value}</div>
          <div className="trust-label">{it.label}</div>
        </div>
      ))}
    </section>
  );
};

export default TrustBar;
