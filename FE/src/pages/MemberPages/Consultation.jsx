import { useState, useEffect } from "react";
import { Card, Form, Select, Input, Button, Typography, message, Row, Col, Spin } from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import api from "../../configs/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Consultation = () => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [childrenData, setChildrenData] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loadingChildren, setLoadingChildren] = useState(true);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await api.get("/children", {
                    params: { page: 1, size: 10, sortBy: "date", order: "descending" },
                });
                if (response.data?.children?.length) {
                    setChildrenData(response.data.children);
                }
            } catch (error) {
                message.error("Failed to load children list");
            } finally {
                setLoadingChildren(false);
            }
        };

        fetchChildren();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get("/users");
                if (response.data?.users?.length) {
                    const uniqueDoctors = [];
                    const doctorIds = new Set();

                    response.data.users.forEach(doctor => {
                        if (doctor.role === 2) {
                            const doctorId = doctor._id;
                            if (!doctorIds.has(doctorId)) {
                                doctorIds.add(doctorId);
                                uniqueDoctors.push(doctor);
                            }
                        }
                    });

                    setDoctors(uniqueDoctors);
                }
            } catch (error) {
                message.error("Failed to load doctors list");
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, []);


    useEffect(() => {
        document.title = "Child Growth Tracking - Doctor Consultation";
    }, []);

    const handleSubmit = async () => {
        if (!selectedChild || !selectedDoctor || !messageText.trim()) {
            message.error("Please select a child, doctor, and enter a consultation title.");
            return;
        }

        const requestData = {
            childIds: [String(selectedChild)],
            doctorId: String(selectedDoctor),
            title: messageText.trim(),
        };

        try {
            setLoadingSubmit(true);
            const response = await api.post("/requests", requestData);
            message.success("Consultation request submitted successfully!");
            setSelectedChild(null);
            setSelectedDoctor(null);
            setMessageText("");
        } catch (error) {
            message.error("Failed to submit consultation request.");
        } finally {
            setLoadingSubmit(false);
        }
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
                                    Request Consultation
                                </Title>
                                <Text type="secondary"> Get expert advice on your child's health and growth from trusted professionals.</Text>
                            </div>
                        </div>
                    }
                    style={{ maxWidth: 800, margin: "0 auto", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    headStyle={{ background: "#fafafa", borderBottom: "none" }}
                >
                    <Form layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Select Child" required>
                                    {loadingChildren ? (
                                        <Spin />
                                    ) : (
                                        <Select
                                            placeholder="Choose a child"
                                            value={selectedChild}
                                            onChange={(value) => setSelectedChild(value)}
                                        >
                                            {childrenData.map((child) => (
                                                <Select.Option key={child.id ?? child._id} value={child.id ?? child._id}>
                                                    {child.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Select Doctor" required>
                                    {loadingDoctors ? (
                                        <Spin />
                                    ) : (
                                        <Select
                                            placeholder="Choose a doctor"
                                            value={selectedDoctor}
                                            onChange={(value) => setSelectedDoctor(value)}
                                        >
                                            {doctors.map((doctor) => (
                                                <Select.Option key={doctor.id ?? doctor._id} value={doctor.id ?? doctor._id}>
                                                    {doctor.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Consultation Title" required>
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
                                size="large"
                                onClick={handleSubmit}
                                disabled={loadingSubmit}
                                style={{
                                    width: "100%",
                                    borderRadius: 4,
                                    background: "linear-gradient(to right, #0082C8, #0056A1)",
                                    border: "none",
                                    height: 40,
                                }}
                            >
                                {loadingSubmit ? <Spin /> : "Submit Consultation Request"}
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
