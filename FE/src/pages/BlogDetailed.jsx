import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Spin,
  Avatar,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import axios from "axios";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const BlogDetailed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  const fetchPostById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/posts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("access_token") || "{}")?.token ||
              ""
            }`,
          },
        }
      );

      console.log("Fetched post:", response.data);
      if (response.data && response.data.post) {
        setPost(response.data.post);
      } else {
        message.error("Post not found");
        navigate("/blogs");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      message.error("Failed to load post");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Child Growth Tracking - Blog Detail";
    fetchPostById();
  }, [id]);

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div
        style={{ background: "#f0f2f5", padding: "40px 24px 40px", flex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : post ? (
            <div>
              <Button
                type="link"
                onClick={() => navigate("/blogs")}
                icon={<ArrowLeftOutlined />}
                style={{ marginBottom: "24px", color: "#0082C8", padding: 0 }}>
                Previous
              </Button>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
                bodyStyle={{ padding: "32px" }}>
                {post.thumbnailUrl && (
                  <div style={{ marginBottom: "32px", textAlign: "center" }}>
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}

                {/* Title */}
                <Title
                  level={2}
                  style={{
                    color: "#00274E",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}>
                  {post.title}
                </Title>

                {/* Author and Date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}>
                  <Avatar
                    src={post.user?.avatar}
                    icon={!post.user?.avatar && <UserOutlined />}
                    size={40}
                  />
                  <div style={{ marginLeft: "12px" }}>
                    <Text style={{ fontWeight: "600", color: "#00274E" }}>
                      {post.user?.name || "Anonymous"}
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#6B7280",
                      }}>
                      <CalendarOutlined style={{ marginRight: "4px" }} />
                      {formatDate(post.createdAt)}
                    </Text>
                  </div>
                </div>

                {/* Content */}
                <div
                  style={{
                    color: "#4B5563",
                    fontSize: "16px",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Card>
            </div>
          ) : (
            <Empty description="Post not found" style={{ margin: "48px 0" }} />
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogDetailed;
