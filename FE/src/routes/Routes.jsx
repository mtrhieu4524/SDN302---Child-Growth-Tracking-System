import React from "react";
import { routes } from ".";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import FAQs from "../pages/FAQs";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.aboutUs} element={<About />} />
        <Route path={routes.faqs} element={<FAQs />} />
      </Routes>
    </>
  );
}
