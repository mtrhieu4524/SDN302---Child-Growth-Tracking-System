import React, { useContext, useState } from "react";
import { Card, Avatar, Typography, Descriptions, Spin, Button, Modal, Input, message } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import HeaderComponent from "../components/Header";
import { AuthContext } from "../contexts/AuthContext";
import api from "../configs/api";

const { Title } = Typography;

// Yup validation schema for updating profile
const updateProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
});

// Yup validation schema for changing password
const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Current password is required"),
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
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const showUpdateModal = () => setIsUpdateModalVisible(true);
  const showChangePasswordModal = () => setIsChangePasswordModalVisible(true);

  const handleUpdate = async (values) => {
    try {
      await api.patch(`/users/${user._id}`, values);
      message.success("Profile updated successfully");
      setIsUpdateModalVisible(false);
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data?.validationErrors) {
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
      if (err.response && err.response.status === 400 && err.response.data?.validationErrors) {
        err.response.data.validationErrors.forEach(({ field, error }) => {
          message.error(`${error}`);
        });
      } else {
        message.error("Failed to update profile");
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

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Title level={4} style={{ color: "#ff4d4f" }}>
          {error}
        </Title>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Title level={4}>No user data available</Title>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderComponent />
      <Card>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Avatar
            src={user?.avatar}
            size={100}
            style={{ backgroundColor: "#f0f0f0", fontSize: "48px" }}
          >
            {!user?.avatar && user?.name?.charAt(0)}
          </Avatar>
          <Title level={3} style={{ marginTop: "16px" }}>
            {user?.name}
          </Title>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {user?.phoneNumber || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Joined On">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Button type="primary" onClick={showUpdateModal} style={{ marginRight: "16px" }}>
            Update Profile
          </Button>
          <Button type="default" onClick={showChangePasswordModal}>
            Change Password
          </Button>
        </div>
      </Card>

      {/* Update Profile Modal */}
      <Modal
        title="Update Profile"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <Formik
          initialValues={{ name: user.name, phoneNumber: user.phoneNumber }}
          validationSchema={updateProfileSchema}
          onSubmit={handleUpdate}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: "16px" }}>
                <label>Name</label>
                <Field name="name" as={Input} style={{ marginTop: "8px" }} />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  style={{ color: "#ff4d4f", marginTop: "4px" }} 
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label>Phone Number</label>
                <Field name="phoneNumber" as={Input} style={{ marginTop: "8px" }} />
                <ErrorMessage 
                  name="phoneNumber" 
                  component="div" 
                  style={{ color: "#ff4d4f", marginTop: "4px" }} 
                />
              </div>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
                style={{ width: "100%" }}
              >
                Save
              </Button>
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
      >
        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmNewPassword: "" }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: "16px" }}>
                <label>Current Password</label>
                <Field 
                  name="oldPassword" 
                  type="password" 
                  as={Input.Password} 
                  style={{ marginTop: "8px" }} 
                />
                <ErrorMessage 
                  name="oldPassword" 
                  component="div" 
                  style={{ color: "#ff4d4f", marginTop: "4px" }} 
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label>New Password</label>
                <Field 
                  name="newPassword" 
                  type="password" 
                  as={Input.Password} 
                  style={{ marginTop: "8px" }} 
                />
                <ErrorMessage 
                  name="newPassword" 
                  component="div" 
                  style={{ color: "#ff4d4f", marginTop: "4px" }} 
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label>Confirm New Password</label>
                <Field 
                  name="confirmNewPassword" 
                  type="password" 
                  as={Input.Password} 
                  style={{ marginTop: "8px" }} 
                />
                <ErrorMessage 
                  name="confirmNewPassword" 
                  component="div" 
                  style={{ color: "#ff4d4f", marginTop: "4px" }} 
                />
              </div>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
                style={{ width: "100%" }}
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Profile;