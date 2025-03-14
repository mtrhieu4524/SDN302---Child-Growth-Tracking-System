import React from "react";
import { routes } from ".";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.aboutUs} element={<About />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
      </Routes>
    </>
  );
}
