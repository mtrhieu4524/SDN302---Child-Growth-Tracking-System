import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import { AuthContext } from "../contexts/AuthContext";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  // Update document title
  useEffect(() => {
    document.title = "Child Growth Tracking - Sign Up";
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(1, "Name must be at least 1 character long"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,50}$/,
          "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
        ),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await register(values.name, values.email, values.password);

        if (response.status >= 200 && response.status < 300) {
          navigate("/verification-sent", { state: { email: values.email } });
        } else {
          if (Array.isArray(response.validationErrors)) {
            response.validationErrors.forEach((error) => {
              formik.setFieldError(error.field, error.error);
            });
          } else {
            message.error(response.message || "Registration failed");
          }
        }
      } catch (error) {        
        message.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
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
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "8px" }}>
              Sign up
            </Title>
            <Text type="secondary">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#0082C8" }}>
                Sign in
              </Link>
            </Text>
          </div>

          <Form onFinish={formik.handleSubmit}>
            <Form.Item
              help={formik.touched.name && formik.errors.name}
              validateStatus={
                formik.touched.name && formik.errors.name ? "error" : ""
              }
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item
              help={formik.touched.email && formik.errors.email}
              validateStatus={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item
              help={formik.touched.password && formik.errors.password}
              validateStatus={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item
              help={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              validateStatus={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "error"
                  : ""
              }
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading} // Show loading state
                style={{
                  width: "100%",
                  height: "40px",
                  background: "linear-gradient(to right, #0056A1, #0082C8)",
                  border: "none",
                }}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Register;