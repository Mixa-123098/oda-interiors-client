import React from "react";

// The title is visually hidden by default: on desktop the highlighted nav item
// already says where you are, on mobile the header shows the section name.
// It stays in the markup as the page's <h1> for search engines and screen
// readers. `showTitle` keeps it on screen (admin views have no nav item).
const PagesHeader = ({ title, showTitle = false }) => {
  return (
    <div className={`pages-header${showTitle ? "" : " pages-header--quiet"}`}>
      <h1 className={showTitle ? undefined : "visually-hidden"}>{title}</h1>
    </div>
  );
};

export default PagesHeader;
