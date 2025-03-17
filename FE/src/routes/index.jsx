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
  growthTracker: "/profile/growth-tracker",
  growthChartMember: "/profile/growth-chart/:childId",
  consultation: "/member-consultation",

  //Doctor pages
  doctorConsultaion: "/doctor-consultation",
  doctorConsultaionHistory: "/doctor-consultation-history",

  // Admin pages
  dashboard: "/admin/dashboard",
  userManagement: "/admin/user-management",
  requestManagement: "/admin/request-management",
  premiumList: "/admin/premium-list",
  addPremium: "/admin/add-premium",
  updatePremium: "/admin/update-premium",
};
