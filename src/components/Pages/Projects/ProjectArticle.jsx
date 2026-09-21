import ResponsiveImg from "../../ResponsiveImg";
import ScrollHint from "../../ScrollHint";
import Lightbox from "../../Lightbox";
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import "./ProjectArticle.css";
import Header from "../../Header";
import Seo from "../../Seo";
import ScrollToTop from "../../../custom-hooks/ScrollToTop.jsx";
import Footer from "../../Footer";
import i18n from "../../../i18n.js";
import { useTranslation } from "react-i18next";
import Loader from "../../../loader/Loader.jsx";
import { API_URL } from "../../../config/api";
import authStore from "../../../store/authStore";

const ProjectHeader = ({ dataList, parallaxOffset }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="overlay"></div>

      <div className="paralax_img">
        <div className="header-paralax">
          <div className="header-text">
            <h1 className="titlePage">
              {/* {i18n.language === "ua"
                ? dataList && dataList.project_name
                : t(`projects.project${dataList && dataList.id}.name`)} */}
              {dataList &&
                (t(`projects.project${dataList.id}.name`) !==
                `projects.project${dataList.id}.name`
                  ? t(`projects.project${dataList.id}.name`)
                  : dataList.project_name)}
              {dataList && dataList.is_hidden && (
                <span className="badge text-bg-secondary ms-2 align-middle">
                  {t("editPage.editProject.hidden")}
                </span>
              )}
            </h1>
          </div>
        </div>

        <ResponsiveImg
          file={dataList && dataList.project_header_img}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
          alt={dataList?.project_name || ""}
          // object-fit:cover in a 100vh box: on a portrait phone the photo is
          // scaled by HEIGHT, so it needs ~1.8x the viewport height in pixels.
          sizes="max(100vw, 180vh)"
          priority
        />
        <ScrollHint />
      </div>
    </>
  );
};

