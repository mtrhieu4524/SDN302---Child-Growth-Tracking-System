import { useEffect } from "react";
import { Layout, Typography, Row, Col, Card, Divider, Button } from "antd";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Content } = Layout;
const { Title, Paragraph, Link } = Typography;

const About = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - About Us";
    }, []);

    return (
        <div>
            <Header />
            <Content style={{ maxWidth: "100%", marginLeft: "-8px", marginRight: "-8px", background: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Title level={2} style={{ textAlign: "center", color: "#00274E", fontWeight: "bold" }}>
                    About Child Growth Tracking
                </Title>
                <Paragraph style={{ textAlign: "center", fontSize: "16px", color: "#666" }}>
                    Child Growth Tracking is dedicated to helping parents and caregivers monitor and understand their child's physical development.
                </Paragraph>

                <Divider />

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: "#0082C8", color: "white" }}>
                            <Title level={4} style={{ color: "white" }}>Monitor Growth Milestones</Title>
                            <Paragraph style={{ color: "white" }}>
                                Our platform provides tools to track your child's height, weight, and other key health indicators.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: "#0056A1", color: "white" }}>
                            <Title level={4} style={{ color: "white" }}>Personalized Insights</Title>
                            <Paragraph style={{ color: "white" }}>
                                Get expert-backed insights based on your child's growth patterns and developmental stages.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card bordered={false} style={{ background: "#0082C8", color: "white" }}>
                            <Title level={4} style={{ color: "white" }}>Stay Informed</Title>
                            <Paragraph style={{ color: "white" }}>
                                Access reliable health and nutrition advice to support your child's overall well-being.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                <Divider />

                <Title level={3} style={{ color: "#0056A1" }}>How It Works</Title>
                <Paragraph>
                    Child Growth Tracking helps you log and visualize your child's physical development over time. By comparing measurements to growth standards, you can ensure they are growing at a healthy rate.
                </Paragraph>

                <Title level={4}>Growth Tracking Features</Title>
                <ul style={{ fontSize: "16px", color: "#333" }}>
                    <li>Height and weight tracking</li>
                    <li>Head circumference monitoring</li>
                    <li>Developmental milestone tracking</li>
                    <li>Personalized growth charts</li>
                    <li>Health and nutrition tips</li>
                </ul>

                <Divider />

                <Title level={3} style={{ color: "#0056A1" }}>Why It Matters</Title>
                <Paragraph>
                    Monitoring your child's growth can help detect potential health concerns early. Our platform makes it easy to keep track and share information with healthcare professionals.
                </Paragraph>

                <Title level={4}>Key Benefits:</Title>
                <ul style={{ fontSize: "16px", color: "#333" }}>
                    <li>Early detection of growth-related issues</li>
                    <li>Personalized recommendations for optimal development</li>
                    <li>Easy-to-understand visualizations of progress</li>
                    <li>Guidance from trusted health professionals</li>
                </ul>

                <Divider />

                <Title level={3} style={{ color: "#0056A1" }}>Privacy and Security</Title>
                <Paragraph>
                    We prioritize the confidentiality of your child's health data. Our system uses secure encryption to keep your information safe and accessible only to you.
                </Paragraph>
                <Link href="#" style={{ fontSize: "14px", color: "#0082C8" }}>Learn more about our privacy policy.</Link>

                <Divider />

                <Title level={3} style={{ color: "#0056A1" }}>Meet Our Team</Title>
                <Row gutter={24}>
                    <Col xs={24} md={6}>
                        <img src="https://www.cdc.gov/nchs/media/images/2024/08/Moyer_Brian_600x600.png" alt="Director" style={{ borderRadius: "8px", width: "100%" }} />
                    </Col>
                    <Col xs={24} md={18}>
                        <Title level={4}>Dr. Alex Smith, Chief Pediatrician</Title>
                        <Paragraph>
                            - Alex Smith is Professor of Medicine, UCSF Division of Geriatrics. He is co-host of the GeriPal podcast, a geriatrics and palliative care podcast for every healthcare professional. <br></br>- Dr. Smith is co-creator of ePrognosis, an online compendium of prognostic indices for use in clinical practice. Dr. Smith is heavily engaged in mentoring the next generations of aging and palliative care research scholars. <br></br>- Dr. Moyer provides executive leadership and strategic direction for the center’s statistical programs and policies. Dr. Moyer serves as the statistical official for the U.S. Department of Health and Human Services (HHS), and senior advisor to the CDC director and HHS secretary.                        </Paragraph>
                    </Col>
                </Row>

                <Divider />

                <Title level={3} style={{ color: "#0056A1" }}>Helpful Resources</Title>
                <ul style={{ fontSize: "16px", color: "#333" }}>
                    <li><Link href="#" style={{ color: "#0082C8" }}>Growth Milestone Guidelines</Link></li>
                    <li><Link href="#" style={{ color: "#0082C8" }}>Nutrition for Growing Children</Link></li>
                    <li><Link href="#" style={{ color: "#0082C8" }}>Healthy Habits and Exercise</Link></li>
                    <li><Link href="#" style={{ color: "#0082C8" }}>When to See a Pediatrician</Link></li>
                </ul>
            </Content>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default About;
