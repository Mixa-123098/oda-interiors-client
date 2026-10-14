import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { observer } from "mobx-react-lite";
import i18n from "./i18n";
import "./App.css";
import authStore from "./store/authStore";
import languagesStore from "./store/languagesStore";
import useRevealOnScroll from "./custom-hooks/useRevealOnScroll";
import {
  DEFAULT_LANG,
  dbLangFromPath,
  localizePath,
  readSavedLang,
  saveLang,
  splitLang,
  toDbCode,
  toUrlCode,
} from "./lib/lang";

import Header from "./components/Header";
import BottomHeader from "./components/BottomHeader";
import ScrollToTopButton from "./components/ScrollToTopButton";
// QuickContact остаётся выключенным (мобильная версия) - импорт
// закомментирован вместе с ним, чтобы не ловить no-unused-vars.
// import QuickContact from "./components/QuickContact";
import Footer from "./components/Footer";
import ScrollHint from "./components/ScrollHint";
import Seo from "./components/Seo";
// Homepage sections are above the fold on "/", so lazy-loading them only
// bought a "Loading..." flash + layout shift right under the hero. Imported
// statically instead; lazy() is kept below only for off-route pages.
import FirstBlok from "./components/Bloks/FirstBlok";
import SecondBlock from "./components/Bloks/SecondBlock";
import SixBlock from "./components/Bloks/SixBlock";
import FeaturedProjects from "./components/Bloks/FeaturedProjects";
import ForthBlock from "./components/Bloks/ForthBlock";
import FifthBlock from "./components/Bloks/FifthBlock";
import MainCta from "./components/MainCta";
import TrustBar from "./components/TrustBar";
import loftWebm from "./assets/loft-1080.webm";
import loftMp4 from "./assets/loft-1080.mp4";
import loftPoster from "./assets/loft-poster.jpg";
import bgvideo3 from "./assets/photo_2023-11-03_12-03-29.jpg";
import chehWebm from "./assets/cheh-1080.webm";
import chehMp4 from "./assets/cheh-1080.mp4";
import chehPoster from "./assets/cheh-poster.jpg";
// import { ProjectsPage } from "./components/Pages/ProjectsPage";

// Lazy-loaded components
const ProjectsPage = lazy(() => import("./components/Pages/ProjectsPage"));
const AboutPage = lazy(() => import("./components/Pages/AboutPage"));
const ProjectArticle = lazy(() =>
  import("./components/Pages/Projects/ProjectArticle")
);
const RegistrationForm = lazy(() => import("./reg/auth/RegistrationForm"));
const AdminPage = lazy(() => import("./components/admin-pannel/AdminPage"));
const ContactsPage = lazy(() => import("./components/Pages/ContactsPage"));
const PricePage = lazy(() => import("./components/Pages/PricePage"));
const MapPage = lazy(() => import("./components/Pages/MapPage"));
const NotFoundPage = lazy(() => import("./components/Pages/NotFoundPage"));

const MainPageContainer = ({ updateIndexFromSecBlock }) => {
  // Apple-design §14/§207: a full-screen looping video is exactly the kind of
  // background motion reduced-motion users should be spared. Without autoplay
  // the <video> shows its poster (a static hero frame) instead.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The two hero videos are ~4.3MB. On Data Saver or anything slower than 4G
  // they stay as their poster frames (still a full-quality hero image) so the
  // page isn't held up by video on a weak mobile connection.
  const connection =
    typeof navigator !== "undefined" &&
    (navigator.connection || navigator.mozConnection);
  const liteMedia =
    prefersReducedMotion ||
    !!(connection && (connection.saveData || (connection.effectiveType && connection.effectiveType !== "4g")));
  return (
    <div>
      <Seo />
      <Header />
      {/* The page's own content, between the header and the footer (a <main> landmark for search engines and screen readers). */}
      <main>
        <div className="main">
          <div className="overlay"></div>

          <video
            autoPlay={!liteMedia}
            preload={liteMedia ? "none" : "auto"}
            data-lite={liteMedia ? "1" : undefined}
            loop
            muted
            playsInline
            poster={loftPoster}
            className="img video active "
          >
            <source src={loftWebm} type="video/webm" />
            <source src={loftMp4} type="video/mp4" />
          </video>
          {/* Second slide's video: not downloaded until the slide is shown
              (BottomHeader plays it on activation), so it doesn't compete with
              the first video and the rest of the page for bandwidth. */}
          <video
            preload="none"
            data-lite={liteMedia ? "1" : undefined}
            loop
            muted
            playsInline
            poster={chehPoster}
            className="video"
          >
            <source src={chehWebm} type="video/webm" />
            <source src={chehMp4} type="video/mp4" />
          </video>
          <img src={bgvideo3} alt="" className="img video" />

          <div className="header-content">
            <BottomHeader />
          </div>
          <ScrollHint />
        </div>

        <FirstBlok />
        <FeaturedProjects />
        <SecondBlock updateIndexFromSecBlock={updateIndexFromSecBlock} />
        <SixBlock />
        <ForthBlock />
        <FifthBlock />
        <TrustBar />
        <MainCta />
      </main>
      <Footer />
    </div>
  );
};

