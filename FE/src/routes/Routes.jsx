import React from "react";
import { routes } from ".";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import FAQs from "../pages/FAQs";
import Blogs from "../pages/Blogs";
import Membership from "../pages/Membership";

import Dashboard from "../pages/AdminPages/Dashboard";
import RequestManagement from "../pages/AdminPages/RequestManagement";
import UserManagement from "../pages/AdminPages/UserManagement";
import AddPremium from "../pages/AdminPages/PremiumManagement/AddPremium";
import UpdatePremium from "../pages/AdminPages/PremiumManagement/UpdatePremium";
import PremiumList from "../pages/AdminPages/PremiumManagement/PremiumList";


export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.aboutUs} element={<About />} />
        <Route path={routes.faqs} element={<FAQs />} />
        <Route path={routes.blogs} element={<Blogs />} />
        <Route path={routes.membership} element={<Membership />} />


        {/* Admin pages */}
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.requestManagement} element={<RequestManagement />} />
        <Route path={routes.userManagement} element={<UserManagement />} />
        <Route path={routes.addPremium} element={<AddPremium />} />
        <Route path={routes.updatePremium} element={<UpdatePremium />} />
        <Route path={routes.premiumList} element={<PremiumList />} />
      </Routes>
    </>
  );
}
