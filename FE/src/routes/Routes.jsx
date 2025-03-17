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
import DevelopmentMilestones from "../pages/DevelopmentMilestones";
import Consultation from "../pages/MemberPages/Consultaion";
import DoctorConsultation from "../pages/DoctorPages/DoctorConsultation";

import Dashboard from "../pages/AdminPages/Dashboard";
import RequestManagement from "../pages/AdminPages/RequestManagement";
import UserManagement from "../pages/AdminPages/UserManagement";
import AddPremium from "../pages/AdminPages/PremiumManagement/AddPremium";
import UpdatePremium from "../pages/AdminPages/PremiumManagement/UpdatePremium";
import PremiumList from "../pages/AdminPages/PremiumManagement/PremiumList";
import GrowthTracker from "../pages/MemberPages/GrowthTracker";
import GrowthChartMember from "../pages/MemberPages/GrowthChartMember";
import BlogDetailed from "../pages/BlogDetailed";
import PrivateRoute from "./PrivateRoute";
import { Role } from "../enums/Role";
import VerificationSent from "../pages/VerificationSent";
import PublicRoute from "./PublicRoute";
import PaymentDetails from "../pages/PaymentDetails";
import DoctorConsultationHistory from "../pages/DoctorPages/DoctorConsultationHistory";

export default function AppRoute() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={routes.home} element={<Home />} />
      <Route
        path={routes.login}
        element={<PublicRoute element={<Login />} />}
      />
      <Route
        path={routes.register}
        element={<PublicRoute element={<Register />} />}
      />
      <Route path={routes.aboutUs} element={<About />} />
      <Route path={routes.faqs} element={<FAQs />} />
      <Route
        path={routes.developmentMilestones}
        element={<DevelopmentMilestones />}
      />
      <Route path={routes.blogs} element={<Blogs />} />
      <Route path={routes.membership} element={<Membership />} />
      <Route path={routes.paymentDetails} element={<PaymentDetails />} />
      <Route path={routes.growthChart} element={<GrowthChart />} />
      <Route path={routes.blogDetail} element={<BlogDetailed />} />
      {/* Membership pages */}
      <Route path={routes.growthTracker} element={<GrowthTracker />} />
      <Route
        path={routes.growthChartMember}
        element={<GrowthChartMember />}
      />{" "}
      <Route path={routes.verificationSent} element={<VerificationSent />} />
      <Route path={routes.consultation} element={<Consultation />} />
      {/* Doctor Routes */}
      <Route path={routes.doctorConsultaion} element={<DoctorConsultation />} />
      <Route
        path={routes.doctorConsultaionHistory}
        element={<DoctorConsultationHistory />}
      />
      {/* Admin Routes */}
      <Route
        path={routes.dashboard}
        element={<PrivateRoute element={<Dashboard />} />}
      />
      <Route
        path={routes.requestManagement}
        element={<PrivateRoute element={<RequestManagement />} />}
      />
      <Route
        path={routes.userManagement}
        element={<PrivateRoute element={<UserManagement />} />}
      />
      <Route
        path={routes.addPremium}
        element={
          <PrivateRoute requiredRole={Role.ADMIN} element={<AddPremium />} />
        }
      />
      <Route
        path={routes.updatePremium}
        element={<PrivateRoute element={<UpdatePremium />} />}
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
