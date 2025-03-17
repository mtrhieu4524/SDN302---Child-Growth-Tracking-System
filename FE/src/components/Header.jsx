import { Layout, Menu, Button, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SolutionOutlined,
  HeartOutlined,
  HistoryOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const ROLE_MAP = {
  0: "member",
  1: "admin",
  2: "doctor",
};

const HeaderComponent = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const role = ROLE_MAP[user?.role] || "member";

  const adminDropdownMenuItems = [
    {
      key: "dashboard",
      label: <a href="/admin/dashboard">Dashboard</a>,
      icon: <DashboardOutlined />,
    },
    {
      key: "logout",
      label: "Sign Out",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const adminMenuItems = [
    {
      key: "health",
      label: "Health & Nutrition",
      children: [
        {
          key: "growth-chart",
          label: <a href="/growth-chart">Growth Chart</a>,
        },
        {
          key: "milestones",
          label: <a href="/development-milestones">Development Milestones</a>,
        },
      ],
    },
    { key: "blogs", label: <a href="/blogs">Blogs</a> },
    { key: "membership", label: <a href="/membership">Membership</a> },
    { key: "faqs", label: <a href="/faqs">FAQs</a> },
    { key: "about-us", label: <a href="/about-us">About Us</a> },
  ];

  const doctorDropdownMenuItems = [
    {
      key: "profile",
      label: <a href="/profile">Profile</a>,
      icon: <UserOutlined />,
    },
    {
      key: "doctor-consultation",
      label: <a href="/doctor-consultation">Consultation Request</a>,
      icon: <HeartOutlined />,
    },
    {
      key: "doctor-consultation-history",
      label: <a href="/doctor-consultation-history">Consultation History</a>,
      icon: <HistoryOutlined />,
    },
    {
      key: "logout",
      label: "Sign Out",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const doctorMenuItems = [
    {
      key: "health",
      label: "Health & Nutrition",
      children: [
        {
          key: "growth-chart",
          label: <a href="/growth-chart">Growth Chart</a>,
        },
        {
          key: "milestones",
          label: <a href="/development-milestones">Development Milestones</a>,
        },
      ],
    },
    { key: "blogs", label: <a href="/blogs">Blogs</a> },
    { key: "faqs", label: <a href="/faqs">FAQs</a> },
    { key: "about-us", label: <a href="/about-us">About Us</a> },
  ];

  const memberDropdownMenuItems = [
    // {
    //   key: "profile",
    //   label: <a href="/profile">Profile</a>,
    //   icon: <UserOutlined />,
    // },
    {
      key: "child-tracker",
      label: <a href="/profile/growth-chart">Child Tracker</a>,
      icon: <SolutionOutlined />,
    },
    {
      key: "member-consultation",
      label: <a href="/member-consultation">Doctor Consultation</a>,
      icon: <HeartOutlined />,
    },
    {
      key: "member-consultation-history",
      label: <a href="/member-consultation-history">Consultation History</a>,
      icon: <HistoryOutlined />,
    },
    {
      key: "logout",
      label: "Sign Out",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const memberMenuItems = [
    {
      key: "health",
      label: "Health & Nutrition",
      children: [
        {
          key: "growth-chart",
          label: <a href="/growth-chart">Growth Chart</a>,
        },
        {
          key: "milestones",
          label: <a href="/development-milestones">Development Milestones</a>,
        },
      ],
    },
    { key: "blogs", label: <a href="/blogs">Blogs</a> },
    { key: "membership", label: <a href="/membership">Membership</a> },
    { key: "faqs", label: <a href="/faqs">FAQs</a> },
    { key: "about-us", label: <a href="/about-us">About Us</a> },
  ];

  const menuItems =
    role === "admin"
      ? adminMenuItems
      : role === "doctor"
      ? doctorMenuItems
      : memberMenuItems;

  const dropdownItems =
    role === "admin"
      ? adminDropdownMenuItems
      : role === "doctor"
      ? doctorDropdownMenuItems
      : memberDropdownMenuItems;

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to right, #0082C8, #0056A1)",
          color: "white",
          textAlign: "center",
          padding: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          zIndex: 51,
          marginLeft: "-8px",
          marginRight: "-8px",
          paddingTop: "10px",
          marginBottom: "5px",
        }}>
        Welcome to Child Growth Tracking
      </div>

      <Header
        style={{
          background: "#fff",
          padding: "0 5px 7px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "101%",
          maxWidth: "100vw",
          boxSizing: "border-box",
          borderBottom: "1px solid #ddd",
          marginLeft: "-8px",
          marginRight: "-8px",
          position: "sticky",
          top: "10px",
          zIndex: 50,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a href="/" title="Logo">
            <h3
              style={{
                marginTop: "25px",
                marginLeft: "30px",
                marginRight: "25px",
              }}>
              CHILD GROWTH TRACKING
            </h3>
          </a>
        </div>

        <div style={{ flex: 1, marginTop: "5px" }}>
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              justifyContent: "center",
              display: "flex",
              borderBottom: "none",
              marginRight: "125px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginRight: "10px",
          }}>
          {user ? (
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
              <a
                style={{
                  color: "#1890ff",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}>
                <UserOutlined
                  style={{ marginRight: "5px", marginTop: "4px", fontSize: 24 }}
                />
                <p style={{ marginRight: "20px", marginTop: "22px" }}>
                  {user.name.charAt(0).toUpperCase() + user.name.slice(1)} (
                  {role.charAt(0).toUpperCase() + role.slice(1)})
                </p>
              </a>
            </Dropdown>
          ) : (
            <>
              <a href="/login" style={{ color: "#1890ff", fontWeight: "500" }}>
                Sign in
              </a>
              <Button
                type="primary"
                href="/register"
                style={{ background: "#0082C8", borderColor: "#0082C8" }}>
                Create account
              </Button>
            </>
          )}
        </div>
      </Header>
    </div>
  );
};

export default HeaderComponent;
