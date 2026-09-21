import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "ODA";
const SITE_URL = "https://oda-interiors.com";
const DEFAULT_TITLE = `${SITE_NAME} — Interior Design & Architecture Studio, Ukraine and Worldwide`;
const DEFAULT_DESCRIPTION =
  "ODA is an interior design and architecture studio based in Ukraine and working worldwide. We design apartments, private houses, and public interiors, from concept to finished space.";
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

const Seo = ({ title, description, image }) => {
  const cleanTitle = title?.trim();
  const cleanDescription = description?.trim();
  const fullTitle = cleanTitle ? `${cleanTitle} — ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDescription = cleanDescription || DEFAULT_DESCRIPTION;
  const ogImage = image || DEFAULT_IMAGE;
  const url =
    typeof window !== "undefined"
      ? SITE_URL + window.location.pathname
      : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
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
};

export default Seo;
