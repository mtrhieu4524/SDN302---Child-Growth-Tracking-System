import { useState, useEffect } from "react";
import { Card, List, Button, Typography, message, Modal, Input } from "antd";
import { Line } from "react-chartjs-2";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

const { Title, Text } = Typography;
const { TextArea } = Input;

const DoctorConsultation = () => {
    const [consultations, setConsultations] = useState([]);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        document.title = "Child Growth Tracker - Consultation Request";
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        const data = [
            {
                id: 1,
                parentName: "Jane Doe",
                child: { name: "John Doe", weight: 13, height: 90, bmi: 16.05 },
                message: "My child has been losing weight. Is this normal?",
                submittedAt: "2025-03-14",
                weightHistory: [3.5, 4, 10, 19, 8],
                heightHistory: [5, 6, 10, 11, 13],
                bmiHistory: [4, 6, 3, 11, 16],
            },
            {
                id: 2,
                parentName: "Robert Smith",
                child: { name: "Emma Smith", weight: 15, height: 95, bmi: 16.6 },
                message: "Emma has been eating less lately. What should I do?",
                submittedAt: "2025-03-13",
                weightHistory: [3.5, 4, 10, 19, 8],
                heightHistory: [5, 6, 10, 11, 13],
                bmiHistory: [4, 6, 3, 11, 16],
            },
        ];
        setConsultations(data);
    };

    const handleReview = (consultation) => {
        setSelectedConsultation(consultation);
        setModalVisible(true);
    };

    const handleSubmitResponse = () => {
        if (!responseText.trim()) {
            message.error("Please enter your response.");
            return;
        }

        setConsultations(consultations.filter(c => c.id !== selectedConsultation.id));

        message.success("Response submitted successfully!");
        setModalVisible(false);
        setResponseText("");
        setSelectedConsultation(null);
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <HeaderComponent />
            <div style={{ padding: "80px 20px", background: "#f0f2f5" }}>
                <Card
                    title={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div>
                                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                                    Consultation Request
                                </Title>
                                <Text type="secondary"> Review and give advice for member child's health.
                                </Text>
                            </div>
                        </div>
                    }
                    style={{ maxWidth: 900, margin: "0 auto", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                    <List
                        itemLayout="vertical"
                        dataSource={consultations}
                        renderItem={(item) => (
                            <Card style={{ marginBottom: 15, borderRadius: 8, paddingBottom: 10 }}>
                                <Text strong>Parent:</Text> {item.parentName} <br />
                                <Text strong>Child:</Text> {item.child.name} <br />
                                <Text strong>Submitted At:</Text> {item.submittedAt} <br />
                                <Text strong>Message:</Text> <Text>{item.message}</Text>

                                <div style={{ height: "200px", marginTop: "15px" }}>
                                    <Line
                                        data={{
                                            labels: ["2023-01", "2023-06", "2024-01", "2024-06", "2025-01"],
                                            datasets: [
                                                {
                                                    label: "Weight (kg)",
                                                    data: item.weightHistory,
                                                    borderColor: "rgb(255, 99, 132)",
                                                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                                                    tension: 0.4,
                                                },
                                                {
                                                    label: "Height (cm)",
                                                    data: item.heightHistory,
                                                    borderColor: "rgb(99, 255, 122)",
                                                    backgroundColor: "rgba(102, 255, 99, 0.2)",
                                                    tension: 0.4,
                                                },
                                                {
                                                    label: "BMI",
                                                    data: item.bmiHistory,
                                                    borderColor: "rgb(255, 180, 99)",
                                                    backgroundColor: "rgba(255, 198, 99, 0.2)",
                                                    tension: 0.4,
                                                },
                                            ],
                                        }}
                                    />
                                </div>

                                {/* Button positioned at the right bottom corner */}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                                    <Button type="primary" onClick={() => handleReview(item)}>
                                        Review & Respond
                                    </Button>
                                </div>
                            </Card>

                        )}
                    />
                </Card>
            </div>
            <FooterComponent />
            <ScrollToTop />

            {/* Modal for Doctor's Response */}
            <Modal
                title="Provide Consultation Response"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitResponse}>
                        Submit Response
                    </Button>,
                ]}
            >
                {selectedConsultation && (
                    <>
                        <Title level={4}>Patient: {selectedConsultation.child.name}</Title>
                        <Text strong>Weight:</Text> {selectedConsultation.child.weight} kg <br />
                        <Text strong>Height:</Text> {selectedConsultation.child.height} cm <br />
                        <Text strong>BMI:</Text> {selectedConsultation.child.bmi} <br />

                        <div style={{ height: "200px", marginTop: "15px" }}>
                            <Line
                                data={{
                                    labels: ["2023-01", "2023-06", "2024-01", "2024-06", "2025-01"],
                                    datasets: [
                                        {
                                            label: "Weight (kg)",
                                            data: selectedConsultation.weightHistory,
                                            borderColor: "rgb(255, 99, 132)",
                                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                                            tension: 0.4,
                                        },
                                        {
                                            label: "Height (cm)",
                                            data: selectedConsultation.heightHistory,
                                            borderColor: "rgb(99, 255, 122)",
                                            backgroundColor: "rgba(102, 255, 99, 0.2)",
                                            tension: 0.4,
                                        },
                                        {
                                            label: "BMI",
                                            data: selectedConsultation.weightHistory,
                                            borderColor: "rgb(255, 180, 99)",
                                            backgroundColor: "rgba(255, 198, 99, 0.2)",
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                            />
                        </div>

                        <Text strong>Message from Parent:</Text>
                        <TextArea rows={3} value={selectedConsultation.message} disabled />

                        <Form.Item label="Your Response">
                            <TextArea
                                rows={4}
                                placeholder="Provide your advice..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                            />
                        </Form.Item>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default DoctorConsultation;
