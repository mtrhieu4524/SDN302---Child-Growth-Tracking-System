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
import Consultation from "../pages/MemberPages/Consultation";
import DoctorConsultation from "../pages/DoctorPages/DoctorConsultation";
import Dashboard from "../pages/AdminPages/Dashboard";
import RequestManagement from "../pages/AdminPages/RequestManagement";
import UserManagement from "../pages/AdminPages/UserManagement";
import AddPremium from "../pages/AdminPages/PremiumManagement/AddPremium";
import PremiumList from "../pages/AdminPages/PremiumManagement/PremiumList";
import Children from "../pages/MemberPages/Children";
import ChildData from "../pages/MemberPages/ChildData";
import BlogDetailed from "../pages/BlogDetailed";
import PrivateRoute from "./PrivateRoute";
import { Role } from "../enums/Role";
import VerificationSent from "../pages/VerificationSent";
import PublicRoute from "./PublicRoute";
import PaymentDetails from "../pages/PaymentDetails";
import ConsultationManagement from "../pages/AdminPages/ConsultationManagement";
import DoctorConsultationHistory from "../pages/DoctorPages/DoctorConsultationHistory";
import DoctorConsultationChat from "../pages/DoctorPages/DoctorConsultationChat";
import Profile from "../pages/Profile";

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
      <Route path={routes.verificationSent} element={<VerificationSent />} />

      
      {/* Authenticated Routes */}
      <Route
        path="/profile"
        element={<PrivateRoute element={<Profile />} />}
      />

      {/* Member Routes */}
      <Route
        path={routes.childData}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<ChildData />} />}
      />
      <Route
        path={routes.children}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<Children />} />}
      />
      <Route
        path={routes.consultation}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<Consultation />} />}
      />

      {/* Doctor Routes */}
      <Route
        path={routes.doctorConsultation}
        element={<PrivateRoute requiredRole={Role.DOCTOR} element={<DoctorConsultation />} />}
      />
      <Route
        path={routes.doctorConsultationHistory}
        element={<PrivateRoute requiredRole={Role.DOCTOR} element={<DoctorConsultationHistory />} />}
      />
      <Route
        path={routes.doctorConsultationChat}
        element={<PrivateRoute requiredRole={Role.DOCTOR} element={<DoctorConsultationChat />} />}
      />

      {/* Admin Routes */}
      <Route
        path={routes.dashboard}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<Dashboard />} />}
      />
      <Route
        path={routes.requestManagement}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<RequestManagement />} />}
      />
      <Route
        path={routes.consultationManagement}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<ConsultationManagement />} />}
      />
      <Route
        path={routes.userManagement}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<UserManagement />} />}
      />
      <Route
        path={routes.addPremium}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<AddPremium />} />}
      />
      <Route
        path={routes.premiumList}
        element={<PrivateRoute requiredRole={Role.ADMIN} element={<PremiumList />} />}
      />
    </Routes>
  );
}