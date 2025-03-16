import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  CrownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { AuthContext } from "../contexts/AuthContext";

const { Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/user-management",
      icon: <UserOutlined />,
      label: "User Management",
    },
    {
      key: "/admin/request-management",
      icon: <FileOutlined />,
      label: "Request Management",
    },
    {
      key: "/admin/premium-list",
      icon: <CrownOutlined />,
      label: "Premium Management",
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick = async (e) => {
    if (e.key === "/logout") {
      await logout();
    } else {
      navigate(e.key);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#e5f1f1",
        margin: "-8px",
        width: "calc(100% + 16px)",
      }}>
      <Header />
      <div
        style={{
          flex: 1,
          display: "flex",
          marginTop: "20px",
          marginBottom: "40px",
          minHeight: "calc(100vh - 300px)",
          gap: "24px",
          padding: "0 24px",
          width: "100%",
          boxSizing: "border-box",
        }}>
        <Sider
          width={250}
          style={{
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            minHeight: "calc(100% - 20px)",
            position: "sticky",
            top: "120px",
            overflowY: "auto",
            marginTop: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
          <div
            style={{
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to right, #0056A1, #0082C8)",
              position: "sticky",
              top: 0,
              zIndex: 1,
              borderRadius: "8px 8px 0 0",
            }}>
            <h1 style={{ color: "white", margin: 0, fontSize: "20px" }}>
              Admin Panel
            </h1>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              borderRight: 0,
              padding: "12px 0",
            }}
          />
        </Sider>
        <div
          style={{
            flex: 1,
            marginTop: "10px",
          }}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              minHeight: "calc(100% - 20px)",
            }}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AdminLayout;
