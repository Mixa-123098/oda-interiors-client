import React, { forwardRef } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import useLang from "../lib/useLang";

// Drop-in replacements for react-router's Link/NavLink that keep the visitor
// in the language they are reading: to="/projects" on a /uk/ page points to
// /uk/projects.
export const Link = forwardRef(({ to, ...rest }, ref) => {
  const { lp } = useLang();
  return <RouterLink ref={ref} to={lp(to)} {...rest} />;
});

export const NavLink = forwardRef(({ to, ...rest }, ref) => {
  const { lp } = useLang();
  return <RouterNavLink ref={ref} to={lp(to)} {...rest} />;
});
