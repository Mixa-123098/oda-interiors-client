import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "./LocalizedLink";
import useLang from "../lib/useLang";
import { observer } from "mobx-react-lite";
import authStore from "../store/authStore";
import logo from "../assets/logo-header.png";
import ScrollToTop from "../custom-hooks/ScrollToTop";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

// First URL segment -> nav label; shown as the section title in the mobile
// header, where the menu itself is folded away behind the hamburger.
const SECTION_KEYS = {
  projects: "navbar.projectsPage",
  map: "navbar.mapPage",
  about: "navbar.aboutPage",
  contacts: "navbar.contactsPage",
  price: "navbar.pricesPage",
  edit: "navbar.editPage",
};

const Navbar = observer(({ fontColor, rep }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // basePath: the address without its language prefix ("/uk/projects" ->
  // "/projects"); lp puts a path back into the current language.
  const { basePath, lp } = useLang();
  const { isAuthenticated, isStaff } = authStore;
  const navbarItemsList = [
    t("navbar.mainPage"),
    t("navbar.projectsPage"),
    t("navbar.mapPage"),
    t("navbar.aboutPage"),
    t("navbar.contactsPage"),
    t("navbar.pricesPage"),
  ];

  const navbarItemsWays = [];

  if (isStaff) {
    navbarItemsList.push(t("navbar.editPage"));
    navbarItemsWays.push(
      " ",
      "projects",
      "map",
      "about",
      "contacts",
      "price",
      "edit",
      "|there must be a search|"
    );
  } else {
    navbarItemsWays.push(
      " ",
      "projects",
      "map",
      "about",
      "contacts",
      "price",
      "|there must be a search|"
    );
  }

  // NavLink marks the current page (.active + aria-current="page"); "end"
  // keeps Home from matching every route, while /projects/:id still lights
  // up "Projects".
  const navbar = navbarItemsList.map((item, index) => {
    const way = navbarItemsWays[index].trim();
    return (
      <NavLink
        key={index}
        to={`/${way}`}
        end={way === ""}
        className="nav-link nav-styles"
        onClick={ScrollToTop}
      >
        <h6 style={{ color: fontColor }}>{navbarItemsList[index]}</h6>
      </NavLink>
    );
  });

  const handleLogout = async (e) => {
    await authStore.logout();

    navigate(lp("/login"));
  };

  const currentSection = basePath.split("/")[1];
  const hamburgerMenu = navbarItemsList.map((item, index) => {
    const way = navbarItemsWays[index].trim();
    const current = way === currentSection;
    return (
      <li key={index}>
        <a
          className={`menu__item${current ? " active" : ""}`}
          href={lp(`/${way}`)}
          aria-current={current ? "page" : undefined}
        >
          {item}
        </a>
      </li>
    );
  });
  // console.log(isAuthenticated);
  return (
    <>
      <nav className="navbar">
        {navbar}
        <LanguageSelector color={fontColor} />
        {isAuthenticated ? (
          <h6
            onClick={handleLogout}
            style={{ color: fontColor }}
            className="bg-dark text-light p-2 rounded"
          >
            {t("navbar.logoutButton")}
          </h6>
        ) : null}
      </nav>

      <nav className="navbar-hamburger">
        <div className="d-flex align-items-center justify-content-between">
          <input id="menu__toggle" type="checkbox" />
          <label
            className={rep === true ? `menu__btn2` : `menu__btn`}
            htmlFor="menu__toggle"
          >
            <span></span>
          </label>

          <ul className="menu__box">
            {hamburgerMenu}
            {isAuthenticated ? (
              <h6
                onClick={handleLogout}
                style={{ color: fontColor }}
                className="bg-dark text-light p-2 rounded"
              >
                {t("navbar.logoutButton")}
              </h6>
            ) : null}
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
});

function Header({ fontColor, invert, rep }) {
  const { t } = useTranslation();
  const { basePath } = useLang();
  const sectionKey = SECTION_KEYS[basePath.split("/")[1]];
  const [scroll, setScroll] = useState(0);
  const [hidden, setHidden] = useState(false);
  let opacity;
  useEffect(() => {
    // rAF-throttled + passive: the previous handler ran setScroll on every
    // scroll event and re-subscribed the listener on every change (deps was
    // [scroll]). Same computed value (pageYOffset/500 read at frame time, so
    // the resting position is identical), just coalesced to one update per
    // frame with the listener attached once.
    let ticking = false;
    let lastY = window.pageYOffset;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.pageYOffset;
          // Hide on the way down (desktop only, see CSS), come back on any upward move.
          if (y < 160) setHidden(false);
          else if (y > lastY + 4) setHidden(true);
          else if (y < lastY - 4) setHidden(false);
          lastY = y;
          setScroll(y / 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (scroll >= 1) {
    opacity = 1;
  } else {
    opacity = scroll;
  }

  // Desktop only (CSS): once scrolled, every page gets the same slim light glass bar.
  const scrolled = scroll > 0.02;
  const headerClass = [
    "header",
    rep && "header--light",
    scrolled && (rep ? "header--scrolled" : "header--glass"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`header-wrap${hidden ? " header-wrap--hidden" : ""}${
        scrolled && !rep ? " header-wrap--glass" : ""
      }`}
      onFocus={() => setHidden(false)}
    >
      <div
        className="smooth-background"
        style={{ opacity: rep ? 0 : opacity }}
      ></div>
      <header className={headerClass}>
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" onClick={ScrollToTop}>
            <img
              src={logo}
              alt="logo"
              className="header-logo"
              style={{
                filter: rep || scroll === 0 ? invert : `invert(100%)`,
              }}
            />
          </Link>
          {sectionKey ? (
            <span
              className="header-section"
              style={{ color: rep || scroll === 0 ? fontColor : `white` }}
            >
              {t(sectionKey)}
            </span>
          ) : null}
          <Navbar
            fontColor={rep || scroll === 0 ? fontColor : `white`}
            rep={rep}
          />
        </div>
      </header>
    </div>
  );
}

export default Header;
