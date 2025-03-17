import { Layout, Row, Col, Typography } from "antd";
import "./style/Footer.css";
import {
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Link, Paragraph } = Typography;

const FooterComponent = () => {
    return (
        <Footer style={{ background: "#0082C8", color: "white", padding: "40px 40px 50px 40px", marginLeft: "-8px", marginRight: "-8px", marginBottom: "-10px" }}>
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
                    <Title level={5} style={{ color: "white" }}>Links</Title>
                    <Paragraph>
                        <Link href="/" className="footer-link">Home</Link><br />
                        <Link href="/growth-chart" className="footer-link">Growth Chart</Link><br />
                        <Link href="/blogs" className="footer-link">Blogs</Link><br />
                        <Link href="/faqs" className="footer-link">FAQs</Link><br />
                        <Link href="/about-us" className="footer-link">About Us</Link>
                    </Paragraph>
                </Col>
                <Col xs={24} md={1}> </Col>
                <Col xs={24} md={6}>
                    <Title level={5} style={{ color: "white" }}>Contact Us</Title>
                    <Paragraph>
                        <UserOutlined style={{ marginRight: "8px", color: "white" }} />
                        <Link href="https://ng.linkedin.com/in/iroro-yarhere-a400a111" target="_blank" rel="noopener noreferrer" className="footer-link">Dr. Iroro E Yarhere Paediatrician and Endocrinologist</Link><br />

            <HomeOutlined style={{ marginRight: "8px", color: "white" }} />
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link">
              FPT University - HCMC
            </Link>
            <br />

            <PhoneOutlined style={{ marginRight: "8px", color: "white" }} />
            <Link href="tel:+1234567890" className="footer-link">
              +123 4567890
            </Link>
            <br />

            <MailOutlined style={{ marginRight: "8px", color: "white" }} />
            <Link
              href="mailto:childgrowthtracking@gmail.com"
              className="footer-link">
              childgrowthtracking@gmail.com
            </Link>
            <br />
          </Paragraph>
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterComponent;
