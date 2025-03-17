import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Spin,
  Avatar,
  message,
  Empty,
  List,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Image,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import api from "../configs/api";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

const BlogDetailed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Child Growth Tracking - Blog Detail";
    fetchPostById();
    fetchComments();
  }, [id]);

  const fetchPostById = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/${id}`);
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

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/comments`, { params: { postId: id } });
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (values) => {
    setSubmittingComment(true);
    try {
      const response = await api.post(`/comments`, {
        postId: id,
        content: values.comment,
      });
      if (response.data && response.data.comment) {
        setComments([...comments, response.data.comment]);
        form.resetFields();
        message.success("Comment submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      if (response.data && response.data.comment) {
        const updatedComments = comments.map((comment) =>
          comment._id === commentId ? response.data.comment : comment
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        message.success("Comment updated successfully");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      message.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
      message.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Failed to delete comment");
    }
  };

  const formatDate = (dateString) => moment(dateString).format("MMM DD, YYYY");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ background: "#f0f2f5", padding: "40px 24px 40px", flex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : post ? (
            <>
              <Button
                type="link"
                onClick={() => navigate("/blogs")}
                icon={<ArrowLeftOutlined />}
                style={{ marginBottom: "24px", color: "#0082C8", padding: 0 }}
              >
                Previous
              </Button>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none",
                }}
                bodyStyle={{ padding: "32px" }}
              >
                {post.thumbnailUrl && (
                  <div style={{ marginBottom: "32px", textAlign: "center" }}>
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fallback="https://watchdiana.fail/blog/wp-content/themes/koji/assets/images/default-fallback-image.png"
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}

                <Title level={2} style={{ color: "#00274E", fontWeight: "bold", marginBottom: "16px" }}>
                  {post.title}
                </Title>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                  <Avatar
                    src={post.user?.avatar}
                    icon={!post.user?.avatar && <UserOutlined />}
                    size={40}
                  />
                  <div style={{ marginLeft: "12px" }}>
                    <Text style={{ fontWeight: "600", color: "#00274E" }}>
                      {post.user?.name || "Anonymous"}
                    </Text>
                    <Text style={{ display: "block", fontSize: "12px", color: "#6B7280" }}>
                      <CalendarOutlined style={{ marginRight: "4px" }} />
                      {formatDate(post.createdAt)}
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    color: "#4B5563",
                    fontSize: "16px",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Card>

              {/* Custom Comments Section */}
              <Card style={{ marginTop: "24px", borderRadius: "12px" }}>
                <Title level={4}>Comments</Title>
                {loadingComments ? (
                  <Spin />
                ) : comments.length > 0 ? (
                  <List
                    dataSource={comments}
                    renderItem={(comment) => (
                      <Card
                        style={{ marginBottom: "16px", borderRadius: "8px" }}
                        bodyStyle={{ padding: "16px" }}
                      >
                        <Row align="middle" gutter={16}>
                          <Col>
                            <Avatar
                              src={comment.user?.avatar}
                              icon={!comment.user?.avatar && <UserOutlined />}
                            />
                          </Col>
                          <Col>
                            <Text strong>{comment.user?.name || "Anonymous"}</Text>
                            <br />
                            <Text type="secondary">
                              {formatDate(comment.createdAt)}
                            </Text>
                          </Col>
                          {/* Show Edit/Delete buttons only for the logged-in user's comments */}
                          {user && user._id === comment.userId && (
                            <Col flex="auto" style={{ textAlign: "right" }}>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => setEditingCommentId(comment._id)}
                              />
                              <Popconfirm
                                title="Are you sure you want to delete this comment?"
                                onConfirm={() => handleDeleteComment(comment._id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="text" icon={<DeleteOutlined />} />
                              </Popconfirm>
                            </Col>
                          )}
                        </Row>
                        {editingCommentId === comment._id ? (
                          <Form
                            initialValues={{ comment: comment.content }}
                            onFinish={(values) =>
                              handleUpdateComment(comment._id, values.comment)
                            }
                          >
                            <Form.Item name="comment">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Save
                              </Button>
                              <Button
                                style={{ marginLeft: "8px" }}
                                onClick={() => setEditingCommentId(null)}
                              >
                                Cancel
                              </Button>
                            </Form.Item>
                          </Form>
                        ) : (
                          <div style={{ marginTop: "12px" }}>
                            <Text>{comment.content}</Text>
                          </div>
                        )}
                      </Card>
                    )}
                  />
                ) : (
                  <Empty description="No comments yet" />
                )}

                {/* Comment Submission Form */}
                <Form form={form} onFinish={handleSubmitComment} style={{ marginTop: "24px" }}>
                  <Form.Item name="comment" rules={[{ required: true, message: "Please enter your comment" }]}>
                    <TextArea rows={4} placeholder="Write a comment..." />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submittingComment}>
                      Submit Comment
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </>
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