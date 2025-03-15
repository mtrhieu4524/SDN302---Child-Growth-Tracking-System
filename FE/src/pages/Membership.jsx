import { useEffect } from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Paragraph } = Typography;

const membershipPackages = [
    {
        id: "67b1f25e8baf3dab53b92a28",
        name: "Gold Membership",
        description: "Access to premium features",
        price: "100 USD",
        convertedPrice: "2,500,000 VND",
        duration: "30 Days",
        postLimit: 10,
        updateChildDataLimit: 5,
    },
    {
        id: "67b1f25e8baf3dab53b92a29",
        name: "Silver Membership",
        description: "Standard access with essential features",
        price: "50 USD",
        convertedPrice: "1,250,000 VND",
        duration: "30 Days",
        postLimit: 5,
        updateChildDataLimit: 3,
    },
    {
        id: "67b1f25e8baf3dab53b92a30",
        name: "Basic Membership",
        description: "Limited access for new users",
        price: "20 USD",
        convertedPrice: "500,000 VND",
        duration: "30 Days",
        postLimit: 2,
        updateChildDataLimit: 1,
    },
];

const Membership = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Membership Packages";
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            {/* Membership Header */}
            <div style={{
                background: "linear-gradient(to right, #0082C8, #0056A1)",
                color: "white",
                textAlign: "center",
                padding: "30px 20px",
            }}>
                <Title level={2} style={{ color: "white", marginBottom: 0 }}>
                    Choose Your Membership Plan
                </Title>
                <Paragraph style={{ color: "white", fontSize: "16px", marginTop: "10px" }}>
                    Select the best plan to track your child's growth effectively.
                </Paragraph>
            </div>

            <br></br>  <br></br>
            <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
                <Row gutter={[24, 24]} justify="center">
                    {membershipPackages.map((pkg) => (
                        <Col xs={24} sm={12} md={8} key={pkg.id}>
                            <Card
                                title={pkg.name}
                                bordered={false}
                                style={{
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.3s",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                }}
                                headStyle={{
                                    backgroundColor: "#0082C8",
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                                hoverable
                            >
                                <div style={{ minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <Paragraph>{pkg.description}</Paragraph>
                                    <Title level={4} style={{ color: "#0056A1", marginTop: "10px" }}>
                                        {pkg.price} <span style={{ fontSize: "16px", color: "#666" }}>({pkg.convertedPrice})</span>
                                    </Title>
                                    <Paragraph><CheckCircleOutlined style={{ color: "#0082C8" }} /> Duration: {pkg.duration}</Paragraph>
                                    <Paragraph><CheckCircleOutlined style={{ color: "#0082C8" }} /> Post Limit: {pkg.postLimit}</Paragraph>
                                    <Paragraph><CheckCircleOutlined style={{ color: "#0082C8" }} /> Update Child Data: {pkg.updateChildDataLimit} times</Paragraph>
                                </div>

                                <Button
                                    type="primary"
                                    style={{
                                        background: "#0082C8",
                                        borderColor: "#0082C8",
                                        width: "100%",
                                        marginTop: "15px",
                                    }}
                                >
                                    Choose Plan
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <br></br>  <br></br>  <br></br>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Membership;
