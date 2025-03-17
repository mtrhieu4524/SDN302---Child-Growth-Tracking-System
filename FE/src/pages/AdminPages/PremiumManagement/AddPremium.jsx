import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminLayout from "../../../layouts/AdminLayout";
import api from "../../../configs/api";

const { Title } = Typography;
const { TextArea } = Input;

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, "Name must be at least 6 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .integer("Price must be an integer")
    .required("Price is required"),
  duration: Yup.number()
    .positive("Duration must be a positive number")
    .integer("Duration must be an integer")
    .required("Duration is required"),
  postLimit: Yup.number()
    .positive("Post limit must be a positive number")
    .integer("Post limit must be an integer")
    .required("Post limit is required"),
  updateChildDataLimit: Yup.number()
    .positive("Update child data limit must be a positive number")
    .integer("Update child data limit must be an integer")
    .required("Update child data limit is required"),
});

const AddPremium = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin - Add Premium Package";
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedData = {
        name: values.name,
        description: values.description,
        price: values.price,
        unit: "VND",
        duration: values.duration,
        postLimit: values.postLimit,
        updateChildDataLimit: values.updateChildDataLimit,
      };

      const response = await api.post("/membership-packages", formattedData);

      if (response.status === 201) {
        message.success("Premium package added successfully!");
        navigate("/admin/premium-list");
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      if (error.response?.status === 401) {
        message.error("Your session has expired. Please login again.");
        navigate("/login");
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.validationErrors
      ) {
        error.response.data.validationErrors.forEach((err) => {
          message.error(`${err.field}: ${err.error}`);
        });
      } else {
        message.error(
          error.response?.data?.message || "Failed to add premium package"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#EF6351", marginBottom: "24px" }}>
        Add New Premium Package
      </Title>

      <Formik
        initialValues={{
          name: "",
          description: "",
          price: null, // Changed from 0 to null to avoid default invalid state
          duration: 1,
          postLimit: 1,
          updateChildDataLimit: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ handleSubmit, isSubmitting, setFieldValue }) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            >
            <Form.Item label="Package Name" required>
              <Field
                name="name"
                as={Input}
                placeholder="Enter premium package name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item label="Description" required>
              <Field
                name="description"
                as={TextArea}
                rows={4}
                placeholder="Enter detailed description of premium package"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item label="Price (VND)" required>
              <Field name="price">
                {({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={1} // Enforce positive number at the UI level
                    step={1000}
                    value={field.value}
                    onChange={(value) => setFieldValue("price", value)} // Sync value with Formik
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Enter package price"
                  />
                )}
              </Field>
              <ErrorMessage
                name="price"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item label="Duration (days)" required>
              <Field name="duration">
                {({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={1}
                    value={field.value}
                    onChange={(value) => setFieldValue("duration", value)}
                    placeholder="Enter number of days"
                  />
                )}
              </Field>
              <ErrorMessage
                name="duration"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item label="Post Limit" required>
              <Field name="postLimit">
                {({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={1}
                    value={field.value}
                    onChange={(value) => setFieldValue("postLimit", value)}
                    placeholder="Enter post limit"
                  />
                )}
              </Field>
              <ErrorMessage
                name="postLimit"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item label="Update Child Data Limit" required>
              <Field name="updateChildDataLimit">
                {({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={1}
                    value={field.value}
                    onChange={(value) =>
                      setFieldValue("updateChildDataLimit", value)
                    }
                    placeholder="Enter update child data limit"
                  />
                )}
              </Field>
              <ErrorMessage
                name="updateChildDataLimit"
                component="div"
                className="ant-form-item-explain ant-form-item-explain-error"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}>
                <Button onClick={() => navigate("/admin/premium-list")}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  style={{
                    background: "#EF6351",
                    border: "none"
                  }}
                >
                  Add Package
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </AdminLayout>
  );
};

export default AddPremium;
