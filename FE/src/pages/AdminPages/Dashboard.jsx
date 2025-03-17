import { CrownOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Typography,
  Select,
  InputNumber,
} from "antd";
import message from "antd/es/message";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalPremiumUsers: 0,
    totalConsultations: 0,
  });
  const [revenueData, setRevenueData] = useState([]);

  const [revenueParams, setRevenueParams] = useState({
    time: "DAY",
    unit: "VND",
    value: undefined,
  });

  const [currentUnit, setCurrentUnit] = useState("VND");

  const formatCurrency = (value) => {
    if (currentUnit === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value);
    }
  };

  const formatXAxis = (value) => {
    switch (revenueParams.time) {
      case "DAY":
        return moment(value).format("DD/MM/YYYY");
      case "WEEK":
        return moment(value).format("DD/MM");
      case "MONTH":
        return moment(value).format("DD/MM");
      case "YEAR":
        return moment(value).format("MM/YYYY");
      default:
        return value;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{`Date: ${formatXAxis(label)}`}</p>
          <p style={{ margin: 0, color: "#0082C8" }}>
            {`Revenue: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [
        usersResponse,
        requestsResponse,
        premiumResponse,
        consultationsResponse,
      ] = await Promise.all([
        api.get("/users", { params: { page: 1, size: 1000 } }),
        api.get("/requests", { params: { page: 1, size: 1 } }),
        api.get("/membership-packages", { params: { page: 1, size: 1000 } }),
        api.get("/consultations"),
      ]);

      const activePremiumPackages = premiumResponse.data.packages
        ? premiumResponse.data.packages.filter((pkg) => !pkg.isDeleted).length
        : 0;

      setStats({
        totalUsers: usersResponse.data.users ? usersResponse.data.users.length : 0,
        totalRequests: requestsResponse.data.total || 0,
        totalPremiumUsers: activePremiumPackages,
        totalConsultations: consultationsResponse.data.totalConsultation || 0,
      });

      const revenueResponse = await api.get("/statistics/revenue", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("access_token") || "{}")?.token ||
            ""
          }`,
        },
        params: {
          time: revenueParams.time,
          unit: revenueParams.unit,
          ...(revenueParams.value && { value: revenueParams.value }),
        },
      });

      if (revenueResponse.data?.Revenue) {
        setRevenueData(revenueResponse.data.Revenue);
        setCurrentUnit(revenueResponse.data.Unit);
      } else {
        message.error("No revenue data found");
        setRevenueData([]);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      message.error("Failed to load dashboard statistics");
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (value) => {
    setRevenueParams((prev) => ({
      ...prev,
      time: value,
      value: undefined,
    }));
  };

  const handleUnitChange = (value) => {
    setRevenueParams((prev) => ({ ...prev, unit: value }));
  };

  const handleValueChange = (value) => {
    setRevenueParams((prev) => ({ ...prev, value: value }));
  };

  const getValueValidation = () => {
    switch (revenueParams.time) {
      case "MONTH":
        return { min: 1, max: 12 };
      case "YEAR":
        return { min: 2020, max: moment().year() };
      default:
        return undefined;
    }
  };

  useEffect(() => {
    document.title = "Admin - Dashboard";
    fetchAllStats();
  }, [revenueParams]);

  const cardStyle = {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    border: "none",
  };

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0082C8", marginBottom: "24px" }}>
        Dashboard
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={6}>
              <Card style={cardStyle}>
                <Statistic
                  title={<span style={{ color: "#0082C8" }}>Total Users</span>}
                  value={stats.totalUsers}
                  prefix={<UserOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0082C8" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={cardStyle}>
                <Statistic
                  title={
                    <span style={{ color: "#0082C8" }}>Total Requests</span>
                  }
                  value={stats.totalRequests}
                  prefix={<FileOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0082C8" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={cardStyle}>
                <Statistic
                  title={
                    <span style={{ color: "#0082C8" }}>
                      Total Consultations
                    </span>
                  }
                  value={stats.totalConsultations}
                  prefix={<FileOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0082C8" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={cardStyle}>
                <Statistic
                  title={
                    <span style={{ color: "#0082C8" }}>
                      Total Active Premium Packages
                    </span>
                  }
                  value={stats.totalPremiumUsers}
                  prefix={<CrownOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0082C8" }}
                />
              </Card>
            </Col>
          </Row>
          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={4} style={{ color: "#0082C8", margin: 0 }}>
                Revenue by{" "}
                {revenueParams.time === "DAY"
                  ? "Day"
                  : revenueParams.time === "WEEK"
                  ? "Week"
                  : revenueParams.time === "MONTH"
                  ? "Month"
                  : "Year"}
              </Title>
              <div style={{ display: "flex", gap: "16px" }}>
                <Select
                  value={revenueParams.time}
                  onChange={handleTimeChange}
                  style={{ width: 120 }}
                >
                  <Option value="DAY">Day</Option>
                  <Option value="WEEK">Week</Option>
                  <Option value="MONTH">Month</Option>
                  <Option value="YEAR">Year</Option>
                </Select>
                <Select
                  value={revenueParams.unit}
                  onChange={handleUnitChange}
                  style={{ width: 120 }}
                >
                  <Option value="VND">VND</Option>
                  <Option value="USD">USD</Option>
                </Select>
                {["MONTH", "YEAR"].includes(revenueParams.time) && (
                  <InputNumber
                    placeholder={
                      revenueParams.time === "MONTH" ? "Month (1-12)" : "Year"
                    }
                    value={revenueParams.value}
                    onChange={handleValueChange}
                    style={{ width: 150 }}
                    min={getValueValidation()?.min}
                    max={getValueValidation()?.max}
                  />
                )}
              </div>
            </div>
            <Card style={{ ...cardStyle, height: "400px", padding: "20px" }}>
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="Date"
                      tickFormatter={formatXAxis}
                      height={60}
                      tick={{ angle: -45 }}
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      name="Revenue"
                      dataKey="Revenue"
                      stroke="#0082C8"
                      activeDot={{ r: 8 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  No revenue data available
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
