import { useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Button,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const About = () => {
  useEffect(() => {
    document.title = "Child Growth Tracking - About Us";
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <Content
        style={{
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          marginBottom: "20px",
        }}>
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #0082C8, #0056A1)",
            padding: "60px 40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "white",
            marginBottom: "40px",
          }}>
          <Title
            level={1}
            style={{ color: "white", fontWeight: 700, marginBottom: "16px" }}>
            About Child Growth Tracking
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#e0e0e0",
              maxWidth: "800px",
              margin: "0 auto",
            }}>
            We are dedicated to helping parents and caregivers monitor and
            understand their child's physical development with ease and
            confidence.
          </Paragraph>
        </div>

        <Divider />

        {/* Key Features Section */}
        <Title
          level={2}
          style={{
            color: "#00274E",
            textAlign: "center",
            marginBottom: "40px",
          }}>
          What We Offer
        </Title>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card
              bordered={false}
              style={{
                background: "#f0f8ff",
                textAlign: "center",
                borderRadius: "12px",
                padding: "20px",
                transition: "transform 0.3s",
                height: "100%",
              }}
              hoverable
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }>
              <Title level={4} style={{ color: "#0082C8" }}>
                Monitor Growth Milestones
              </Title>
              <Paragraph style={{ color: "#666", lineHeight: "1.6" }}>
                Track your child's height, weight, and key health indicators
                with our intuitive tools.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              bordered={false}
              style={{
                background: "#f0f8ff",
                textAlign: "center",
                borderRadius: "12px",
                padding: "20px",
                transition: "transform 0.3s",
                height: "100%",
              }}
              hoverable
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }>
              <Title level={4} style={{ color: "#0082C8" }}>
                Personalized Insights
              </Title>
              <Paragraph style={{ color: "#666", lineHeight: "1.6" }}>
                Receive expert-backed insights based on your child's growth
                patterns.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              bordered={false}
              style={{
                background: "#f0f8ff",
                textAlign: "center",
                borderRadius: "12px",
                padding: "20px",
                transition: "transform 0.3s",
                height: "100%",
              }}
              hoverable
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }>
              <Title level={4} style={{ color: "#0082C8" }}>
                Stay Informed
              </Title>
              <Paragraph style={{ color: "#666", lineHeight: "1.6" }}>
                Access reliable health and nutrition advice for your child's
                well-being.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* How It Works Section */}
        <Title level={2} style={{ color: "#0056A1", marginBottom: "20px" }}>
          How It Works
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "30px",
          }}>
          Child Growth Tracking helps you log and visualize your child's
          physical development over time. By comparing measurements to growth
          standards, you can ensure they are growing at a healthy rate.
        </Paragraph>
        <Title level={3} style={{ color: "#0082C8", marginBottom: "20px" }}>
          Growth Tracking Features
        </Title>
        <ul
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "30px",
          }}>
          <li>Height and weight tracking</li>
          <li>Head circumference monitoring</li>
          <li>Developmental milestone tracking</li>
          <li>Personalized growth charts</li>
          <li>Health and nutrition tips</li>
        </ul>

        <Divider />

        {/* Why It Matters Section */}
        <Title level={2} style={{ color: "#0056A1", marginBottom: "20px" }}>
          Why It Matters
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "30px",
          }}>
          Monitoring your child's growth can help detect potential health
          concerns early. Our platform makes it easy to keep track and share
          information with healthcare professionals.
        </Paragraph>
        <Title level={3} style={{ color: "#0082C8", marginBottom: "20px" }}>
          Key Benefits
        </Title>
        <ul
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "30px",
          }}>
          <li>Early detection of growth-related issues</li>
          <li>Personalized recommendations for optimal development</li>
          <li>Easy-to-understand visualizations of progress</li>
          <li>Guidance from trusted health professionals</li>
        </ul>

        <Divider />

        {/* Privacy and Security Section */}
        <Title level={2} style={{ color: "#0056A1", marginBottom: "20px" }}>
          Privacy and Security
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "20px",
          }}>
          We prioritize the confidentiality of your child's health data. Our
          system uses secure encryption to keep your information safe and
          accessible only to you.
        </Paragraph>
        <Link
          to="#"
          style={{
            fontSize: "16px",
            color: "#0082C8",
            textDecoration: "underline",
          }}>
          Learn more about our privacy policy.
        </Link>

        <Divider />

        {/* Meet Our Team Section */}
        <Title level={2} style={{ color: "#0056A1", marginBottom: "20px" }}>
          Meet Our Team
        </Title>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8}>
            <Image
              src="https://www.cdc.gov/nchs/media/images/2024/08/Moyer_Brian_600x600.png"
              alt="Dr. Alex Smith"
              preview={false}
              style={{
                borderRadius: "12px",
                width: "100%",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Paragraph
              style={{ textAlign: "center", color: "#666", marginTop: "10px" }}>
              Dr. Alex Smith
            </Paragraph>
          </Col>
          <Col xs={24} md={16}>
            <Title level={3} style={{ color: "#0082C8", marginBottom: "10px" }}>
              Dr. Alex Smith, Chief Pediatrician
            </Title>
            <Paragraph
              style={{ fontSize: "16px", color: "#333", lineHeight: "1.8" }}>
              - Alex Smith is Professor of Medicine, UCSF Division of
              Geriatrics. He co-hosts the GeriPal podcast, a resource for
              healthcare professionals in geriatrics and palliative care.
              <br />
              - Dr. Smith co-created ePrognosis, an online compendium of
              prognostic indices for clinical use.
              <br />- He mentors the next generation of aging and palliative
              care research scholars and provides executive leadership for
              statistical programs at HHS and CDC.
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        {/* Helpful Resources Section */}
        <Title level={2} style={{ color: "#0056A1", marginBottom: "20px" }}>
          Helpful Resources
        </Title>
        <ul
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.8",
            marginBottom: "40px",
          }}>
          <li>
            <Link
              to="#"
              style={{ color: "#0082C8", textDecoration: "underline" }}>
              Growth Milestone Guidelines
            </Link>
          </li>
          <li>
            <Link
              to="#"
              style={{ color: "#0082C8", textDecoration: "underline" }}>
              Nutrition for Growing Children
            </Link>
          </li>
          <li>
            <Link
              to="#"
              style={{ color: "#0082C8", textDecoration: "underline" }}>
              Healthy Habits and Exercise
            </Link>
          </li>
          <li>
            <Link
              to="#"
              style={{ color: "#0082C8", textDecoration: "underline" }}>
              When to See a Pediatrician
            </Link>
          </li>
        </ul>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              background: "#0082C8",
              borderColor: "#0082C8",
              borderRadius: "8px",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to Top
          </Button>
        </div>
      </Content>
      <Footer />
      <ScrollToTop />
    </Layout>
  );
};

export default About;
