import { useState, useEffect } from "react";
import { Card, Layout, Button, Typography } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { UserOutlined, LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const GrowthChartMember = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const hardcodedData = [
      { date: "2023-01-01", weight: 3.5, height: 50, bmi: 14.0 },
      { date: "2023-06-01", weight: 6.0, height: 60, bmi: 16.67 },
      { date: "2024-01-01", weight: 9.0, height: 70, bmi: 18.37 },
      { date: "2024-06-01", weight: 11.0, height: 80, bmi: 17.19 },
      { date: "2025-01-01", weight: 13.0, height: 90, bmi: 16.05 },
    ];

    const chartDataFormat = {
      labels: hardcodedData.map((item) => item.date),
      datasets: [
        {
          label: "Weight (kg)",
          data: hardcodedData.map((item) => item.weight),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: "Height (cm)",
          data: hardcodedData.map((item) => item.height),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: "BMI",
          data: hardcodedData.map((item) => item.bmi),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };

    setChartData(chartDataFormat);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Date",
          font: { size: 14 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        title: {
          display: true,
          text: "Measurements",
          font: { size: 14 },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const headerStyle = {
    background: "linear-gradient(to right, #0082C8, #0056A1)",
    color: "white",
    padding: "0 20px",
    height: "64px",
    lineHeight: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    zIndex: 1,
    top: 0,
  };

  const footerStyle = {
    background: "#001529",
    color: "white",
    textAlign: "center",
    padding: "20px",
    marginTop: "auto",
  };

  const contentStyle = {
    minHeight: "calc(100vh - 128px)",
    padding: "80px 20px 20px",
    background: "#f0f2f5",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />

      <Content style={contentStyle}>
        <Card
          title={
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                Growth Chart
              </Title>
              <Text type="secondary">
                Track your child's development over time
              </Text>
            </div>
          }
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          headStyle={{ background: "#fafafa", borderBottom: "none" }}>
          <div style={{ height: "400px" }}>
            {chartData.labels && <Line options={options} data={chartData} />}
          </div>
        </Card>
      </Content>

      <Footer style={footerStyle}>
        <Text style={{ color: "rgba(255,255,255,0.65)" }}>
          © 2025 Child Growth Tracking. All rights reserved.
        </Text>
        <div style={{ marginTop: 8 }}>
          <Button type="link" style={{ color: "rgba(255,255,255,0.85)" }}>
            Privacy Policy
          </Button>
          <Button type="link" style={{ color: "rgba(255,255,255,0.85)" }}>
            Terms of Service
          </Button>
          <Button type="link" style={{ color: "rgba(255,255,255,0.85)" }}>
            Contact Us
          </Button>
        </div>
      </Footer>
    </Layout>
  );
};

export default GrowthChartMember;