const ProjectArticleBrief = ({ dataList }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="container d-flex justify-content-center brief-height set-column ">
        <div className="brif-styles   col-lg-6">
          <h3 className="">{t("projects.projectDescription")}</h3>
          <p className="w-100">
            {" "}
            {dataList &&
              (t(`projects.project${dataList.id}.brief`) !==
              `projects.project${dataList.id}.brief`
                ? t(`projects.project${dataList.id}.brief`)
                : dataList.project_brief)}
            {/* {i18n.language === "ua"
              ? dataList && dataList.project_brief
              : t(`projects.project${dataList && dataList.id}.brief`)} */}
          </p>
        </div>

        <div className=" brif-info-styles col-lg-3  text-start">
          <div>
            <img src="" alt="" />
            <div className="">
              <b>{t("projects.placement")}:</b>
              <br />{" "}
              {dataList &&
                (t(`projects.project${dataList.id}.city`) !==
                `projects.project${dataList.id}.city`
                  ? t(`projects.project${dataList.id}.city`)
                  : dataList.project_city)}
              {/* {i18n.language === "ua"
                ? dataList && dataList.project_city
                : t(`projects.project${dataList && dataList.id}.city`)} */}
              {", "}
              {dataList &&
                (t(`projects.project${dataList.id}.country`) !==
                `projects.project${dataList.id}.country`
                  ? t(`projects.project${dataList.id}.country`)
                  : dataList.project_country)}
              {/* {i18n.language === "ua"
                ? dataList && dataList.project_country
                : t(`projects.project${dataList && dataList.id}.country`)} */}
            </div>
          </div>
          <div>
            <img src="" alt="" />
            <div className="">
              <p>
                <b>{t("projects.square")}:</b>
                <br />
                {dataList &&
                  (t(`projects.project${dataList.id}.area`) !==
                  `projects.project${dataList.id}.area`
                    ? t(`projects.project${dataList.id}.area`)
                    : dataList && (
                        <>
                          {dataList.project_square} м<sup>2</sup>
                        </>
                      ))}
                {/* {i18n.language === "ua"
                  ? dataList && (
                      <>
                        {dataList.project_square} м<sup>2</sup>
                      </>
                    )
                  : t(`projects.project${dataList?.id}.area`)} */}
              </p>
            </div>
          </div>
          <div>
            <img src="" alt="" />
            <div className="">
              <p>
                <b>{t("projects.endDate")}:</b>
                <br />
                {dataList &&
                  (t(`projects.project${dataList.id}.end_date`) !==
                  `projects.project${dataList.id}.end_date`
                    ? t(`projects.project${dataList.id}.end_date`)
                    : dataList.project_finish_date)}
                {/* {i18n.language === "ua"
                  ? dataList && dataList.project_finish_date
                  : t(`projects.project${dataList && dataList.id}.end_date`)} */}
              </p>
            </div>
          </div>
          <div>
            <img src="" alt="" />
            <div className="">
              <b>{t("projects.team")}:</b>
              <br />
              {dataList &&
                (t(`projects.project${dataList.id}.team`) !==
                `projects.project${dataList.id}.team`
                  ? t(`projects.project${dataList.id}.team`)
                  : dataList.project_team)}
              {/* {i18n.language === "ua"
                ? dataList && dataList.project_team
                : t(`projects.project${dataList && dataList.id}.team`)} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProjectArticlePlanning = ({ id, translation }) => {
  const { t } = useTranslation();

  const [blueprints, setBlueprint] = useState();
  // The floor plan is the one image people actually want to inspect, so it
  // opens in the same viewer as the gallery - as a set of one, which hides the
  // arrows and the counter.
  const [planOpen, setPlanOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/blueprints`, { credentials: "include" })
      .then((response) => response.json())
      // eslint-disable-next-line eqeqeq
      .then((data) => setBlueprint(data.find((item) => item.project_id == id)));
  }, [id]);

  return (
    <>
      <div className="d-flex  container-lg  justify-content-around planning-adaptation">
        <div className="col-md-6 col-sm-8 d-flex  justify-content-center">
          {blueprints && blueprints.img && (
            <button
              type="button"
              className="planning-zoom"
              onClick={() => setPlanOpen(true)}
              aria-label={t("gallery.openPlan", {
                defaultValue: "Open the floor plan",
              })}
            >
              <ResponsiveImg
                file={blueprints.img}
                alt={t("projects.blueprintDescription")}
                className="planning-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          )}
        </div>

        <div className="col-md-6 col-sm-8 planning-text">
          <h3 className="text-center">{t("projects.blueprintDescription")}</h3>
          <div>
            {blueprints &&
              (t(
                `projects.project${blueprints.project_id}.drawing_description`
              ) !==
              `projects.project${blueprints.project_id}.drawing_description`
                ? t(
                    `projects.project${blueprints.project_id}.drawing_description`
                  )
                : (translation && translation.drawing_description) ||
                  blueprints.description)}
          </div>
        </div>
      </div>

      <Lightbox
        items={
          blueprints && blueprints.img
            ? [
                {
                  id: blueprints.id,
                  img: blueprints.img,
                  alt: t("projects.blueprintDescription"),
                },
              ]
            : []
        }
        index={planOpen ? 0 : null}
        onClose={() => setPlanOpen(false)}
        onIndex={() => {}}
      />
    </>
  );
};

const ProjectArticleImges = ({ id, name }) => {
  const { t } = useTranslation();
  const [projectImges, setProjectImges] = useState([]);
  // Index of the photo shown fullscreen, or null when the viewer is closed.
  const [openAt, setOpenAt] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/project_imges`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) =>
        setProjectImges(
          data
            // eslint-disable-next-line eqeqeq
            .filter((item) => item.project_id == id)
            .sort((a, b) => a.order - b.order)
        )
      );
  }, [id]);

  if (!projectImges.length) return null;

  // One shared 3:4 cell for every photo. The source set is a mix of 3:4 and
  // 4:3 at ~380-700px, so laying them out at their own sizes left ragged
  // columns and wide empty gutters; cropping them to one ratio makes the page
  // read as a designed sheet, and the whole uncropped frame is one tap away.
  return (
    <>
      <section className="project-gallery">
        <div className="project-gallery-grid">
          {projectImges.map((element, i) => (
            <button
              key={element.id}
              type="button"
              className="project-gallery-cell"
              onClick={() => setOpenAt(i)}
              aria-label={t("gallery.open", {
                defaultValue: "Open photo {{n}} of {{total}}",
                n: i + 1,
                total: projectImges.length,
              })}
            >
              <ResponsiveImg
                file={element.img}
                alt={name || ""}
                className="gallery-img"
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </section>

      <Lightbox
        items={projectImges.map((element) => ({
          id: element.id,
          img: element.img,
          alt: name || "",
        }))}
        index={openAt}
        onClose={() => setOpenAt(null)}
        onIndex={setOpenAt}
      />
    </>
  );
};
const PrevAndNextProject = ({ id }) => {
  const { t } = useTranslation();

  const project_id = Number(id);
  const [dataList, setDataList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  // console.log(dataList);
  useEffect(() => {
    fetch(`${API_URL}/projects`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setDataList(data);
        const index = data.findIndex((item) => item.id === project_id);
        setCurrentIndex(index);
      });
  }, [project_id]);

  const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextIndex =
    currentIndex < dataList.length - 1 ? currentIndex + 1 : null;

  return (
    <>
      <div className="prev-and-next-project d-flex justify-content-around">
        {prevIndex !== null && (
          <Link
            to={`/projects/${dataList[prevIndex].id}`}
            onClick={ScrollToTop}
            className="pn-link pn-link--prev text-decoration-none text-light"
          >
            <span className="pn-arrow" aria-hidden="true">←</span>
            <h4>{t("projects.prev")}</h4>
          </Link>
        )}
        {nextIndex !== null && (
          <Link
            to={`/projects/${dataList[nextIndex].id}`}
            onClick={ScrollToTop}
            className="pn-link pn-link--next text-decoration-none text-light"
          >
            <h4>{t("projects.next")}</h4>
            <span className="pn-arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </>
  );
};

// const PrevAndNextProject = ({ id }) => {
//   const project_id = Number(id);
//   const [dataList, setDataList] = useState();
//   console.log(dataList);

//   useEffect(() => {
//     fetch(`${API_URL}/projects`)
//       .then((response) => response.json())
//       .then((data) => setDataList(data));
//   }, [id]);

//   const order =
//     dataList && dataList.findIndex((item) => item.id === project_id);
//   console.log(
//     `Порядок элемента с project_id ${project_id} в массиве: ${order}`
//   );

//   console.log(order+1);
//   // console.log(dataList);
//   return (
//     <>
//       <div className="prev-and-next-project d-flex justify-content-around">
//         <Link
//           to={`/projects/${project_id - 1}`}
//           onClick={<ScrollToTop />}
//           className="text-decoration-none text-light"
//         >
//           <h4>Попередній проєкт</h4>
//         </Link>
//         <Link
//           to={`/projects/${project_id + 1}`}
//           onClick={<ScrollToTop />}
//           className="text-decoration-none text-light"
//         >
//           <h4>Наступний проєкт</h4>
//         </Link>
//       </div>
//     </>
//   );
// };
const ProjectArticle = observer(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState();
  const [translation, setTranslation] = useState(null);
  // A project with no translation into the current language shouldn't be
  // viewable there — it used to silently fall back to the source-language
  // text, which looked translated when it wasn't.
  const [notAvailable, setNotAvailable] = useState(false);
  // console.log(dataList);
  const [scrollY, setScrollY] = useState(0);
  // i18n is a module singleton, so react-hooks can't see i18n.language as a
  // valid dependency. useTranslation() above re-renders this component on a
  // language switch, so reading it into a local first is both correct and
  // lint-clean.
  const lang = i18n.language;

  useEffect(() => {
    let cancelled = false;
    // credentials included so a logged-in admin/moderator can preview a
    // hidden (draft) project exactly as it will look once published —
    // anonymous visitors get filtered results from the server either way.
    fetch(`${API_URL}/projects`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const project = data.find((p) => p.id === parseInt(id));
        setDataList(project);
        setLoading(false);

        if (!project) return;

        if (lang === project.source_lang) {
          setTranslation(null);
          setNotAvailable(false);
          return;
        }

        // Machine-translated fields for languages other than the project's
        // own source_lang (see components below: they try the static i18n
        // key first, and only fall back to this).
        fetch(`${API_URL}/project_translations`, { credentials: "include" })
          .then((response) => response.json())
          .then((tdata) => {
            if (cancelled) return;
            const row = tdata.find(
              (r) => r.project_id === parseInt(id) && r.lang === lang
            );
            setTranslation(row || null);
            setNotAvailable(!row);
          })
          .catch((error) => {
            console.error("Error fetching project translations:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        setLoading(false);
      });

    // rAF-throttled + passive: an un-throttled scroll listener updates state
    // on every single scroll event, which on mobile's high-frequency touch
    // scroll can't keep up - the image visibly lags behind and jumps in
    // chunks relative to the static .overlay scrim, looking like the shadow
    // is "sliding" separately from the photo.
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [id, lang]);

  useEffect(() => {
    if (notAvailable) {
      navigate("/projects");
    }
  }, [notAvailable, navigate]);

  // On phones, the header image is also 100vh, which the mobile browser
  // resizes as its address bar hides/shows mid-scroll - combined with the
  // JS-driven translateY, that made the image drift out of sync with the
  // static overlay/text on top of it. Disabling the motion on narrow
  // viewports (same breakpoint the nav already treats as "mobile") removes
  // the effect where it can't be done reliably, while leaving desktop as-is.
  const isMobileViewport =
    typeof window !== "undefined" && window.innerWidth <= 1000;
  const parallaxOffset = isMobileViewport ? 0 : scrollY * 0.5;

  if (loading || notAvailable) {
    return <Loader />;
  }

  const resolvedDataList =
    dataList &&
    (translation
      ? {
          ...dataList,
          project_name: translation.name || dataList.project_name,
          project_city: translation.city || dataList.project_city,
          project_country: translation.country || dataList.project_country,
          project_brief: translation.brief || dataList.project_brief,
          project_finish_date:
            translation.end_date || dataList.project_finish_date,
          project_team: translation.team || dataList.project_team,
        }
      : dataList);

  const nameKey = `projects.project${resolvedDataList?.id}.name`;
  const briefKey = `projects.project${resolvedDataList?.id}.brief`;
  const seoTitle =
    resolvedDataList &&
    (t(nameKey) !== nameKey ? t(nameKey) : resolvedDataList.project_name);
  const seoDescription =
    resolvedDataList &&
    (t(briefKey) !== briefKey ? t(briefKey) : resolvedDataList.project_brief);
  // Share previews of a project link should show the project's own photo,
  // not the site logo.
  const seoImage =
    resolvedDataList?.project_header_img &&
    `https://oda-interiors.com/img/main_imges_folder/${resolvedDataList.project_header_img}`;

  const isStaff =
    authStore.user?.role === "admin" || authStore.user?.role === "moderator";

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} image={seoImage} />
      {isStaff && resolvedDataList?.is_hidden && (
        <div
          className="alert alert-warning text-center mb-0 rounded-0"
          role="alert"
        >
          {t("projects.draftPreview")}
        </div>
      )}
      <Header />
      <ProjectHeader dataList={resolvedDataList} parallaxOffset={parallaxOffset} />
      <ProjectArticleBrief dataList={resolvedDataList} />
      <ProjectArticlePlanning id={id} translation={translation} />
      <ProjectArticleImges id={id} name={seoTitle} />

      <PrevAndNextProject id={id} />
      <Footer />
    </>
  );
});

export default ProjectArticle;
