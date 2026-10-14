// Language <-> URL. English, the default, stays at the unprefixed URLs search
// engines already know (/about); every other language gets a prefix
// (/uk/about, /pl/about), so each version has its own address to index.
//
// The DB, i18n and project.source_lang call Ukrainian "ua", but that is the
// COUNTRY code - the language is "uk". URLs and hreflang use "uk"; everything
// inside the app keeps "ua".
export const DEFAULT_LANG = "en";
export const SITE_URL = "https://oda-interiors.com";
const DB_TO_URL = { ua: "uk" };
const URL_TO_DB = { uk: "ua" };
// Top-level paths short enough to look like a language prefix (the server
// refuses these as language codes - keep in step with server/index.js).
const RESERVED = new Set(["map", "api", "img"]);
const STORAGE_KEY = "language";

export const toUrlCode = (dbCode) => DB_TO_URL[dbCode] || dbCode;
export const toDbCode = (urlCode) => URL_TO_DB[urlCode] || urlCode;

// "/uk/projects/6" -> { urlLang: "uk", rest: "/projects/6" }
// "/projects/6"    -> { urlLang: null, rest: "/projects/6" }
export function splitLang(pathname) {
  const match = /^\/([a-z]{2,3})(?=\/|$)(.*)$/.exec(pathname || "/");
  if (!match || RESERVED.has(match[1])) return { urlLang: null, rest: pathname || "/" };
  return { urlLang: match[1], rest: match[2] || "/" };
}

// The UI language a path is in, as an app/DB code ("ua").
export function dbLangFromPath(pathname) {
  const { urlLang } = splitLang(pathname);
  return urlLang ? toDbCode(urlLang) : DEFAULT_LANG;
}

// Puts an app path ("/projects/6") into a language: "/uk/projects/6".
// Paths that are already prefixed are re-prefixed, anything that isn't a
// site path (mailto:, https://...) is returned as is.
export function localizePath(path, dbCode) {
  if (typeof path !== "string" || path[0] !== "/") return path;
  const { rest } = splitLang(path);
  if (!dbCode || dbCode === DEFAULT_LANG) return rest;
  return `/${toUrlCode(dbCode)}${rest === "/" ? "" : rest}`;
}

// The visitor's own choice, remembered so that coming back to an
// unprefixed address takes them to their language (see LanguageSync).
export function readSavedLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

export function saveLang(dbCode) {
  try {
    localStorage.setItem(STORAGE_KEY, dbCode);
  } catch (e) {
    /* storage unavailable (private mode etc.) - the URL still carries it */
  }
}
