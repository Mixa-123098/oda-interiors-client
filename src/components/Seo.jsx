import React from "react";
import { Helmet } from "react-helmet-async";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import languagesStore from "../store/languagesStore";
import useLang from "../lib/useLang";
import { DEFAULT_LANG, SITE_URL, localizePath, toUrlCode } from "../lib/lang";

// "ODA" alone is taken in search results (ODA Architecture in New York, the
// "Oda" furniture line), so the brand appears as ODA Interiors, like the domain.
const SITE_NAME = "ODA Interiors";
// English fallbacks for the seo.default.* translations (used until they load).
const DEFAULT_TITLE = `${SITE_NAME} — Interior Design & Architecture Studio`;
const DEFAULT_DESCRIPTION =
  "Interior design and architecture for apartments, houses and public spaces, from concept to finished interior. Based in Ukraine, working worldwide.";
// Search results show about this much of a description; a longer one (a
// project's whole brief) is cut at a word boundary instead of mid-word.
const MAX_DESCRIPTION = 160;
const shorten = (text) => {
  if (text.length <= MAX_DESCRIPTION) return text;
  const cut = text.slice(0, MAX_DESCRIPTION - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—-]+$/, "")}…`;
};
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
// path: the page's own address without language prefix, when the URL it was
// reached at may differ (e.g. "/projects/6" for "/projects/6%20").
// title gets " — ODA Interiors" appended; completeTitle is used as is (a
// project's title already names the studio).
function SeoTags({ title, completeTitle, description, image, languages, jsonLd, path }) {
  const { t } = useTranslation();
  const { lang, basePath: urlBasePath } = useLang();
  const basePath = path || urlBasePath;
  const cleanTitle = title?.trim();
  // A placeholder like "." (some project briefs are just that) is no
  // description at all - the site-wide one is better than that.
  const cleanDescription =
    description?.trim().length >= 20 ? description.trim() : undefined;
  const fullTitle =
    completeTitle?.trim() ||
    (cleanTitle ? `${cleanTitle} — ${SITE_NAME}` : t("seo.default.title", DEFAULT_TITLE));
  const metaDescription = shorten(
    cleanDescription || t("seo.default.description", DEFAULT_DESCRIPTION)
  );
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
      {/* Page-level structured data (the site-wide Organization/WebSite
          graph is static in index.html). */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

// observer: re-renders when the language list arrives (hreflang).
const Seo = observer(SeoTags);

export default Seo;
