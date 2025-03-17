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
  Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import AdminLayout from "../../layouts/AdminLayout";

const { Title } = Typography;
const { Option } = Select;

const ConsultationManagement = () => {
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("descending"); // Fixed typo
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");

  const fetchConsultations = async (
    page = 1,
    size = pagination.pageSize,
    status = "",
    sortBy = "date",
    sortOrder = "descending"
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/consultations", {
        params: { page, size, search: "", sortBy, order: sortOrder, status },
      });

      if (response.data && response.data.consultations) {
        const formattedConsultations = response.data.consultations.map(
          (consultation) => ({
            key: consultation._id,
            username: consultation.requestDetails.member.name, // Updated path
            childName: consultation.requestDetails.children[0]?.name || "N/A", // Updated path
            status: consultation.status.toLowerCase(),
            createdAt: moment(consultation.createdAt).format(
              "DD/MM/YYYY | hh:mm:ss A"
            ),
            updatedAt: moment(consultation.updatedAt).format(
              "DD/MM/YYYY | hh:mm:ss A"
            ),
            doctorName: consultation.requestDetails.doctor.name, // Updated path
          })
        );

        setConsultations(formattedConsultations);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.consultations.length,
        });
      } else {
        message.error("No consultations found");
        setConsultations([]);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      message.error("Failed to load consultations");
      setConsultations([]);
      setPagination({ ...pagination, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Consultation Management";
    fetchConsultations(pagination.current, pagination.pageSize, statusFilter);
  }, [statusFilter]);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchConsultations(page, pageSize, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "ascending" ? "descending" : "ascending";
    setSortOrder(newOrder);
    fetchConsultations(1, pagination.pageSize, statusFilter, sortBy, newOrder);
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
            status === "ongoing"
              ? "#faad14"
              : "#52c41a"
          }
        >
          {status === "ongoing"
            ? "Ongoing"
            : "Ended" 
          }
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
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
        Consultation Management
      </Title>
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
        <Select placeholder="Filter by status" style={{ width: 200 }} onChange={handleStatusFilterChange} allowClear>
          <Option value="">All</Option>
          <Option value="Ongoing">Ongoing</Option>
          <Option value="Ended">Ended</Option>
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
            dataSource={consultations}
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

export default ConsultationManagement;