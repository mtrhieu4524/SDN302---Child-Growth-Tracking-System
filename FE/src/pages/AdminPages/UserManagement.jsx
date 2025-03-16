import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Tag,
  Modal,
  message,
  Typography,
  Pagination,
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("access_token") || "{}")?.token ||
            ""
          }`,
        },
        params: {
          page,
          size,
          search: "",
          order: "descending",
          sortBy: "date",
        },
      });

      console.log("Fetched users:", response.data);

      if (response.data && response.data.users) {
        const formattedUsers = response.data.users.map((user) => ({
          key: user._id,
          username: user.username,
          email: user.email,
          role: user.role || "user",
          status: user.status || "active",
          premium: user.premium || false,
          createdAt: moment(user.createdAt).format("YYYY-MM-DD"),
        }));
        setUsers(formattedUsers);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.users.length,
        });
      } else {
        message.error("No users found");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - User Management";
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchUsers(page, pageSize);
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Xác nhận xóa người dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        style: { background: "#ff4d4f", borderColor: "#ff4d4f" },
      },
      onOk: () => {
        message.success("Đã xóa người dùng");
      },
    });
  };

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "#0056A1" : "#0082C8"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "#52c41a" : "#faad14"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Premium",
      dataIndex: "premium",
      key: "premium",
      render: (premium) => (
        <Tag color={premium ? "#722ed1" : "#d9d9d9"}>
          {premium ? "Premium" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => message.info("Chức năng đang phát triển")}
            style={{
              background: "linear-gradient(to right, #0056A1, #0082C8)",
              border: "none",
            }}>
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
        Quản lý người dùng
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={users}
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
            }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} người dùng`}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
