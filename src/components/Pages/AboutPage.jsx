import React from "react";
import "./AboutPage.css";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import TrustBar from "../TrustBar";
import ResponsiveImg from "../ResponsiveImg";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

// Small tracked label that opens each section. Numbered, so the page reads as
// one sequence rather than a stack of unrelated centred headings.
const Eyebrow = ({ n, children }) => (
  <p className="about-eyebrow">
    <span className="about-eyebrow-num">{String(n).padStart(2, "0")}</span>
    {children}
  </p>
);

// Editorial two-column block: the label sits in a narrow left column, the
// prose in a wide one. Replaces the centred heading + two floating columns of
// 14px text that used to sit in the middle of an otherwise empty page.
const TextBlock = ({ n, header, text1, text2, className = "" }) => (
  <section className={`about-block ${className}`}>
    <Eyebrow n={n}>{header}</Eyebrow>
    <div className="about-block-body">
      <p className="about-block-lead">{text1}</p>
      <p className="about-block-text">{text2}</p>
    </div>
  </section>
);

const OurStory = () => {
  const { t } = useTranslation();
  return (
    <TextBlock
      n={1}
      header={t("aboutPage.block1.title")}
      text1={t("aboutPage.block1.mainTextPartOne")}
      text2={t("aboutPage.block1.mainTextPartTwo")}
    />
  );
};

const OurTeam = () => {
  const { t } = useTranslation();

  const people = [
    {
      name: t("aboutPage.block2.Marina.name"),
      jobTitle: t("aboutPage.block2.Marina.jobTitle"),
      img: "imgonline-com-ua-Black-White-xpHvu05NSXR (2).jpg",
    },
    {
      name: t("aboutPage.block2.Olha.name"),
      jobTitle: t("aboutPage.block2.Olha.jobTitle"),
      img: "imgonline-com-ua-Black-White-07UyJGUcsTqO7 (1).jpg",
    },
    {
      name: t("aboutPage.block2.Kateryna.name"),
      jobTitle: t("aboutPage.block2.Kateryna.jobTitle"),
      img: "photo_2024-02-01_09-52-39.jpg",
    },
    {
      name: t("aboutPage.block2.Leonid.name"),
      jobTitle: t("aboutPage.block2.Leonid.jobTitle"),
      img: "photo_2024-02-02_08-25-37.jpg",
    },
  ];

  return (
    <section className="about-block about-team">
      <Eyebrow n={2}>{t("aboutPage.block2.title")}</Eyebrow>
      <div className="about-team-grid">
        {people.map((person) => (
          <figure className="about-person" key={person.name}>
            <div className="about-person-photo">
              <ResponsiveImg
                file={person.img}
                alt={person.name}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <figcaption>
              <h3 className="about-person-name">{person.name}</h3>
              <p className="about-person-role">{person.jobTitle}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

const Ideology = () => {
  const { t } = useTranslation();
  return (
    <section className="about-ideology">
      <div className="about-ideology-inner">
        <Eyebrow n={3}>{t("aboutPage.block3.title")}</Eyebrow>
        <blockquote className="about-ideology-quote">
          {t("aboutPage.block3.mainTextPartOne")}
        </blockquote>
        <p className="about-ideology-text">
          {t("aboutPage.block3.mainTextPartTwo")}
        </p>
      </div>
    </section>
  );
};

const Values = () => {
  const { t } = useTranslation();
  // returnObjects: the key holds an array, not a string
  const valuesList = t("aboutPage.block4.valuesList", { returnObjects: true });
  if (!Array.isArray(valuesList)) return null;

  return (
    <section className="about-block about-values-section">
      <Eyebrow n={4}>{t("aboutPage.block4.ourValues")}</Eyebrow>
      <ol className="about-values">
        {valuesList.map((item, index) => (
          <li className="about-value" key={item.title}>
            <span className="about-value-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="about-value-title">{item.title}</h3>
            <p className="about-value-text">
              {/* `summary` is the one-line version; until it exists in the
                  translations the original bullet text is shown rather than
                  silently dropping half the copy. */}
              {item.summary || (item.content || "").split(";").join(". ")}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

const AboutCta = () => {
  const { t } = useTranslation();
  return (
    <section className="about-cta">
      <h2 className="about-cta-title">{t("aboutPage.cta.title")}</h2>
      <Link className="main-cta-button" to="/contacts" onClick={ScrollToTop}>
        {t("aboutPage.cta.button")}
      </Link>
    </section>
  );
};

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <Seo
        title="About Us"
        description="Meet the ODA team — architects and interior designers based in Ukraine and working worldwide, with over 20 years of combined experience."
      />
      <Header fontColor={`#000000`} invert={`invert(0%)`} rep={true} />
      <PagesHeader title={t("aboutPage.aboutUs")} />

      <OurStory />
      {/* Same credibility strip as the home page - one set of facts, stated
          once, rather than a second wording of the same claims. */}
      <TrustBar />
      <OurTeam />
      <Ideology />
      <Values />
      <AboutCta />

      <Footer settings={{ color: `black`, bgColor: `white`, shadow: true }} />
    </div>
  );
};

export default AboutPage;
