import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "Child Growth Tracking - Đăng ký";
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
              Đăng ký tài khoản
            </Title>
            <Text type="secondary">
              Hoặc{" "}
              <Link to="/login" style={{ color: "#0082C8" }}>
                đăng nhập nếu đã có tài khoản
              </Link>
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Họ và tên"
              />
            </Form.Item>

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
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
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
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Xác nhận mật khẩu"
              />
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
                Đăng ký
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