const notFound = (
  <Suspense fallback={<div>Loading...</div>}>
    <NotFoundPage />
  </Suspense>
);

// Keeps i18n, <html lang> and the remembered choice in step with the URL,
// which is what decides the language (see lib/lang.js).
const LanguageSync = observer(() => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const lang = dbLangFromPath(pathname);
  // Read before anything below saves the current page's language over it.
  const [savedOnArrival] = useState(readSavedLang);
  const checkedSaved = useRef(false);
  const { settled, languages } = languagesStore;

  useEffect(() => {
    languagesStore.fetchLanguages();
  }, []);

  // Once, on arrival: someone who chose a language before and lands on an
  // unprefixed (English) address goes to their own version. Waits for the
  // language list so nobody is sent to a since-deleted language. Bots have
  // no saved choice, so they always get exactly the URL they asked for.
  useEffect(() => {
    if (checkedSaved.current || !settled) return;
    checkedSaved.current = true;
    const { urlLang, rest } = splitLang(pathname);
    if (
      !urlLang &&
      savedOnArrival &&
      savedOnArrival !== DEFAULT_LANG &&
      languages.some((l) => l.code === savedOnArrival)
    ) {
      navigate(localizePath(rest, savedOnArrival) + search + hash, { replace: true });
    }
  }, [settled, languages, savedOnArrival, pathname, search, hash, navigate]);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).catch((error) => {
        console.error("Error changing language:", error);
      });
    }
    if (checkedSaved.current) saveLang(lang);
  }, [lang, settled]);

  return <Helmet htmlAttributes={{ lang: toUrlCode(lang) }} />;
});

// Wraps every page under "/:lang/...". English lives unprefixed, Ukrainian
// is "/uk/" not "/ua/", and an unknown prefix is a 404.
const LangGate = observer(({ children }) => {
  const { lang } = useParams();
  const { search, hash, pathname } = useLocation();
  const { rest } = splitLang(pathname);
  const dbCode = toDbCode(lang);

  if (dbCode === DEFAULT_LANG || toUrlCode(dbCode) !== lang) {
    return <Navigate to={localizePath(rest, dbCode) + search + hash} replace />;
  }
  if (!languagesStore.languages.some((l) => l.code === dbCode)) {
    // The built-in list covers en/ua/sk; others are known once it's fetched.
    return languagesStore.settled ? notFound : null;
  }
  return children;
});

function App() {
  useRevealOnScroll();
  const { pathname, search, hash } = useLocation();
  const [indexFromSecBlock, setIndexFromSecBlock] = useState(0);
  const updateIndexFromSecBlock = (index) => {
    setIndexFromSecBlock(index + 1);
  };

  useEffect(() => {
    authStore.checkAuth();
  }, []);

  const lazyPage = (element) => (
    <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
  );
  // Each page answers both at its English address and under a language
  // prefix: "/about" and "/:lang/about" (e.g. "/uk/about"). The admin panel
  // and login too, so they show in the language the staff member reads.
  const pages = [
    ["/", <MainPageContainer updateIndexFromSecBlock={updateIndexFromSecBlock} />],
    ["/edit", lazyPage(<AdminPage />)],
    ["/login", lazyPage(<RegistrationForm />)],
    ["/projects", lazyPage(<ProjectsPage indexFromSecBlock={indexFromSecBlock} />)],
    ["/projects/:id", lazyPage(<ProjectArticle />)],
    ["/about", lazyPage(<AboutPage />)],
    ["/contacts", lazyPage(<ContactsPage />)],
    ["/price", lazyPage(<PricePage />)],
    ["/map", lazyPage(<MapPage />)],
  ];

  return (
    <>
    {/* Outside the keyed wrapper: it must live across navigations. */}
    <LanguageSync />
    <div key={pathname} className="page-fade" style={{ minHeight: "100vh" }}>
      <Routes>
        {pages.map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
        {pages.map(([path, element]) => (
          <Route
            key={`lang${path}`}
            path={path === "/" ? "/:lang" : `/:lang${path}`}
            element={<LangGate>{element}</LangGate>}
          />
        ))}
        <Route path="*" element={notFound} />
      </Routes>
      {/* Routes match case-insensitively, so /PROJECTS was a second copy of
          /projects. Every real address is lowercase. */}
      {/[A-Z]/.test(pathname) && (
        <Navigate to={pathname.toLowerCase() + search + hash} replace />
      )}

      {/* <QuickContact /> */}      {/* временно убрал, делаю мобильную версию */}

      <ScrollToTopButton />
    </div>
    </>
  );
}

export { App };