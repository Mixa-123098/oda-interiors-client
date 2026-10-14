import React from "react";
import { Helmet } from "react-helmet-async";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import languagesStore from "../store/languagesStore";
import useLang from "../lib/useLang";
import { DEFAULT_LANG, localizePath, toUrlCode } from "../lib/lang";

const SITE_NAME = "ODA";
const SITE_URL = "https://oda-interiors.com";
// English fallbacks for the seo.default.* translations (used until they load).
const DEFAULT_TITLE = `${SITE_NAME} — Interior Design & Architecture Studio, Ukraine and Worldwide`;
const DEFAULT_DESCRIPTION =
  "ODA is an interior design and architecture studio based in Ukraine and working worldwide. We design apartments, private houses, and public interiors, from concept to finished space.";
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;
const OG_LOCALES = {
  en: "en_US",
  ua: "uk_UA",
  sk: "sk_SK",
  pl: "pl_PL",
  es: "es_ES",
  fr: "fr_FR",
};

// languages: the app codes this page exists in (a project need not be
// translated into every language). Defaults to all of the site's languages.
const Seo = observer(({ title, description, image, languages }) => {
  const { t } = useTranslation();
  const { lang, basePath } = useLang();
  const cleanTitle = title?.trim();
  const cleanDescription = description?.trim();
  const fullTitle = cleanTitle
    ? `${cleanTitle} — ${SITE_NAME}`
    : t("seo.default.title", DEFAULT_TITLE);
  const metaDescription =
    cleanDescription || t("seo.default.description", DEFAULT_DESCRIPTION);
  const ogImage = image || DEFAULT_IMAGE;
  // Each language version is canonical for itself; hreflang links the set.
  const url = SITE_URL + localizePath(basePath, lang);
  const siteCodes = languagesStore.languages.map((l) => l.code);
  const codes = (languages || siteCodes).filter((code) => siteCodes.includes(code));
  const alternates = codes.length > 1 ? codes : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      {alternates.map((code) => (
        <link
          key={code}
          rel="alternate"
          hrefLang={toUrlCode(code)}
          href={SITE_URL + localizePath(basePath, code)}
        />
      ))}
      {alternates.includes(DEFAULT_LANG) && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={SITE_URL + localizePath(basePath, DEFAULT_LANG)}
        />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {OG_LOCALES[lang] && <meta property="og:locale" content={OG_LOCALES[lang]} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
});

export default Seo;
