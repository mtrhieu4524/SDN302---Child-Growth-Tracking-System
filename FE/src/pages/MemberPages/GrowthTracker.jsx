import { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  message,
  Card,
  Layout,
  Typography,
} from "antd";
import { UserOutlined, LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

const GrowthTracker = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState([
    { date: "2023-01-01", weight: 3.5, height: 50, bmi: "14.00" },
    { date: "2023-06-01", weight: 6.0, height: 60, bmi: "16.67" },
    { date: "2024-01-01", weight: 9.0, height: 70, bmi: "18.37" },
  ]);

  const onFinish = (values) => {
    const newMeasurement = {
      date: values.date.format("YYYY-MM-DD"),
      weight: values.weight,
      height: values.height,
      bmi: (
        values.weight /
        ((values.height / 100) * (values.height / 100))
      ).toFixed(2),
    };

    setMeasurements([...measurements, newMeasurement]);
    message.success("Measurement saved successfully!");
    form.resetFields();
  };



  const contentStyle = {
    minHeight: "calc(100vh - 128px)",
    padding: "80px 20px 80px 20px",
    background: "#f0f2f5",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  useEffect(() => {
    document.title = "Child Growth Tracking - Child Growth Tracker";
  }, []);


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <Content style={contentStyle}>
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                  Child Growth Tracker
                </Title>
                <Text type="secondary">Record your child's growth measurements</Text>
              </div>
              <Button type="primary" style={{ backgroundColor: "#0082c8", borderColor: "#0082c8" }}
                onClick={() => navigate("/profile/growth-chart")}>
                Child Growth Chart
              </Button>
            </div>
          }
          style={{
            maxWidth: 600,
            margin: "0 auto",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          headStyle={{ background: "#fafafa", borderBottom: "none" }}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ date: moment() }}>
            <Form.Item
              name="date"
              label="Measurement Date"
              rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker
                style={{
                  width: "100%",
                  borderRadius: 4,
                  padding: "8px 11px",
                }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Weight (kg)"
              rules={[{ required: true, message: "Please enter weight" }]}>
              <InputNumber
                min={0}
                step={0.1}
                style={{
                  width: "100%",
                  borderRadius: 4,
                  padding: "4px 11px",
                }}
                size="large"
                placeholder="Enter weight in kg"
              />
            </Form.Item>

            <Form.Item
              name="height"
              label="Height (cm)"
              rules={[{ required: true, message: "Please enter height" }]}>
              <InputNumber
                min={0}
                step={0.1}
                style={{
                  width: "100%",
                  borderRadius: 4,
                  padding: "4px 11px",
                }}
                size="large"
                placeholder="Enter height in cm"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: "100%",
                  borderRadius: 4,
                  background: "linear-gradient(to right, #0082C8, #0056A1)",
                  border: "none",
                  height: 40,
                }}>
                Save Measurement
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <FooterComponent />
      <ScrollToTop />
    </Layout>
  );
};

export default GrowthTracker;
