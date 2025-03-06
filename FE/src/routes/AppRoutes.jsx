import React from "react";
import { routes } from ".";
import Home from "../pages/Home";
import { Route, Routes } from "react-router-dom";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path={routes.home} element={<Home />} />
      </Routes>
    </>
  );
}
