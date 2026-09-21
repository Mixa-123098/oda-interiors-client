import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import authStore from "./store/authStore";
import useRevealOnScroll from "./custom-hooks/useRevealOnScroll";

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
      <Footer />
    </div>
  );
};

function App() {
  useRevealOnScroll();
  const { pathname } = useLocation();
  const [indexFromSecBlock, setIndexFromSecBlock] = useState(0);
  const updateIndexFromSecBlock = (index) => {
    setIndexFromSecBlock(index + 1);
  };

  useEffect(() => {
    authStore.checkAuth();
  }, []);

  return (
    <div key={pathname} className="page-fade" style={{ minHeight: "100vh" }}>
      <Routes>
        <Route
          path="/"
          element={
            <MainPageContainer
              updateIndexFromSecBlock={updateIndexFromSecBlock}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegistrationForm />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProjectsPage indexFromSecBlock={indexFromSecBlock} />
            </Suspense>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProjectArticle />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="/contacts"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ContactsPage />
            </Suspense>
          }
        />
        <Route
          path="/price"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PricePage />
            </Suspense>
          }
        />
        <Route
          path="/map"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <MapPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      
      {/* <QuickContact /> */}      {/* временно убрал, делаю мобильную версию */}

      <ScrollToTopButton />
    </div>
  );
}

export { App };