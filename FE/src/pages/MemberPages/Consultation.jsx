import { useState, useEffect } from "react";
import { Layout, Card, Form, Select, Input, Button, Typography, message, Row, Col } from "antd";
import { Line } from "react-chartjs-2";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Consultation = () => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const childrenData = [
        { id: 1, name: "John Doe", weight: 13, height: 90, bmi: 16.05 },
        { id: 2, name: "Jane Doe", weight: 12, height: 85, bmi: 16.60 },
    ];

    const doctors = [
        { id: 1, name: "Dr. Smith - Pediatrics" },
        { id: 2, name: "Dr. Johnson - Nutritionist" },
    ];

    const sampleChartData = {
        labels: ["2023-01", "2023-06", "2024-01", "2024-06", "2025-01"],
        datasets: [
            {
                label: "Weight (kg)",
                data: [3.5, 6, 9, 11, 13],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4,
            },
        ],
    };

    const handleSubmit = () => {
        if (!selectedChild || !selectedDoctor || !messageText.trim()) {
            message.error("Please complete all fields before submitting.");
            return;
        }
        message.success("Consultation request submitted successfully!");
        setMessageText("");
    };

    useEffect(() => {
        document.title = "Child Growth Tracking - Doctor Consultation";
    }, []);
    return (
        <div style={{ minHeight: "100vh" }}>
            <HeaderComponent />
            <div style={{ padding: "80px 20px", background: "#f0f2f5" }}>
                <Card
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div>
                                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                                    Request Consultation
                                </Title>
                                <Text type="secondary"> Get expert advice on your child's health and growth from trusted professionals.
                                </Text>
                            </div>
                        </div>
                    }
                    style={{ maxWidth: 800, margin: "0 auto", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    headStyle={{ background: "#fafafa", borderBottom: "none" }}
                >
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Select Child">
                                    <Select
                                        placeholder="Choose a child"
                                        onChange={(value) => setSelectedChild(childrenData.find(child => child.id === value))}
                                    >
                                        {childrenData.map((child) => (
                                            <Select.Option key={child.id} value={child.id}>
                                                {child.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Select Doctor">
                                    <Select
                                        placeholder="Choose a doctor"
                                        onChange={(value) => setSelectedDoctor(doctors.find(doctor => doctor.id === value))}
                                    >
                                        {doctors.map((doctor) => (
                                            <Select.Option key={doctor.id} value={doctor.id}>
                                                {doctor.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {selectedChild && (
                            <Card style={{ marginBottom: 20 }}>
                                <Text strong>Latest Health Data</Text>
                                <p>Weight: {selectedChild.weight} kg</p>
                                <p>Height: {selectedChild.height} cm</p>
                                <p>BMI: {selectedChild.bmi}</p>
                            </Card>
                        )}

                        <Form.Item label="Growth Chart Preview">
                            <div style={{ height: "200px" }}>
                                <Line data={sampleChartData} />
                            </div>
                        </Form.Item>

                        <Form.Item label="Message to Doctor">
                            <TextArea
                                rows={4}
                                placeholder="Describe your concerns..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
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
                                Submit Consultation Request
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <FooterComponent />
            <ScrollToTop />
        </div>
    );
};

export default Consultation;
