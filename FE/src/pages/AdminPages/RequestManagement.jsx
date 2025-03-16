import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
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
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;

const RequestManagement = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestDetail, setRequestDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
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

  const handleViewDetails = async (requestId) => {
    setDetailLoading(true);
    try {
      const response = await api.get(`/requests/${requestId}`);
      const detail = response.data.request;
      setRequestDetail(detail);

      Modal.info({
        title: "Consultation Request Details",
        width: 600,
        icon: null,
        closeIcon: <CloseOutlined style={{ color: "#666666" }} />,
        content: (
          <div style={{ padding: "0" }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '150px 1fr',
              rowGap: '24px',
              marginBottom: '20px'
            }}>
              <div>Request ID</div>
              <div>{detail._id}</div>

              <div>Title</div>
              <div>{detail.title}</div>

              <div>Status</div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Tag color={
                  detail.status.toLowerCase() === "pending" ? "#faad14" :
                  detail.status.toLowerCase() === "approved" ? "#52c41a" :
                  "#ff4d4f"
                }>
                  {detail.status === "Pending" ? "Pending" : 
                   detail.status === "Approved" ? "Approved" :
                   detail.status === "Canceled" ? "Canceled" : "Rejected"}
                </Tag>
                <span>Created Date</span>
                <span>{moment(detail.createdAt).format("DD/MM/YYYY HH:mm")}</span>
              </div>

              <div>Requestor Information</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={detail.member.avatar} size={40} style={{ backgroundColor: '#f0f0f0' }}>
                  {!detail.member.avatar && detail.member.name.charAt(0)}
                </Avatar>
                <div>
                  <div><strong>Name:</strong> {detail.member.name}</div>
                  <div><strong>ID:</strong> {detail.member._id}</div>
                </div>
              </div>

              <div>Doctor Information</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar src={detail.doctor.avatar} size={40} style={{ backgroundColor: '#f0f0f0' }}>
                  {!detail.doctor.avatar && detail.doctor.name.charAt(0)}
                </Avatar>
                <div>
                  <div><strong>Name:</strong> {detail.doctor.name}</div>
                  <div><strong>ID:</strong> {detail.doctor._id}</div>
                </div>
              </div>

              <div>Child Information</div>
              <div>
                {detail.children.map((child) => (
                  <div key={child._id}>
                    <div><strong>Name:</strong> {child.name}</div>
                    <div><strong>Birth Date:</strong> {moment(child.birthDate).format("DD/MM/YYYY")}</div>
                    <div><strong>Gender:</strong> {child.gender === 1 ? "Male" : "Female"}</div>
                    <div>
                      <strong>Relationship:</strong> {
                        child.relationships?.find(r => r.memberId === detail.member._id)?.type || "Other"
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div>Last Updated</div>
              <div>{moment(detail.updatedAt).format("DD/MM/YYYY HH:mm")}</div>
            </div>
          </div>
        ),
        okText: "Close",
        okButtonProps: {
          style: {
            background: "#0056A1",
            borderColor: "#0056A1",
          },
        },
        onOk() {
          setRequestDetail(null);
        },
      });
    } catch (error) {
      console.error("Error fetching request details:", error);
      message.error("Failed to load request details");
    } finally {
      setDetailLoading(false);
    }
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
            ? "Pending"
            : status === "approved"
            ? "Approved"
            : status === "canceled"
            ? "Canceled"
            : "Rejected"}
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
        Consultation Request Management
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
