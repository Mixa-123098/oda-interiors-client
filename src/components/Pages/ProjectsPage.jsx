import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./ProjectsPage.css";

import Header from "../Header";
import ProjectsPagesNav from "./ProjectsPagesNav";
import PagesHeader from "./PagesHeader";
import Footer from "../Footer";
import Seo from "../Seo";
import { useTranslation } from "react-i18next";
import i18n from "i18next"; // i18n для определения языка
// import axios from "axios";
import { API_URL } from "../../config/api";

const ProjectsList = ({ focusedPage, itemsPerPage, filteredData, translations }) => {
  const { t } = useTranslation();
  const startIndex = (focusedPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const renderedData = filteredData
    .slice(startIndex, endIndex)
    .map((element, index) => {
      const translation =
        i18n.language !== "ua" &&
        translations.find(
          (row) => row.project_id === element.id && row.lang === i18n.language
        );

      return (
        <div key={element.id} id={index}>
          <Link
            to={`/projects/${element.id} `}
            className="text-center link-style"
          >
            <div className="project-thumb-wrap">
              <img
                src={`/img/main_imges_folder/${element.project_img_src}`}
                alt={element.project_name || ""}
                className="project_img "
              />
              {element.is_hidden && (
                <span className="badge text-bg-secondary project-hidden-badge">
                  {t("editPage.editProject.hidden")}
                </span>
              )}
            </div>

            <h5 className="project_name">
              {element &&
                (t(`projects.project${element.id}.name`) !==
                `projects.project${element.id}.name`
                  ? t(`projects.project${element.id}.name`)
                  : (translation && translation.name) || element.project_name)}
            </h5>
          </Link>
        </div>
      );
    });

  return (
    <div className="projects-container">
      <div className="our-projects">{renderedData}</div>
    </div>
  );
};

const Projects = ({ indexFromSecBlock }) => {
  const [dataList, setDataList] = useState([]);
  const [translations, setTranslations] = useState([]);
  const index = indexFromSecBlock || 0;
  useEffect(() => {
    fetch(`${API_URL}/projects`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setDataList(data))
      .catch((error) => {
        console.error("Ошибка получения данных:", error);
      });
    fetch(`${API_URL}/project_translations`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setTranslations(data))
      .catch((error) => {
        console.error("Ошибка получения переводов:", error);
      });
  }, []);
  const { t } = useTranslation();
  const categoriesList = [
    //можно взять категории из бд, но пока так
    t("projectsPage.categories.all"),
    t("projectsPage.categories.publicInteriors"),
    t("projectsPage.categories.apartments"),
    t("projectsPage.categories.privateHouses"),
  ];

  const [focusedIndex, setFocusedIndex] = useState(index);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const setFocused = (index) => {
    setFocusedIndex(index);
    setCurrentPage(1);
  };

  // A project with no translation into the current language shouldn't show
  // up at all — previously it silently fell back to the source-language
  // text, which looked like a translation existed when it didn't.
  //
  // Memoized so it only recomputes when its inputs change (was recomputed on
  // every render, including a category click or pagination). The Set of
  // translated project ids turns the previous O(projects x translations)
  // nested scan into O(projects); the resulting set of projects is identical.
  const availableInLanguage = useMemo(() => {
    const translatedIds = new Set(
      translations
        .filter((row) => row.lang === i18n.language)
        .map((row) => row.project_id)
    );
    return dataList.filter(
      (project) =>
        project.source_lang === i18n.language || translatedIds.has(project.id)
    );
  }, [dataList, translations, i18n.language]);

  const filteredData = useMemo(
    () =>
      focusedIndex === 0
        ? availableInLanguage
        : availableInLanguage.filter(
            // eslint-disable-next-line eqeqeq
            (element) => element.project_specialization == focusedIndex
          ),
    [availableInLanguage, focusedIndex]
  );
  const categories = categoriesList.map((category, index) => {
    return (
      <button
        key={index}
        id={`projects-nav-button-${index}`}
        className={`projects-nav-button${
          focusedIndex === index ? " active" : ""
        }`}
        // autoFocus={index === 0}
        onClick={() => setFocused(index)}
      >
        {category}
      </button>
    );
  });

  return (
    <>
      <div className="d-flex justify-content-center">
        <nav className="projects-nav">{categories}</nav>
      </div>

      <ProjectsList
        focusedIndex={focusedIndex}
        focusedPage={currentPage}
        itemsPerPage={itemsPerPage}
        filteredData={filteredData}
        dataList={dataList}
        translations={translations}
      />
      <ProjectsPagesNav
        setFocusedPage={setCurrentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        currentPage={currentPage}
      />
      <div className="mb-5"></div>
    </>
  );
};

// const ProjectsPage2 = () => {
//   const [text, setText] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [sourceLang, setSourceLang] = useState("en");
//   const [targetLang, setTargetLang] = useState("es");

//   const handleTranslate = async () => {
//     try {
//       const response = await axios.post("http://localhost:3001/api/translate", {
//         text,
//         sourceLang,
//         targetLang,
//       });
//       setTranslatedText(response.data.translatedText);
//     } catch (error) {
//       console.error("Ошибка при переводе:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Перевод текста</h1>
//       <textarea
//         placeholder="Введите текст для перевода"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <br />
//       <select
//         value={sourceLang}
//         onChange={(e) => setSourceLang(e.target.value)}
//       >
//         <option value="en">Английский</option>
//         <option value="es">Испанский</option>
//         <option value="fr">Французский</option>
//         {/* Добавьте другие языки при необходимости */}
//       </select>
//       <select
//         value={targetLang}
//         onChange={(e) => setTargetLang(e.target.value)}
//       >
//         <option value="en">Английский</option>
//         <option value="es">Испанский</option>
//         <option value="fr">Французский</option>
//       </select>
//       <br />
//       <button onClick={handleTranslate}>Перевести</button>
//       {translatedText && (
//         <div>
//           <h3>Перевод:</h3>
//           <p>{translatedText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

const ProjectsPage = ({ indexFromSecBlock }) => {
  const { t } = useTranslation();
  return (
    <div className="projects">
      <Seo
        title="Our Projects"
        description="Browse ODA's portfolio of apartment, private house, and public interior design projects in Dnipro and Kyiv, Ukraine."
      />
      <Header fontColor={`#000000`} invert={`invert(0%)`} rep={true} />
      <PagesHeader title={t("projectsPage.ourProjects")} />
      {/* <ProjectsPage2 /> */}
      <Projects indexFromSecBlock={indexFromSecBlock} />
      <Footer settings={{ color: `black`, bgColor: `white`, shadow: true }} />
    </div>
  );
};

// export { ProjectsPage };
export default ProjectsPage;
