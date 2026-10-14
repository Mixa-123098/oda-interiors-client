import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router-dom";
import languagesStore from "../store/languagesStore";
import useLang from "../lib/useLang";
import { localizePath, saveLang } from "../lib/lang";

// color: text colour for the header context (dark on light pages, white on
// hero photos) - the same value the nav links get.
//
// The language is part of the address (/uk/about), so choosing one opens the
// same page at its address in that language; App.js (LanguageSync) then
// switches i18n to follow the URL.
const LanguageSelector = observer(({ color }) => {
  const { lang, basePath } = useLang();
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    languagesStore.fetchLanguages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    setIsOpen(false);
    if (code === lang) return;
    saveLang(code);
    navigate(localizePath(basePath, code) + search + hash);
  };

  return (
    <div className="language-selector" ref={ref} style={{ color: color || "var(--mainColor)" }}>
      <button
        type="button"
        className="language-selector-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {lang.toUpperCase()}
        <svg
          className={`language-selector-caret${isOpen ? " open" : ""}`}
          viewBox="0 0 10 6"
          width="10"
          height="6"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <polyline points="1,1 5,5 9,1" />
        </svg>
      </button>
      {isOpen && (
        <ul className="language-selector-menu">
          {languagesStore.languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                className={`language-selector-option${
                  l.code === lang ? " active" : ""
                }`}
                onClick={() => changeLanguage(l.code)}
              >
                {l.code.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default LanguageSelector;
