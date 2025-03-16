import { CrownOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Typography } from "antd";
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
} from "recharts";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 150,
    totalRequests: 45,
    totalPremiumUsers: 30,
  });
  const [revenueData, setRevenueData] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/statistics/revenue", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("access_token") || "{}")?.token ||
            ""
          }`,
        },
      });

      console.log("Fetched revenue data:", response.data);

      if (response.data && response.data.Revenue) {
        setRevenueData(
          response.data.Revenue.map((item) => ({
            date: item.Date,
            revenue: item.Revenue,
          }))
        );
      } else {
        message.error("No revenue data found");
        setRevenueData([]);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      message.error("Failed to load revenue data");
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Dashboard";
    fetchStats();
  }, []);

  const cardStyle = {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    border: "none",
  };

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
        Dashboard
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card style={cardStyle}>
                <Statistic
                  title={<span style={{ color: "#0056A1" }}>Total Users</span>}
                  value={stats.totalUsers}
                  prefix={<UserOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0056A1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={cardStyle}>
                <Statistic
                  title={
                    <span style={{ color: "#0056A1" }}>Totle Requests</span>
                  }
                  value={stats.totalRequests}
                  prefix={<FileOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0056A1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={cardStyle}>
                <Statistic
                  title={
                    <span style={{ color: "#0056A1" }}>
                      Total Used Premium Pack
                    </span>
                  }
                  value={stats.totalPremiumUsers}
                  prefix={<CrownOutlined style={{ color: "#0082C8" }} />}
                  valueStyle={{ color: "#0056A1" }}
                />
              </Card>
            </Col>
          </Row>
          <div style={{ marginTop: "24px" }}>
            <Title level={4} style={{ color: "#0056A1" }}>
              Doanh thu theo ngày
            </Title>
            <Card style={{ ...cardStyle, height: "400px" }}>
              <LineChart
                width={800}
                height={300}
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0082C8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
