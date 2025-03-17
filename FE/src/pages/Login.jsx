import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import { AuthContext } from "../contexts/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Child Growth Tracking - Sign In";
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values.email, values.password);

        if (response.status >= 200 && response.status < 300) {
          message.success("Login success!");
        } else {
          if (response.validationErrors) {
            response.validationErrors.forEach((error) => {
              formik.setFieldError(error.field, error.error);
            });
          } else {
            message.error(response.message || "Login failed");
          }
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || "An unexpected error occurred. Please try again."
        );
      }
    },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div
        style={{
          flexGrow: 1,
          background: "#e5f1f1",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title level={2} style={{ color: "#EF6351", marginBottom: "8px" }}>
              Sign in
            </Title>
            <Text type="secondary">
              Do not have an account?{" "}
              <Link to="/register" style={{ color: "#EF6351" }}>
                Sign up
              </Link>
            </Text>
          </div>

          <Form onFinish={formik.handleSubmit}>
            <Form.Item
              help={formik.touched.email && formik.errors.email}
              validateStatus={formik.touched.email && formik.errors.email ? "error" : ""}>
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item
              help={formik.touched.password && formik.errors.password}
              validateStatus={formik.touched.password && formik.errors.password ? "error" : ""}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={formik.isSubmitting}
                style={{
                  width: "100%",
                  height: "40px",
                  background: "#EF6351",
                  border: "none",
                }}>
                {formik.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Text type="secondary">or</Text>
          </div>

          <Button
            icon={<GoogleOutlined />}
            onClick={loginWithGoogle}
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#fff",
              borderColor: "#d9d9d9",
              color: "rgba(0, 0, 0, 0.85)",
            }}>
            Sign in with Google
          </Button>
        </Card>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Login;
