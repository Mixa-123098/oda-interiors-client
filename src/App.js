import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import authStore from "./store/authStore";

import Header from "./components/Header";
import BottomHeader from "./components/BottomHeader";
import ScrollToTopButton from "./components/ScrollToTopButton";
import QuickContact from "./components/QuickContact";
import Footer from "./components/Footer";
import Seo from "./components/Seo";
// Homepage sections are above the fold on "/", so lazy-loading them only
// bought a "Loading..." flash + layout shift right under the hero. Imported
// statically instead; lazy() is kept below only for off-route pages.
import FirstBlok from "./components/Bloks/FirstBlok";
import SecondBlock from "./components/Bloks/SecondBlock";
import SixBlock from "./components/Bloks/SixBlock";
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
const NotFoundPage = lazy(() => import("./components/Pages/NotFoundPage"));

const MainPageContainer = ({ updateIndexFromSecBlock }) => {
  // Apple-design §14/§207: a full-screen looping video is exactly the kind of
  // background motion reduced-motion users should be spared. Without autoplay
  // the <video> shows its poster (a static hero frame) instead.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div>
      <Seo />
      <Header />
      <div className="main">
        <div className="overlay"></div>

        <video
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          poster={loftPoster}
          className="img video active "
        >
          <source src={loftWebm} type="video/webm" />
          <source src={loftMp4} type="video/mp4" />
        </video>
        <video
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          poster={chehPoster}
          className="video a"
        >
          <source src={chehWebm} type="video/webm" />
          <source src={chehMp4} type="video/mp4" />
        </video>
        <img src={bgvideo3} alt="" className="img video a" />

        <div className="header-content">
          <BottomHeader />
        </div>
      </div>

      <FirstBlok />
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
  const [indexFromSecBlock, setIndexFromSecBlock] = useState(0);
  const updateIndexFromSecBlock = (index) => {
    setIndexFromSecBlock(index + 1);
  };

  useEffect(() => {
    authStore.checkAuth();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
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
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>

      <QuickContact />
      <ScrollToTopButton />
    </div>
  );
}

export { App };

// import { React, useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import "./App.css";

// import { ProjectsPage } from "./components/Pages/ProjectsPage";
// import AboutPage from "./components/Pages/AboutPage";

// import FirstBlok from "./components/Bloks/FirstBlok";
// import SecondBlock from "./components/Bloks/SecondBlock";
// // import ThirdBlock from "./components/Bloks/ThirdBlock";

// // import bgvideo from "./assets/IMG_7070.MP4";
// // import bgvideo from "./assets/bgvideo.mp4";
// import bgvideo2 from "./assets/msedge_XyC2T8qYAq.png";
// // import bgvideo2 from "./assets/bgvideo2.mp4";
// import bgvideo3 from "./assets/photo_2023-11-03_12-03-29.jpg";
// // import bgvideo3 from "./assets/bgvideo3.mp4";
// import cheh from "./assets/cheh.mov"

// import Header from "./components/Header";
// import BottomHeader from "./components/BottomHeader";
// import ProjectArticle from "./components/Pages/Projects/ProjectArticle";
// import RegistrationForm from "./reg/auth/RegistrationForm";
// import Footer from "./components/Footer";
// import AdminPage from "./components/admin-pannel/AdminPage";
// import ScrollToTopButton from "./components/ScrollToTopButton";
// import ForthBlock from "./components/Bloks/ForthBlock";
// import FifthBlock from "./components/Bloks/FifthBlock";
// import SixBlock from "./components/Bloks/SixBlock";
// import ContactsPage from "./components/Pages/ContactsPage";
// import PricePage from "./components/Pages/PricePage";
// import NotFoundPage from "./components/Pages/NotFoundPage";

// const MainPageContainer = ({ updateIndexFromSecBlock }) => {
//   return (
//     <div>
//       <Header />
//       <div className="main">
//         <div className="overlay"></div>

//         <img src={bgvideo2} alt="" className="img video active " />
//         <video src={cheh} autoPlay loop muted className="video a" />
//         <img src={bgvideo3} alt="" className="img video a" />

//         <div className="header-content">
//           <BottomHeader />
//         </div>
//       </div>

//       <FirstBlok />
//       <SecondBlock updateIndexFromSecBlock={updateIndexFromSecBlock} />
//       <SixBlock />
//       {/* <ThirdBlock /> */}
//       <ForthBlock />
//       <FifthBlock />
//       <Footer />
//     </div>
//   );
// };

// function App() {
//   const [indexFromSecBlock, setIndexFromSecBlock] = useState(0);
//   const updateIndexFromSecBlock = (index) => {
//     setIndexFromSecBlock(index + 1);
//   };

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <MainPageContainer
//               updateIndexFromSecBlock={updateIndexFromSecBlock}
//             />
//           }
//         />
//         <Route path="/edit" element={<AdminPage />} />
//         <Route path="/login" element={<RegistrationForm />} />
//         <Route
//           path="/projects"
//           element={<ProjectsPage indexFromSecBlock={indexFromSecBlock} />}
//         />
//         <Route path="/projects/:id" element={<ProjectArticle />} />
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/contacts" element={<ContactsPage />} />
//         <Route path="/price" element={<PricePage />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>

//       <ScrollToTopButton />
//     </div>
//   );
// }

// export { App };
