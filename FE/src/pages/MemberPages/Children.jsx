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
    } else {
      updateChartData();
    }
  }, [childId]);

  const fetchChildData = async () => {
    try {
      const response = await api.get(`/children/${childId}`);
      console.log('Child data:', response.data); // Để debug response
      if (response.data) {
        setChildName(response.data.name || "");
      }
      updateChartData();
    } catch (error) {
      console.error('Error fetching child data:', error);
      message.error('Không thể tải thông tin của trẻ');
    } finally {
      setLoading(false);
    }
  };

  // const updateChartData = () => {
  //   // Sử dụng hardcode data cho biểu đồ
  //   const growthData = [
  //     { date: "2023-01-01", weight: 3.5, height: 50, bmi: 14.0 },
  //     { date: "2023-06-01", weight: 6.0, height: 60, bmi: 16.67 },
  //     { date: "2024-01-01", weight: 9.0, height: 70, bmi: 18.37 },
  //     { date: "2024-06-01", weight: 11.0, height: 80, bmi: 17.19 },
  //     { date: "2025-01-01", weight: 13.0, height: 90, bmi: 16.05 },
  //   ],
  // },
  // {
  //   id: 2, name: "Liam Smith", data: [
  //     { date: "2023-01-01", weight: 4.0, height: 52, bmi: 14.8 },
  //     { date: "2023-06-01", weight: 7.2, height: 62, bmi: 18.76 },
  //     { date: "2024-01-01", weight: 10.5, height: 72, bmi: 20.21 },
  //     { date: "2024-06-01", weight: 12.8, height: 82, bmi: 19.06 },
  //     { date: "2025-01-01", weight: 15.0, height: 92, bmi: 17.72 },
  //   ],
  // },
};

const Children = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(fakeChildren[0].id);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    updateChartData(selectedChild);
  }, [selectedChild]);

  const updateChartData = (childId) => {
    const child = fakeChildren.find((c) => c.id === childId);
    if (!child) return;

    const formattedData = {
      labels: growthData.map((item) => item.date),
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
          label: "BMI",
          data: growthData.map((item) => item.bmi),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
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
                  onClick={() => navigate("/profile/child-data")}
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

export default Children;
