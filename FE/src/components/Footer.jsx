import { Layout, Row, Col, Typography } from "antd";
import "./style/Footer.scss";

const { Footer } = Layout;
const { Title, Link, Paragraph } = Typography;

const FooterComponent = () => {
    return (
        <Footer style={{ background: "linear-gradient(to right, #0056A1, #0082C8)", color: "white", padding: "40px 40px 50px 40px", marginLeft: "-8px", marginRight: "-8px", marginBottom: "-10px" }}>
            <Row justify="space-between">
                <Col xs={24} md={10}>
                    <Title level={3} style={{ color: "white" }}>
                        Child Growth Tracking
                    </Title>
                    <Paragraph style={{ color: "white" }}>
                        Empowering parents and caregivers with reliable health insights to track their child's growth, monitor developmental milestones, and ensure a healthy future through expert guidance and scientifically backed resources.                    </Paragraph>
                </Col>
                <Col xs={24} md={1}> </Col>
                <Col xs={24} md={6}>
                    <Title level={5} style={{ color: "white" }}>Resources</Title>
                    <Paragraph>
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link>
                    </Paragraph>
                </Col>
                <Col xs={24} md={1}> </Col>
                <Col xs={24} md={6}>
                    <Title level={5} style={{ color: "white" }}>Support & Contact</Title>
                    <Paragraph>
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link><br />
                        <Link href="#" className="footer-link">Content</Link>
                    </Paragraph>
                </Col>
            </Row>
        </Footer>
    );
};

export default FooterComponent;
