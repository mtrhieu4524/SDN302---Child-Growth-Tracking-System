import { message, Modal, Pagination, Spin, Table, Tag, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;

const ROLE_MAP = {
  0: "member",
  1: "admin",
  2: "doctor",
};

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (page = 1, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
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
        const formattedUsers = response.data.users.map((user) => {
          const role = ROLE_MAP[user.role] || "member";
          let premium = null;

          if (role === "member" && user.subscription) {
            premium =
              user.subscription.startDate &&
              user.subscription.endDate &&
              moment().isBetween(
                moment(user.subscription.startDate),
                moment(user.subscription.endDate)
              );
          }

          return {
            key: user._id,
            username: user.name,
            email: user.email,
            role,
            status: user.status || "active",
            premium,
            createdAt: moment(user.createdAt).format("YYYY-MM-DD"),
          };
        });
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

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin"
              ? "#0056A1"
              : role === "doctor"
              ? "#52c41a"
              : "#0082C8"
          }>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "#52c41a" : "#faad14"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Package",
      dataIndex: "premium",
      key: "premium",
      render: (premium, record) => {
        if (record.role === "doctor") {
          return <Tag color="#d9d9d9">Không áp dụng</Tag>;
        }
        return (
          <Tag color={premium ? "#722ed1" : "#1890ff"}>
            {premium ? "Premium" : "Free"}
          </Tag>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
        User Management
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
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
