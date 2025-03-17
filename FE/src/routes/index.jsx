export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  aboutUs: "/about-us",
  faqs: "/faqs",
  blogs: "/blogs",
  membership: "/membership",
  paymentDetails: "/payment-details/:id",
  growthChart: "/growth-chart",
  developmentMilestones: "/development-milestones",
  verificationSent: "/verification-sent",
  blogDetail: "/blogs/:id",

  // Membership pages
  childList: "/profile/children",
  growthTracker: "/profile/growth-tracker/:childId",
  growthTrackerBase: "/profile/growth-tracker",
  growthChartMember: "/profile/growth-chart/:childId",
  consultation: "/member-consultation",
  consultationHistory: "/member-consultation-history",
  consultationChat: "/member-consultation-history/chat/:id",

  //Doctor pages
  doctorConsultation: "/doctor-consultation",
  doctorConsultationHistory: "/doctor-consultation-history",
  doctorConsultationChat: "/doctor-consultation-history/chat/:id",

  // Admin pages
  dashboard: "/admin/dashboard",
  userManagement: "/admin/user-management",
  requestManagement: "/admin/request-management",
  consultationManagement: "/admin/consultation-management",
  premiumList: "/admin/premium-list",
  addPremium: "/admin/add-premium",
  adminMembership: "/admin/membership",
};
