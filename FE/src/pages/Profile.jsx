import React, { useContext, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  Button,
  Modal,
  Input,
  message,
  Form,
  Divider,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Formik } from "formik";
import * as Yup from "yup";
import HeaderComponent from "../components/Header";
import { AuthContext } from "../contexts/AuthContext";
import api from "../configs/api";
import FooterComponent from "../components/Footer";

const { Title, Text } = Typography;

// Yup validation schema for updating profile
const updateProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

// Yup validation schema for changing password
const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must not exceed 50 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character"
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm new password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const Profile = () => {
  const { user, loading, error, logout } = useContext(AuthContext);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);

  const showUpdateModal = () => setIsUpdateModalVisible(true);
  const showChangePasswordModal = () => setIsChangePasswordModalVisible(true);

  const handleUpdate = async (values) => {
    try {
      await api.patch(`/users/${user._id}`, values);
      message.success("Profile updated successfully");
      setIsUpdateModalVisible(false);
      window.location.reload();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.validationErrors
      ) {
        err.response.data.validationErrors.forEach(({ field, error }) => {
          message.error(`${error}`);
        });
      } else {
        message.error("Failed to update profile");
      }
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await api.put(`/auth/change-password`, values);
      message.success("Password changed successfully");
      logout();
      setIsChangePasswordModalVisible(false);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.validationErrors
      ) {
        err.response.data.validationErrors.forEach(({ field, error }) => {
          message.error(`${error}`);
        });
      } else {
        message.error("Failed to update password");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading your profile...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Title level={4} style={{ color: "#ff4d4f" }}>
          {error}
        </Title>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="no-data-container">
        <Title level={4}>No user data available</Title>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <HeaderComponent />

      <div className="profile-content">
        <div className="profile-header">
          <Title level={2} style={{ marginBottom: 0 }}>
            My Profile
          </Title>
          <Text type="secondary">Manage your account information</Text>
        </div>

        <div className="profile-cards">
          <Card className="profile-card">
            <div className="profile-info">
              <div className="avatar-section">
                <Avatar
                  src={user?.avatar}
                  size={120}
                  style={{
                    backgroundColor: "#1890ff",
                    fontSize: "50px",
                    boxShadow: "0 8px 16px rgba(24, 144, 255, 0.2)",
                  }}>
                  {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Title level={3} style={{ marginTop: "16px", marginBottom: 0 }}>
                  {user?.name}
                </Title>
                <Text type="secondary">{user?.role === 1 ? "Admin" : user?.role === 2 ? "Doctor" : "Member"}</Text>
              </div>

              <Divider style={{ margin: "24px 0" }} />

              <div className="profile-details">
                <div className="profile-item">
                  <div className="profile-icon">
                    <MailOutlined />
                  </div>
                  <div className="profile-text">
                    <Text type="secondary">Email</Text>
                    <Text strong>{user?.email}</Text>
                  </div>
                </div>

                <div className="profile-item">
                  <div className="profile-icon">
                    <PhoneOutlined />
                  </div>
                  <div className="profile-text">
                    <Text type="secondary">Phone Number</Text>
                    <Text strong>{user?.phoneNumber || "Not provided"}</Text>
                  </div>
                </div>

                <div className="profile-item">
                  <div className="profile-icon">
                    <CalendarOutlined />
                  </div>
                  <div className="profile-text">
                    <Text type="secondary">Joined On</Text>
                    <Text strong>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="action-card">
            <Title level={4}>Account Settings</Title>
            <Text
              type="secondary"
              style={{ marginBottom: 24, display: "block" }}>
              Update your personal information or change your password
            </Text>

            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showUpdateModal}
              className="action-button"
              size="large">
              Update Profile
            </Button>

            <Button
              icon={<LockOutlined />}
              onClick={showChangePasswordModal}
              className="action-button"
              size="large">
              Change Password
            </Button>
          </Card>
        </div>
      </div>

      {/* Update Profile Modal */}
      <Modal
        title="Update Profile"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
        width={480}>
        <Formik
          initialValues={{
            name: user.name,
            phoneNumber: user.phoneNumber || "",
          }}
          validationSchema={updateProfileSchema}
          onSubmit={handleUpdate}>
          {({
            isSubmitting,
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
          }) => (
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Name"
                validateStatus={errors.name && touched.name ? "error" : ""}
                help={errors.name && touched.name ? errors.name : ""}>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                validateStatus={
                  errors.phoneNumber && touched.phoneNumber ? "error" : ""
                }
                help={
                  errors.phoneNumber && touched.phoneNumber
                    ? errors.phoneNumber
                    : ""
                }>
                <Input
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div className="modal-buttons">
                  <Button
                    onClick={() => setIsUpdateModalVisible(false)}
                    style={{ marginRight: 16 }}
                    size="large">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    size="large">
                    Save Changes
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={null}
        width={480}>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}>
          {({
            isSubmitting,
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
          }) => (
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Current Password"
                validateStatus={
                  errors.oldPassword && touched.oldPassword ? "error" : ""
                }
                help={
                  errors.oldPassword && touched.oldPassword
                    ? errors.oldPassword
                    : ""
                }>
                <Input.Password
                  name="oldPassword"
                  value={values.oldPassword}
                  onChange={handleChange}
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                validateStatus={
                  errors.newPassword && touched.newPassword ? "error" : ""
                }
                help={
                  errors.newPassword && touched.newPassword
                    ? errors.newPassword
                    : ""
                }>
                <Input.Password
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                validateStatus={
                  errors.confirmNewPassword && touched.confirmNewPassword
                    ? "error"
                    : ""
                }
                help={
                  errors.confirmNewPassword && touched.confirmNewPassword
                    ? errors.confirmNewPassword
                    : ""
                }>
                <Input.Password
                  name="confirmNewPassword"
                  value={values.confirmNewPassword}
                  onChange={handleChange}
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div className="modal-buttons">
                  <Button
                    onClick={() => setIsChangePasswordModalVisible(false)}
                    style={{ marginRight: 16 }}
                    size="large">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    size="large"
                    danger>
                    Change Password
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Modal>
      <FooterComponent />

      <style jsx>{`
        .profile-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f0f2f5;
        }

        .loading-container,
        .error-container,
        .no-data-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 0;
          text-align: center;
        }

        .profile-content {
          max-width: 1200px;
          margin: 32px auto;
          padding: 0 24px;
          width: 100%;
        }

        .profile-header {
          margin-bottom: 24px;
        }

        .profile-cards {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .profile-card,
        .action-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .profile-item {
          display: flex;
          align-items: center;
        }

        .profile-icon {
          font-size: 20px;
          color: #1890ff;
          margin-right: 16px;
          min-width: 24px;
          text-align: center;
        }

        .profile-text {
          display: flex;
          flex-direction: column;
        }

        .action-button {
          display: block;
          width: 100%;
          margin-bottom: 16px;
        }

        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }

        @media (max-width: 768px) {
          .profile-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
