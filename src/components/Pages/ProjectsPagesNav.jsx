import React from "react";
import "./ProjectsPage.css";

const ProjectsPagesNav = ({ setFocusedPage, totalPages, currentPage }) => {
  const pageNumbers = [...Array(totalPages).keys()].map((page) => page + 1);
  if (totalPages <= 1) return null;

  return (
    <nav
      className="container d-flex justify-content-center projects-pages-nav"
      aria-label="Pagination"
    >
      {pageNumbers.map((page) => (
        // Was a <span onClick>: not reachable by keyboard and announced as
        // plain text rather than a control.
        <button
          key={page}
          type="button"
          onClick={() => setFocusedPage(page)}
          className={page === currentPage ? "active-page" : ""}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {String(page).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
};

export default ProjectsPagesNav;
