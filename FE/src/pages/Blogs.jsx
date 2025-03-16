import { useEffect } from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Paragraph } = Typography;

const blogs = [
    {
        title: "Find our latest data and analysis",
        description: "View the NCHS calendar of recent and upcoming releases.",
        image: "https://www.cdc.gov/nchs/media/images/2024/09/DFE-Homepage-publications-Openbook1.png",
        link: "#",
    },
    {
        title: "Data Detectives Camp",
        description: "Apply now for summer sessions.",
        image: "https://www.cdc.gov/nchs/media/images/2024/09/DFE-Homepage-publications-Openbook1.png",
        link: "#",
    },
    {
        title: "Birth Rates",
        description: "Down for women under 30, up for 30 and older.",
        image: "https://www.cdc.gov/nchs/media/images/2024/09/DFE-Homepage-publications-Openbook1.png",
        link: "#",
    },
    {
        title: "Drug Overdose Deaths",
        description: "Decreased in 20 states from 2022 to 2023.",
        image: "https://www.cdc.gov/nchs/media/images/2024/09/DFE-Homepage-publications-Openbook1.png",
        link: "#",
    },
];

const Blogs = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Blogs";
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />

            <div style={{ padding: "80px 100px 10px 100px", maxWidth: "1200px", margin: "0 auto" }}>
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12}>
                        <img
                            src="https://www.cdc.gov/nchs/media/images/2024/09/DFE-Homepage-publications-Openbook1.png"
                            alt="Featured Blog"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                            }}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ color: "#00274E", fontWeight: "bold" }}>
                            Find our latest data and analysis
                        </Title>
                        <Paragraph style={{ color: "#666" }}>
                            View the NCHS calendar of recent and upcoming releases.
                        </Paragraph>
                        <Button
                            type="primary"
                            href="#"
                            icon={<RightOutlined />}
                            style={{ backgroundColor: "#0082C8", borderColor: "#0082C8" }}
                        >
                            Learn More
                        </Button>

                    </Col>
                </Row>
            </div>

            <div style={{ padding: "40px 100px", maxWidth: "1200px", margin: "0 auto" }}>
                <Title level={3} style={{ textAlign: "left", color: "#00274E", fontWeight: "bold" }}>
                    Latest Blog Posts
                </Title>
                <hr style={{ border: "2px solid #00274E", width: "80px", margin: "8px 0 20px 0" }} />


                <Row gutter={[32, 32]}>
                    {blogs.map((blog, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "8px",
                                            borderTopRightRadius: "8px",
                                            marginBottom: "-30px"
                                        }}
                                    />
                                }
                                style={{
                                    borderRadius: "8px",
                                    height: "400px",
                                    overflow: "hidden",
                                }}
                            >
                                <Title level={4} style={{ color: "#00274E" }}>
                                    {blog.title}
                                </Title>
                                <Paragraph style={{ color: "#666" }}>{blog.description}</Paragraph>
                                <Button
                                    type="link"
                                    href={blog.link}
                                    icon={<RightOutlined />}
                                    style={{ color: "#0082C8" }}
                                >
                                    Read More
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <br />  <br />  <br />
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Blogs;
