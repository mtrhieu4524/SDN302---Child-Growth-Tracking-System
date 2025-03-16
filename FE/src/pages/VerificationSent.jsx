import { Button, Card, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const VerificationSent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        style={{
          flexGrow: 1,
          background: "#e5f1f1",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Title level={2} style={{ color: "#0056A1", marginBottom: "16px" }}>
            Verification Email Sent
          </Title>
          <Text type="secondary">
            We have sent a verification email to <strong>{email}</strong>. Please
            check your inbox and follow the instructions to verify your account.
          </Text>
          <Button
            type="primary"
            style={{
              marginTop: "24px",
              width: "100%",
              height: "40px",
              background: "linear-gradient(to right, #0056A1, #0082C8)",
              border: "none",
            }}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default VerificationSent;