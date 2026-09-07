import React from "react";
import "./AboutPage.css";
import Header from "../Header";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import CardTamplate from "../tamplates/CardTamplate";
import { Link } from "react-router-dom";
import ScrollToTop from "../../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";

const IdeologyTemplate = ({ header, text1, text2 }) => {
  return (
    <>
      <div className="first-block about-hero-block pt-4">
        <div className="first-block-content-container align-items-center">
          <h2 className="text-center">{header}</h2>
          <div className="row mt-4 pt-4 pb-2 justify-content-center">
            <div className="col-md-4 col">
              <p>{text1}</p>
            </div>
            <div className="col-md-4 col">
              <p className="">{text2}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Ideology = () => {
  const { t } = useTranslation();

  return (
    <>
      <IdeologyTemplate
        header={t("aboutPage.block3.title")}
        text1={t("aboutPage.block3.mainTextPartOne")}
        text2={t("aboutPage.block3.mainTextPartTwo")}
      />
    </>
  );
};

const OurStory = () => {
  const { t } = useTranslation();

  return (
    <>
      <IdeologyTemplate
        header={t("aboutPage.block1.title")}
        text1={t("aboutPage.block1.mainTextPartOne")}
        text2={t("aboutPage.block1.mainTextPartTwo")}
      />
    </>
  );
};

const OurTeam = () => {
  const { t } = useTranslation();

  const imgesList = [
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
    <section className="about-section">
      <h2 className="text-center about-section-title">
        {t("aboutPage.block2.title")}
      </h2>
      <div className="row justify-content-center">
        {imgesList.map((person, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <CardTamplate
              img_src={`/img/main_imges_folder/${person.img}`}
              alt={person.name}
              title={person.name}
              imgHeight="320px"
              subtitle={person.jobTitle}
              border={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const Cinnosty = () => {
  const { t } = useTranslation();

  const valuesList = t("aboutPage.block4.valuesList", { returnObjects: true }); //возвращаем обьект так как там должны получить массив, а не строку

  return (
    <section className="values-section">
      <h2 className="text-center values-title">
        {t("aboutPage.block4.ourValues")}
      </h2>

      <div className="row g-4 justify-content-center pt-4 pb-2">
        {valuesList &&
          valuesList.map((item, index) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12"
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardTamplate
                title={item.title}
                card_content={item.content}
                isList={true}
              />
            </div>
          ))}
      </div>
    </section>
  );
};

const AboutCta = () => {
  const { t } = useTranslation();

  return (
    <section className="about-cta">
      <h2>{t("aboutPage.cta.title")}</h2>
      <Link
        className="btn btn-dark mt-3"
        to={"/contacts"}
        onClick={ScrollToTop}
      >
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
        description="Meet the ODA team — architects and interior designers working in Dnipro and Kyiv, Ukraine, with over 20 years of combined experience."
      />
      <Header fontColor={`#000000`} invert={`invert(0%)`} rep={true} />
      <PagesHeader title={t("aboutPage.aboutUs")} />

      <div className="container mt-5">
        <OurStory />
        <OurTeam />
        <Ideology />
        <Cinnosty />
        <AboutCta />
      </div>

      <Footer settings={{ color: `black`, bgColor: `white`, shadow: true }} />
    </div>
  );
};

export default AboutPage;
