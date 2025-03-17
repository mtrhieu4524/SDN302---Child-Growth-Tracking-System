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
  profile: "/profile",

  // Member pages
  childData: "/profile/child-data",
  children: "/profile/children",
  consultation: "/member-consultation",

  // Doctor pages
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
};
