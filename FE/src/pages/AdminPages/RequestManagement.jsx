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
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;

const RequestManagement = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchRequests = async (page = 1, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/requests", {
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

      console.log("Fetched requests:", response.data.requests);

      if (response.data && response.data.requests) {
        const formattedRequests = response.data.requests.map((request) => ({
          key: request._id,
          username: request.member.name,
          childName: request.children[0]?.name || "Không có thông tin",
          status: request.status.toLowerCase(),
          createdAt: moment(request.createdAt).format(
            "DD/MM/YYYY | hh:mm:ss A"
          ),
          updatedAt: moment(request.updatedAt).format(
            "DD/MM/YYYY | hh:mm:ss A"
          ),
          doctorName: request.doctor.name,
        }));
        console.log("Formatted requests:", formattedRequests);

        setRequests(formattedRequests);
        console.log("Total requests:", response.data.total);

        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.requests.length, // Sửa total
        });
      } else {
        message.error("No requests found");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to load requests");
      setRequests([]);
      setPagination({
        ...pagination,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Request Management";
    fetchRequests(pagination.current, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchRequests(page, pageSize);
  };

  const handleViewDetails = (requestId) => {
    Modal.info({
      title: "Chi tiết yêu cầu tư vấn",
      content: (
        <div>
          <p>ID: {requestId}</p>
          <p>Nội dung chi tiết sẽ được hiển thị ở đây</p>
        </div>
      ),
      okButtonProps: {
        style: {
          background: "linear-gradient(to right, #0056A1, #0082C8)",
          border: "none",
        },
      },
    });
  };

  const columns = [
    {
      title: "Requestor",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "#faad14"
              : status === "approved"
              ? "#52c41a"
              : "#ff4d4f"
          }>
          {status === "pending"
            ? "Đang chờ"
            : status === "approved"
            ? "Đã duyệt"
            : status === "canceled"
            ? "Đã hủy"
            : "Từ chối"}
        </Tag>
      ),
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
              color: "#0056A1",
              borderColor: "#0056A1",
            }}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
        Quản lý yêu cầu tư vấn
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={requests}
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

export default RequestManagement;
