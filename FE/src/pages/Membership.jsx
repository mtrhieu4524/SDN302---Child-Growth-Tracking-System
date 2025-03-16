import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Spin,
  message,
  Pagination,
  Empty
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import axios from "axios";
import api from "../configs/api";

const { Title, Paragraph } = Typography;

const Membership = () => {
  const [loading, setLoading] = useState(true);
  const [membershipPackages, setMembershipPackages] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchMembershipPackages = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.get("/membership-packages",
        {
          params: {
            page,
            size,
            search: "",
            order: "descending",
            sortBy: "date",
          },
        }
      );

      console.log("Fetched membership packages:", response.data);

      if (response.data && response.data.packages) {
        setMembershipPackages(response.data.packages);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.packages.length,
        });
      } else {
        message.error("No membership packages found");
        setMembershipPackages([]);
      }
    } catch (error) {
      console.error("Error fetching membership packages:", error);
      message.error("Failed to load membership packages");
      setMembershipPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Child Growth Tracking - Membership Packages";
    fetchMembershipPackages(pagination.current, pagination.pageSize);
  }, []);

  const formatPrice = (price) => {
    const value = price.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${value} ${price.unit}`;
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Membership Header */}
      <div
        style={{
          background: "linear-gradient(to right, #0082C8, #0056A1)",
          color: "white",
          textAlign: "center",
          padding: "30px 20px",
        }}>
        <Title level={2} style={{ color: "white", marginBottom: 0 }}>
          Choose Your Membership Plan
        </Title>
        <Paragraph
          style={{ color: "white", fontSize: "16px", marginTop: "10px" }}>
          Select the best plan to track your child's growth effectively.
        </Paragraph>
      </div>

      <br />
      <br />
      <div
        style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : membershipPackages.length > 0 ? (
          <>
            <Row gutter={[24, 24]} justify="center">
              {membershipPackages.map((pkg) => (
                <Col xs={24} sm={12} md={8} key={pkg._id}>
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
                    hoverable>
                    <div
                      style={{
                        minHeight: "180px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}>
                      <Paragraph>{pkg.description}</Paragraph>
                      <Title
                        level={4}
                        style={{ color: "#0056A1", marginTop: "10px" }}>
                        {formatPrice(pkg.price)}
                        <span style={{ fontSize: "16px", color: "#666" }}>
                          (
                          {pkg.convertedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                          VND)
                        </span>
                      </Title>
                      <Paragraph>
                        <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                        Duration: {pkg.duration.value} {pkg.duration.unit}
                      </Paragraph>
                      <Paragraph>
                        <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                        Post Limit: {pkg.postLimit}
                      </Paragraph>
                      <Paragraph>
                        <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                        Update Child Data: {pkg.updateChildDataLimit} times
                      </Paragraph>
                    </div>

                    <Button
                      type="primary"
                      style={{
                        background: "#0082C8",
                        borderColor: "#0082C8",
                        width: "100%",
                        marginTop: "15px",
                      }}>
                      Choose Plan
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Empty
            description="No membership packages available"
            style={{ margin: "48px 0" }}
          />
        )}
      </div>
      <br />
      <br />
      <br />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Membership;
