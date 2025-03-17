import { useState, useEffect } from "react";
import { Card, Button, Typography } from "antd";
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
import { useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { RightOutlined } from "@ant-design/icons";
import api from "../../configs/api";
import { message } from "antd";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;

const GrowthChartMember = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Growth Chart";
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  // Fetch child data and growth data
  const fetchChildData = async () => {
    try {
      // Fetch child details
      const childResponse = await api.get(`/children/${childId}`);
      if (childResponse.data) {
        setChildName(childResponse.data.name || "");
      }

      // Fetch growth data
      const growthResponse = await api.get(`/children/${childId}/growth-data`);
      if (growthResponse.data && growthResponse.data.growthData) {
        updateChartData(growthResponse.data.growthData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load growth data');
    } finally {
      setLoading(false);
    }
  };

  // Update chart data with fetched growth data
  const updateChartData = (growthData) => {
    const formattedData = {
      labels: growthData.map((item) => moment(item.inputDate).format('DD/MM/YYYY')), // Format dates
      datasets: [
        {
          label: "Weight (kg)",
          data: growthData.map((item) => item.weight),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: "Height (cm)",
          data: growthData.map((item) => item.height),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: "Head Circumference (cm)",
          data: growthData.map((item) => item.headCircumference || null), // Handle null values
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
        {
          label: "Arm Circumference (cm)",
          data: growthData.map((item) => item.armCircumference || null), // Handle null values
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };

    setChartData(formattedData);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 }, padding: 20 },
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
        title: { display: true, text: "Date", font: { size: 14 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        title: { display: true, text: "Measurements", font: { size: 14 } },
      },
    },
    maintainAspectRatio: false,
  };

  const contentStyle = {
    minHeight: "calc(100vh - 128px)",
    padding: "80px 20px 80px 20px",
    background: "#f0f2f5",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeaderComponent />

      <div style={contentStyle}>
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                  {childName ? `${childName}'s Growth Chart` : 'Growth Chart'}
                </Title>
                <Text type="secondary">Track your child's development over time</Text>
              </div>
              <div>
                <Button
                  type="primary"
                  onClick={() => navigate(`/profile/growth-tracker/${childId}`)}
                  style={{ backgroundColor: "#0082c8", borderColor: "#0082c8" }}
                >
                  Import Data <RightOutlined />
                </Button>
              </div>
            </div>
          }
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          headStyle={{ background: "#fafafa", borderBottom: "none" }}
        >
          <div style={{ height: "400px" }}>
            {chartData.labels && <Line options={options} data={chartData} />}
          </div>
        </Card>
      </div>

      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default GrowthChartMember;