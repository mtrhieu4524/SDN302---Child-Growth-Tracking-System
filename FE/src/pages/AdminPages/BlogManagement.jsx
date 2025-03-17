import { EyeOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Avatar,
  Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;
const { Option } = Select;

const BlogManagement = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postDetail, setPostDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("descending");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPosts = async (
    page = 1,
    size = pagination.pageSize,
    status = "",
    sortBy = "date",
    sortOrder = "descending"
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/posts", {
        params: { page, size, search: "", sortBy, order: sortOrder, status },
      });

      if (response.data && response.data.posts) {
        const formattedPosts = response.data.posts.map((post) => ({
          key: post._id,
          title: post.title,
          user: post.user,
          status: post.status.toUpperCase(), 
          createdAt: moment(post.createdAt).format("YYYY-MM-DD HH:mm"),
          updatedAt: moment(post.updatedAt).format("YYYY-MM-DD HH:mm"),
        }));

        setPosts(formattedPosts);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.posts.length,
        });
      } else {
        message.error("No posts found");
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to load posts");
      setPosts([]);
      setPagination({ ...pagination, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Post Management";
    fetchPosts(pagination.current, pagination.pageSize, statusFilter);
  }, [statusFilter, pagination.current, pagination.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchPosts(page, pageSize, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchPosts(1, pagination.pageSize, value);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "ascending" ? "descending" : "ascending";
    setSortOrder(newOrder);
    fetchPosts(1, pagination.pageSize, statusFilter, sortBy, newOrder);
  };

  const handleViewDetails = async (postId) => {
    setDetailLoading(true);
    try {
      const response = await api.get(`/posts/${postId}`);
      if (response.data && response.data.post) {
        setPostDetail(response.data.post);
        Modal.info({
          title: "Post Details",
          content: (
            <div>
              <p>
                <strong>Title:</strong> {response.data.post.title}
              </p>
              <p>
                <strong>Content:</strong>
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: response.data.post.content }}
              />
            </div>
          ),
          width: 800,
        });
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
      message.error("Failed to load post details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (postId, status) => {
    try {
      const response = await api.put(`/posts/status/${postId}`, { status });

      if (response.data) {
        message.success(`Post status updated to ${status}`);
        
        fetchPosts(pagination.current, pagination.pageSize, statusFilter);
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      message.error("Failed to update post status");
    }
  };

  const columns = [
    {
      title: "Post",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Author",
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (_, record) => (
        <Space>
          <Avatar src={record.user?.avatar} />
          <span>{record.user?.name || "Unknown"}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "";
        let text = "";

        switch (status) {
          case "PENDING":
            color = "#faad14"; 
            text = "Pending";
            break;
          case "PUBLISHED":
            color = "#52c41a"; 
            text = "Published";
            break;
          case "REJECTED":
            color = "#ff4d4f"; 
            text = "Rejected";
            break;
          case "DELETED":
            color = "#f5222d"; 
            text = "Deleted";
            break;
          default:
            color = "#d9d9d9"; 
            text = "Unknown";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.key)}
            style={{
              color: "#0082C8",
              borderColor: "#0082C8",
            }}
          >
            View Details
          </Button>
          <Button
            type="primary"
            onClick={() => handleUpdateStatus(record.key, "PUBLISHED")}
            disabled={record.status === "PUBLISHED" || record.status === "DELETED"}
          >
            Publish
          </Button>
          <Button
            danger
            onClick={() => handleUpdateStatus(record.key, "REJECTED")}
            disabled={record.status === "REJECTED" || record.status === "PUBLISHED" || record.status === "DELETED"}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0082C8", marginBottom: "24px" }}>
        Blog Post Management
      </Title>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Select
          placeholder="Filter by status"
          style={{ width: 200 }}
          onChange={handleStatusFilterChange}
          allowClear
        >
          <Option value="">All</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="PUBLISHED">Published</Option>
          <Option value="REJECTED">Rejected</Option>
          <Option value="DELETED">Deleted</Option>
        </Select>

        <Button onClick={handleSortOrderChange}>
          {sortOrder === "ascending" ? "Ascending" : "Descending"}
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={posts}
            pagination={false}
            style={{
              background: "#fff",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default BlogManagement;