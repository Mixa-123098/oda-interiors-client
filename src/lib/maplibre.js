// The CSP build + a separately served worker: CRA's babel pass corrupts the
// inlined worker of the regular build in production. The worker file in
// public/ is a copy of node_modules/maplibre-gl/dist/maplibre-gl-csp-worker.js
// - refresh it if maplibre-gl is upgraded.
import maplibregl from "maplibre-gl/dist/maplibre-gl-csp";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(`${process.env.PUBLIC_URL || ""}/maplibre-gl-csp-worker.js`);

// OpenFreeMap: free vector tiles, no API key. Monochrome styles that suit the
// black/white site (a coloured street map would fight the palette).
export const MAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
};

export default maplibregl;
