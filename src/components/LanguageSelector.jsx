import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import languagesStore from "../store/languagesStore";

// color: text colour for the header context (dark on light pages, white on
// hero photos) - the same value the nav links get.
const LanguageSelector = observer(({ color }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || i18n.language
  );
  const ref = useRef(null);

  useEffect(() => {
    languagesStore.fetchLanguages();
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage).catch((error) => {
        console.error("Error initializing language:", error);
      });
    }
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    i18n
      .changeLanguage(lang)
      .then(() => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error changing language:", error);
      });
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
        {language.toUpperCase()}
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
          {languagesStore.languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`language-selector-option${
                  lang.code === language ? " active" : ""
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.code.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default LanguageSelector;
