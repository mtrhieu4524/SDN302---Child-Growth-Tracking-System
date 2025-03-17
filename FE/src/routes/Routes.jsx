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
import GrowthTracker from "../pages/MemberPages/GrowthTracker";
import GrowthChartMember from "../pages/MemberPages/GrowthChartMember";
import BlogDetailed from "../pages/BlogDetailed";
import PrivateRoute from "./PrivateRoute";
import { Role } from "../enums/Role";
import VerificationSent from "../pages/VerificationSent";
import PublicRoute from "./PublicRoute";
import PaymentDetails from "../pages/PaymentDetails";
import ConsultationManagement from "../pages/AdminPages/ConsultationManagement";
import DoctorConsultationHistory from "../pages/DoctorPages/DoctorConsultationHistory";
import ConsultationHistory from "../pages/MemberPages/ConsultationHistory";
import ChildList from "../pages/MemberPages/ChildList";
import { Navigate } from "react-router-dom";
import DoctorConsultationChat from "../pages/DoctorPages/DoctorConsultationChat";
import ConsultationChat from "../pages/MemberPages/ConsultationChat";
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

      {/* Authenticated Routes */}
      <Route
        path="/profile"
        element={<PrivateRoute element={<Profile />} />}
      />

      {/* Member Routes */}
      <Route
        path={routes.childList}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<ChildList />} />}
      />
      <Route
        path={routes.growthTracker}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<GrowthTracker />} />}
      />
      <Route
        path="/profile/growth-chart"
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<Navigate to="/profile/children" replace />} />}
      />
      <Route
        path={routes.growthChartMember}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<GrowthChartMember />} />}
      />
      <Route
        path={routes.consultation}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<Consultation />} />}
      />

      <Route
        path={routes.consultationChat}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<ConsultationChat />} />}
      />

      <Route
        path={routes.consultationHistory}
        element={<PrivateRoute requiredRole={Role.MEMBER} element={<ConsultationHistory />} />}
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

      <Route path={routes.verificationSent} element={<VerificationSent />} />
    </Routes>
  );
}