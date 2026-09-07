import React, { useEffect } from "react";
import "./SecondBlock.css";

import Commercial from "../../assets/photo_2023-11-03_12-42-15.jpg";
import Resident from "../../assets/msedge_YN25gnaTlM.webp";
import Architecture from "../../assets/aero5-1.webp";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

function mouseOver(index) {
  let element = document.querySelectorAll(".projects-img");

  let blockOverlay = document.querySelectorAll(".blockOverlay");
  blockOverlay.forEach((element) => {
    element.style.width = "99.8%";
  });

  switch (index) {
    case 0:
      element[1].src = Commercial;
      element[2].src = Commercial;
      break;
    case 1:
      element[0].src = Resident;
      element[2].src = Resident;
      break;
    case 2:
      element[0].src = Architecture;
      element[1].src = Architecture;
      break;
    default:
      element[0].src = Commercial;
      element[1].src = Resident;
      element[2].src = Architecture;
      break;
  }
}

function mouseOut() {
  let element = document.querySelectorAll(".projects-img");

  let blockOverlay = document.querySelectorAll(".blockOverlay");
  blockOverlay.forEach((element) => {
    element.style.width = "100%";
  });

  element[0].src = Commercial;
  element[1].src = Resident;
  element[2].src = Architecture;
}

const Blocks = ({ updateIndexFromSecBlock }) => {
  const { t } = useTranslation();

  const projectsList = [
    t("mainPage.block2.categories.publicInteriors.title"),
    t("mainPage.block2.categories.residentialInteriorsOne.title"),
    t("mainPage.block2.categories.residentialInteriorsTwo.title"),
  ];
  const interiorList = [
    t("mainPage.block2.categories.publicInteriors.subtitle"),
    t("mainPage.block2.categories.residentialInteriorsOne.subtitle"),
    t("mainPage.block2.categories.residentialInteriorsTwo.subtitle"),
  ];

  useEffect(() => {
    const element = document.querySelectorAll(".projects-img");
    element[0].src = Commercial;
    element[1].src = Resident;
    element[2].src = Architecture;
  }, []);

  const projects = projectsList.map((project, index) => {
    // кароче, тут я позиционирую картинки
    let imgPosition = "";

    switch (index) {
      case 0:
        imgPosition = "projects-img-left";
        break;
      case 1:
        imgPosition = "projects-img-center";
        break;
      case 2:
        imgPosition = "projects-img-right";
        break;
      default:
        break;
    }

    return (
      <div
        key={index}
        className="block-element"
        id="element"
        onMouseOver={() => mouseOver(index)}
        onMouseOut={() => mouseOut()}
        onClick={() => updateIndexFromSecBlock(index)}
      >
        <Link to="/projects" className="block-container">
          <div style={{ position: "relative" }}>
            <h2 className="projects-text">{project}</h2>
            <h2 className="projects-subtext">{interiorList[index]}</h2>

            <div className="blockOverlay"></div>
            {/* Фотки желательно 16:9 формата */}

            <img src="" alt="" className={`projects-img ${imgPosition}`} />
          </div>
        </Link>
      </div>
    );
  });
  // console.log(indexFromSecBlock);
  return <div className="blocks">{projects}</div>;
};

const SecondBlock = ({ updateIndexFromSecBlock }) => {
  return (
    <div className="blocks-container">
      <Blocks updateIndexFromSecBlock={updateIndexFromSecBlock} />

      {/* Подогнать текст под адаптивность через ширину экрана */}
      {/* Адаптивный размер текста  */}
      {/* можно замутить связаность со списком проэктов чтобы все было удобно */}
      {/* добавить зменение состояния */}
      {/* Подогнать шрифты под пример */}
      {/* Добавить плавные переходы */}
    </div>
  );
};

export default SecondBlock;
