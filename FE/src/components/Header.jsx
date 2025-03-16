import { Layout, Menu, Button, Input, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const { Header } = Layout;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: <a href="/profile">Profile</a>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "tracking",
      label: "Growth Tracking",
      children: [
        {
          key: "growth-chart",
          label: <a href="/growth-chart">Growth Chart</a>,
        },
      ],
    },
    {
      key: "health",
      label: "Health & Nutrition",
      children: [
        {
          key: "milestones",
          label: <a href="#">Development Milestones</a>,
        },
        { key: "alerts", label: <a href="#">Health Alerts</a> },
      ],
    },
    {
      key: "services",
      label: "Services",
      children: [
        {
          key: "consultation",
          label: <a href="#">Doctor Consultation</a>,
        },
        { key: "membership", label: <a href="/membership">Membership Plan</a> },
      ],
    },
    {
      key: "blogs&faqs",
      label: "Blog & FAQ",
      children: [
        { key: "blogs", label: <a href="/blogs">Blogs</a> },
        { key: "faqs", label: <a href="/faqs">FAQs</a> },
      ],
    },
    { key: "about-us", label: <a href="/about-us">About Us</a> },
  ];

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
                marginLeft: "10px",
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
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <a
                style={{
                  color: "#1890ff",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}>
                <UserOutlined style={{ marginRight: 8 }} />
                {user.name} {/* Directly use user.name */}
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
