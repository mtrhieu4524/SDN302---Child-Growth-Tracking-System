import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Spin,
  message,
  Form,
  Radio,
  Row,
  Col,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import api from "../configs/api";
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const { Title, Paragraph } = Typography;

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/membership-packages/${id}`);
        setPackageDetails(response.data.package);
      } catch (error) {
        console.error("Error fetching package details:", error);
        message.error("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const formatPrice = (price) => {
    const value = price.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${value} ${price.unit}`;
  };

  const handlePayment = async () => {
    try {
      if (paymentMethod === "vnpay") {
        const response = await api.post("/payments/vnpay/create", {
          price: packageDetails.price.value,
          packageId: packageDetails._id,
        });

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("Failed to generate VNPay payment URL");
        }
      } else if (paymentMethod === "paypal") {
        const response = await api.post("/payments/paypal/create", {
          price: packageDetails.price.value,
          packageId: packageDetails._id,
        });

        if (response.data.link) {
          window.location.href = response.data.link;
        } else {
          throw new Error("Failed to generate PayPal approval URL");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (error.response) {
        const { data } = error.response;

        if (data.validationErrors) {
          data.validationErrors.forEach((err) => {
            message.error(`${err.field}: ${err.error}`);
          });
        } else if (data.message) {
          message.error(data.message);
        }
      } else {
        message.error("Payment failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Paragraph>No package details found.</Paragraph>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderComponent />
      <div style={{ maxWidth: "1500px", margin: "0px auto", padding: "0 20px", flex: 1 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Payment Details
        </Title>

        <Row gutter={[24, 24]}>
          {/* Package Details */}
          <Col xs={24} md={12}>
            <Card
              title="Selected Plan"
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              headStyle={{
                backgroundColor: "#0082C8",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <div style={{ padding: "20px" }}>
                <Title level={4} style={{ color: "#0056A1" }}>
                  {packageDetails.name}
                </Title>
                <Paragraph>{packageDetails.description}</Paragraph>
                <Paragraph>
                  <CheckCircleOutlined style={{ color: "#0082C8" }} /> Price:{" "}
                  {formatPrice(packageDetails.price)}
                </Paragraph>
                <Paragraph>
                  <CheckCircleOutlined style={{ color: "#0082C8" }} /> Duration:{" "}
                  {packageDetails.duration?.value}{" "}
                  {packageDetails.duration?.unit}
                </Paragraph>
                <Paragraph>
                  <CheckCircleOutlined style={{ color: "#0082C8" }} /> Post
                  Limit: {packageDetails.postLimit}
                </Paragraph>
                <Paragraph>
                  <CheckCircleOutlined style={{ color: "#0082C8" }} /> Update
                  Child Data: {packageDetails.updateChildDataLimit} times
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* Payment Form */}
          <Col xs={24} md={12}>
            <Card
              title="Payment Information"
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              headStyle={{
                backgroundColor: "#0082C8",
                color: "white",
                fontWeight: "bold",
              }}
            >
              <Form onFinish={handlePayment} layout="vertical">
                <Form.Item
                  label="Payment Method"
                  name="paymentMethod"
                  initialValue="vnpay"
                >
                  <Radio.Group
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    value={paymentMethod}
                  >
                    <Radio value="vnpay">VNPay</Radio>
                    <Radio value="paypal">PayPal</Radio>
                  </Radio.Group>
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "#0082C8",
                    borderColor: "#0082C8",
                    width: "100%",
                    marginTop: "15px",
                  }}
                >
                  Proceed to Payment
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default PaymentDetails;
