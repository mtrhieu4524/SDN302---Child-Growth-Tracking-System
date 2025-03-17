import { Input, Select, message, Modal, Pagination, Spin, Table, Tag, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";
import { Role } from "../../enums/Role";

const { Title } = Typography;
const { Option } = Select;

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
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "date",
    order: "descending",
  });

  const fetchUsers = async (page = 1, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: {
          page,
          size,
          search: filters.search,
          order: filters.order,
          sortBy: filters.sortBy,
          role: filters.role,
        },
      });

      if (response.data && response.data.users) {
        const formattedUsers = response.data.users.map((user) => ({
          key: user._id,
          username: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber || "N/A",
          role: ROLE_MAP[user.role] || "member",
          isGoogleUser: user.googleId ? true : false,
          createdAt: moment(user.createdAt).format("DD/MM/YYYY | hh:mm:ss A"),
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
    setPagination({ ...pagination, current: page, pageSize });
    fetchUsers(page, pageSize);
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (value) => {
    setFilters({ ...filters, sortBy: value });
  };

  const handleOrderChange = (value) => {
    setFilters({ ...filters, order: value });
  };

  const handleRoleFilterChange = (value) => {
    setFilters({ ...filters, role: value });
  };

  const applyFilters = () => {
    fetchUsers(1, pagination.pageSize);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => (
        <Tag color={role === "admin" ? "#EF6351" : role === "doctor" ? "#52c41a" : "#0082C8"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Google User",
      dataIndex: "isGoogleUser",
      key: "isGoogleUser",
      align: "center",
      render: (value) => (
        <Tag color={value ? "#52c41a" : "#faad14"}>
          {value ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#EF6351", marginBottom: "24px" }}>
        User Management
      </Title>

      {/* Filters and Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <Input
          placeholder="Search by name or email"
          value={filters.search}
          onChange={handleSearchChange}
          style={{ width: 250 }}
        />

        <Select value={filters.sortBy} onChange={handleSortChange} style={{ width: 150 }}>
          <Option value="date">Sort by Date</Option>
          <Option value="name">Sort by Name</Option>
        </Select>

        <Select value={filters.order} onChange={handleOrderChange} style={{ width: 150 }}>
          <Option value="ascending">Ascending</Option>
          <Option value="descending">Descending</Option>
        </Select>

        <Select placeholder="Filter by Role" value={filters.role} onChange={handleRoleFilterChange} style={{ width: 150 }}>
          <Option value="">All Roles</Option>
          <Option value={Role.DOCTOR}>Doctor</Option>
          <Option value={Role.MEMBER}>Member</Option>
        </Select>

        <button
          onClick={applyFilters}
          style={{
            padding: "6px 12px",
            background: "#EF6351",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          Apply Filters
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table columns={columns} dataSource={users} pagination={false} style={{ background: "#fff", borderRadius: "8px" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={handlePageChange} />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
