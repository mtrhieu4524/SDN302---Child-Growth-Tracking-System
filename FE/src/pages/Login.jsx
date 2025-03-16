import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Child Growth Tracking - Sign In";
  }, []);

  const handleLogin = async () => {
    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", JSON.stringify(data));
      localStorage.setItem("loggedIn", true);
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      setError(data.message);
    }
  };

  // Hardcoded admin credentials
  // const ADMIN_CREDENTIALS = {
  //   username: "admin",
  //   password: "admin123",
  // };

  // const onFinish = (values) => {
  //   // Check if credentials match admin account
  //   if (
  //     values.username === ADMIN_CREDENTIALS.username &&
  //     values.password === ADMIN_CREDENTIALS.password
  //   ) {
  //     // Store admin token
  //     localStorage.setItem("adminToken", "dummy-admin-token");
  //     message.success("Đăng nhập thành công!");
  //     navigate("/dashboard");
  //   } else {
  //     // Handle normal user login here
  //     message.error("Tài khoản hoặc mật khẩu không đúng!");
  //   }
  // };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
            <Title level={2} style={{ color: "#0056A1", marginBottom: "8px" }}>
              Sign in
            </Title>
            <Text type="secondary">
              Do not have an account?{" "}
              <Link to="/register" style={{ color: "#0082C8" }}>
                Sign up
              </Link>
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large">
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter username!",
                },
              ]}>
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter password!",
                },
              ]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  height: "40px",
                  background: "linear-gradient(to right, #0056A1, #0082C8)",
                  border: "none",
                }}>
                Sign in
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

export default Login;
