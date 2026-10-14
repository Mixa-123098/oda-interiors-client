import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import './i18n';
// import * as bootstrap from 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
// Self-hosted fonts, same families and weights as before. They used to come
// from Google Fonts: a render-blocking stylesheet plus two third-party hosts
// to connect to before any text could show. (No ".css" in the paths: CRA's
// webpack 5.79 resolver turns the package's "./*" export into "400.css.css".)
import "@fontsource/inter/400";
import "@fontsource/inter/500";
import "@fontsource/inter/600";
import "@fontsource/playfair-display/500";
import "@fontsource/playfair-display/600";
import "@fontsource/playfair-display/700";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
