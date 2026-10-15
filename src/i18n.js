import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { API_URL } from "./config/api";
import { dbLangFromPath } from "./lib/lang";

// All UI copy — built-in languages (ua/en/sk) included — now lives in
// languages.ui_translations in the DB, seeded once from the old static
// files, so it can be corrected from the admin panel without a redeploy.
//
// The DB translations used to be re-fetched over the network on EVERY page
// load, blocking first text paint. They're now cached in localStorage via a
// chained backend: the local cache is read first (no network), and only when
// it's missing or expired do we hit the HTTP endpoint, whose result is then
// written back into the cache. Trade-off: an admin's edit reaches a returning
// visitor within the cache TTL (24h) rather than instantly. Bump CACHE_VERSION
// to force-invalidate every client's cache immediately if ever needed.
// Bump this on EVERY copy migration in server/index.js: those rewrite values
// already stored in the DB, and without a bump a returning visitor keeps
// serving the old strings from their own cache for up to 24h.
//   v5 - "Kyiv · Dnipro / cities we work in" -> "Worldwide"
//   v6 - About page values list condensed to one line each
//   v7 - About page story rewritten (was about building the website)
//   v8 - seo.* titles/descriptions per language, admin language-address
//        strings, missing keys filled in for admin-added languages
//   v9 - gallery.photo ("photo {{n}}") for per-photo alt texts
//   v10 - "ODA Interiors" SEO titles, new home intro, price page details,
//         project briefs, one spelling of the team's names
//   v11 - price page back to tariffs only (its added sections removed)
//   v12 - admin: users' emails (list + editing), "My account" tab
const CACHE_VERSION = "v12";

i18n
  .use(ChainedBackend)
  .use(initReactI18next) // Makes i18n work with React
  .init({
    fallbackLng: "en",
    // The URL decides the language (/uk/about is Ukrainian), so a page loads
    // straight in its own language; LanguageSync in App.js follows later
    // navigation.
    lng: typeof window !== "undefined" ? dbLangFromPath(window.location.pathname) : "en",
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 24 * 60 * 60 * 1000, // 24h
          defaultVersion: CACHE_VERSION,
        },
        {
          loadPath: (lngs) => `${API_URL}/languages/${lngs[0]}/translations`,
        },
      ],
    },
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;
