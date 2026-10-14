import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_LANG, localizePath, splitLang, toDbCode } from "./lang";

// The language of the current page plus `lp`, which turns an app path into
// the same path in that language: lp("/projects") -> "/uk/projects".
export default function useLang() {
  const { pathname } = useLocation();
  const { urlLang, rest } = splitLang(pathname);
  const lang = urlLang ? toDbCode(urlLang) : DEFAULT_LANG;
  const lp = useCallback((to) => localizePath(to, lang), [lang]);
  return { lang, basePath: rest, lp };
}
