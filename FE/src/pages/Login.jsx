import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "Child Growth Tracking - Đăng nhập";
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
  };

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
              Đăng nhập
            </Title>
            <Text type="secondary">
              Hoặc{" "}
              <Link to="/register" style={{ color: "#0082C8" }}>
                đăng ký tài khoản mới
              </Link>
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link style={{ color: "#0082C8" }}>Quên mật khẩu?</Link>
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
                }}
              >
                Đăng nhập
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
