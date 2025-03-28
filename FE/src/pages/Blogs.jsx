import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Pagination,
  Spin,
  Input,
  Empty,
  Avatar,
  Tag,
} from "antd";
import {
  RightOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import axios from "axios";
import moment from "moment";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async (page = 1, size = 6, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/posts", {
        params: {
          page,
          size,
          search,
          order: "descending",
          sortBy: "date",
          status: "PUBLISHED",
        },
      });

      console.log("Fetched posts:", response.data);

      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || 0,
        });

        if (page === 1 && response.data.posts.length > 0) {
          setFeaturedPost(response.data.posts[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Child Growth Tracking - Blogs";
    fetchPosts(pagination.current, pagination.pageSize, searchQuery);
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchPosts(page, pageSize, searchQuery);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    fetchPosts(1, pagination.pageSize, value);
  };

  // Function to extract text content from HTML string
  const extractTextFromHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Function to get a short description from content
  const getShortDescription = (html) => {
    const plainText = extractTextFromHtml(html);
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  // Function to format date
  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ background: "#f0f2f5", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Search bar */}
          <div
            style={{
              marginBottom: "40px",
              display: "flex",
              justifyContent: "center",
            }}>
            <Search
              placeholder="Search blog posts"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: "500px", width: "100%" }}
            />
          </div>

          {/* Featured Post */}
          {loading && !featuredPost ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Spin size="large" />
            </div>
          ) : featuredPost ? (
            <div style={{ marginBottom: "48px" }}>
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={12}>
                  <div
                    style={{
                      height: "300px",
                      overflow: "hidden",
                      borderRadius: "12px",
                    }}>
                    <img
                      src={featuredPost.thumbnailUrl}
                      alt={featuredPost.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ padding: "24px" }}>
                    <Tag
                      color="#0082C8"
                      style={{ marginBottom: "12px", fontWeight: "500" }}>
                      Featured
                    </Tag>
                    <Title
                      level={2}
                      style={{
                        color: "#00274E",
                        fontWeight: "bold",
                        marginBottom: "16px",
                      }}>
                      {featuredPost.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "#4B5563",
                        fontSize: "16px",
                        marginBottom: "24px",
                      }}>
                      {getShortDescription(featuredPost.content)}
                    </Paragraph>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "24px",
                      }}>
                      <Avatar
                        src={featuredPost.user?.avatar}
                        icon={!featuredPost.user?.avatar && <UserOutlined />}
                        size={40}
                      />
                      <div style={{ marginLeft: "12px" }}>
                        <Text style={{ fontWeight: "600", color: "#00274E" }}>
                          {featuredPost.user?.name || "Anonymous"}
                        </Text>
                        <Text
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#6B7280",
                          }}>
                          <CalendarOutlined style={{ marginRight: "4px" }} />
                          {formatDate(featuredPost.createdAt)}
                        </Text>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      href={`/blogs/${featuredPost._id}`}
                      icon={<RightOutlined />}
                      size="large"
                      style={{
                        backgroundColor: "#0082C8",
                        borderColor: "#0082C8",
                        borderRadius: "6px",
                        padding: "0 24px",
                        height: "48px",
                      }}>
                      Read Article
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ) : null}

          {/* Latest Posts */}
          <div style={{ marginBottom: "48px" }}>
            <Title
              level={3}
              style={{
                textAlign: "left",
                color: "#00274E",
                fontWeight: "bold",
                marginBottom: "16px",
              }}>
              Latest Blog Posts
            </Title>
            <hr
              style={{
                border: "2px solid #0082C8",
                width: "80px",
                margin: "0 0 32px 0",
              }}
            />

            {loading ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
              </div>
            ) : posts.length > 0 ? (
              <Row gutter={[24, 24]}>
                {posts.map((post) => (
                  <Col xs={24} sm={12} lg={8} key={post._id}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ height: "200px", overflow: "hidden" }}>
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      }
                      bodyStyle={{
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        border: "none",
                      }}>
                      <div style={{ flex: 1 }}>
                        <Tag
                          color="#0082C8"
                          style={{ marginBottom: "12px", fontWeight: "500" }}>
                          {post.status}
                        </Tag>
                        <Title
                          level={4}
                          style={{
                            color: "#00274E",
                            marginBottom: "12px",
                            fontWeight: "600",
                          }}>
                          {post.title}
                        </Title>
                        <Paragraph
                          style={{
                            color: "#4B5563",
                            fontSize: "14px",
                            marginBottom: "16px",
                          }}
                          ellipsis={{ rows: 2 }}>
                          {getShortDescription(post.content)}
                        </Paragraph>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "16px",
                        }}>
                        <Avatar
                          src={post.user?.avatar}
                          icon={!post.user?.avatar && <UserOutlined />}
                          size={32}
                        />
                        <div style={{ marginLeft: "8px" }}>
                          <Text
                            style={{
                              fontSize: "12px",
                              color: "#00274E",
                              fontWeight: "500",
                            }}>
                            {post.user?.name || "Anonymous"}
                          </Text>
                          <Text
                            style={{
                              display: "block",
                              fontSize: "12px",
                              color: "#6B7280",
                            }}>
                            {formatDate(post.createdAt)}
                          </Text>
                        </div>
                      </div>
                      <Button
                        type="link"
                        href={`/blogs/${post._id}`}
                        icon={<RightOutlined />}
                        style={{
                          color: "#0082C8",
                          fontWeight: "600",
                          padding: 0,
                          justifyContent: "flex-start",
                        }}>
                        Read More
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="No blog posts found"
                style={{ margin: "48px 0" }}
              />
            )}
          </div>

          {/* Pagination */}
          {posts.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                style={{ marginBottom: "40px" }}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blogs;
