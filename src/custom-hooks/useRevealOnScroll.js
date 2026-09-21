import { useEffect } from "react";

// Sections that fade/slide in the first time they scroll into view. Targeting
// by selector here (instead of sprinkling a class through every page) keeps
// the pages' markup untouched; the MutationObserver picks up content that
// renders later (project lists, route changes, language switches).
const SELECTOR = [
  ".price-row",
  ".trust-item",
  ".about-hero-block",
  ".about-section",
  ".values-section",
  ".about-cta",
  ".contacts-panel",
  ".contacts-direct",
  ".our-projects > *",
  ".featured-head",
  ".featured-card",
  ".map-page-body",
  ".site-footer-grid",
  ".site-footer-map",
].join(",");

export default function useRevealOnScroll() {
  useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    // Per-effect set, not a DOM flag: StrictMode runs this effect twice, and
    // a flag left on the elements by the first run would stop the second
    // run's fresh observer from ever watching them.
    const seen = new WeakSet();
    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Stagger siblings that enter together (cards in a row), capped so
        // a long list never waits seconds for its last item.
        const index = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty("--rv-i", String(Math.min(index, 4)));
        el.classList.add("reveal");
        io.observe(el);
      });
    };

    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);
}
