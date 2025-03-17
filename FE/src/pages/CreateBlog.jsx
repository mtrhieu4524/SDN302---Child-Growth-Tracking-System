import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button, Card, Typography, Input, message, Upload } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header";
import FooterComponent from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import api from "../configs/api";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      message.error("Please fill in all fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", "PUBLISHED");
  
    // Append each file to the FormData object
    files.forEach((file) => {
      formData.append("postAttachments", file);
    });
  
    setLoading(true);
    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      if (response.data) {
        message.success("Blog post created successfully!");
        navigate("/blogs");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle validation errors
        const validationErrors = error.response.data.validationErrors;
        if (validationErrors && validationErrors.length > 0) {
          validationErrors.forEach((err) => {
            message.error(`${err.error}`);
          });
        } else {
          message.error("Validation failed. Please check your inputs.");
        }
      } else {
        console.error("Error creating blog post:", error);
        message.error("Failed to create blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    const fileList = info.fileList.slice(-5); // Limit to 5 files
    setFiles(fileList.map((file) => file.originFileObj));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <HeaderComponent />
      <div style={{ flex: 1, maxWidth: "1000px", margin: "auto", width: "100%" }}>
        <Title level={2} style={{ marginBottom: "24px" }}>
          Create a New Blog Post
        </Title>

        <Card>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Title
            </label>
            <Input
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "24px" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Content
            </label>
            <ReactQuill
              theme="snow" // Use the "snow" theme for Quill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "image",
              ]}
              style={{ height: "300px", marginBottom: "24px" }}
            />
          </div>

          <div style={{ marginBottom: "24px", paddingTop: "24px" }}>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "8px",
                marginTop: "8px",
                display: "block",
              }}
            >
              Upload Images
            </label>
            <Upload
              multiple
              beforeUpload={() => false} // Prevent auto-upload
              onChange={handleFileChange}
              fileList={files}
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ width: "100%", height: "40px" }}
          >
            Publish Blog
          </Button>
        </Card>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default CreateBlog;