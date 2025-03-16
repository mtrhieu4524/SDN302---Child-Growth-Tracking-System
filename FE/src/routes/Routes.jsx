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
import GrowthChart from "../pages/GrowthChart";

import Dashboard from "../pages/AdminPages/Dashboard";
import RequestManagement from "../pages/AdminPages/RequestManagement";
import UserManagement from "../pages/AdminPages/UserManagement";
import AddPremium from "../pages/AdminPages/PremiumManagement/AddPremium";
import UpdatePremium from "../pages/AdminPages/PremiumManagement/UpdatePremium";
import PremiumList from "../pages/AdminPages/PremiumManagement/PremiumList";

import PrivateRoute from "./PrivateRoute";
import { Role } from "../enums/Role";
import VerificationSent from "../pages/VerificationSent";
import PublicRoute from "./PublicRoute";

export default function AppRoute() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.login} element={
        <PublicRoute element={<Login />} />
      } />
      <Route path={routes.register} element={
        <PublicRoute element={<Register />} />
      } />
      <Route path={routes.aboutUs} element={<About />} />
      <Route path={routes.faqs} element={<FAQs />} />
      <Route path={routes.blogs} element={<Blogs />} />
      <Route path={routes.membership} element={<Membership />} />
      <Route path={routes.growthChart} element={<GrowthChart />} />
      <Route path={routes.verificationSent} element={<VerificationSent />} />

      {/* Admin Routes */}
      <Route
        path={routes.dashboard}
        element={
          <PrivateRoute element={<Dashboard />} />
        }
      />
      <Route
        path={routes.requestManagement}
        element={
          <PrivateRoute
            element={<RequestManagement />}
          />
        }
      />
      <Route
        path={routes.userManagement}
        element={
          <PrivateRoute
            element={<UserManagement />}
          />
        }
      />
      <Route
        path={routes.addPremium}
        element={
          <PrivateRoute requiredRole={Role.ADMIN} element={<AddPremium />} />
        }
      />
      <Route
        path={routes.updatePremium}
        element={
          <PrivateRoute
            element={<UpdatePremium />}
          />
        }
      />
      <Route
        path={routes.premiumList}
        element={
          <PrivateRoute requiredRole={Role.ADMIN} element={<PremiumList />} />
        }
      />
    </Routes>
  );
}