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
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import api from "../../../configs/api";

const { Title } = Typography;

const PremiumList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPackages = async (page = 1, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/membership-packages", {
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

      console.log("Fetched packages:", response.data.packages);

      if (response.data && response.data.packages) {
        const formattedPackages = response.data.packages.map((pkg) => ({
          key: pkg._id,
          name: pkg.name,
          price: pkg.price.value, // Lấy giá từ price.value
          duration: pkg.duration.value, // Lấy thời hạn từ duration.value
          features: [
            pkg.description,
            `Post limit: ${pkg.postLimit}`,
            `Update child data limit: ${pkg.updateChildDataLimit}`,
          ], // Tạo mảng features từ description, postLimit, updateChildDataLimit
          status: pkg.isDeleted ? "inactive" : "active", // Suy ra status từ isDeleted
        }));
        setPackages(formattedPackages);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.total || response.data.packages.length, // Cập nhật total
        });
      } else {
        message.error("No packages found");
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to load packages");
      setPackages([]);
      setPagination({
        ...pagination,
        total: 0, // Đặt lại total nếu có lỗi
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Premium Package List";
    fetchPackages(pagination.current, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
    fetchPackages(page, pageSize);
  };

  const handleDelete = (packageId) => {
    Modal.confirm({
      title: "Xác nhận xóa gói Premium",
      content: "Bạn có chắc chắn muốn xóa gói Premium này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        style: { background: "#ff4d4f", borderColor: "#ff4d4f" },
      },
      onOk: () => {
        message.success("Đã xóa gói Premium");
      },
    });
  };

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => new Intl.NumberFormat("vi-VN").format(price),
    },
    {
      title: "Thời hạn (ngày)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Tính năng",
      dataIndex: "features",
      key: "features",
      align: "center",
      render: (features) => (
        <>
          {features.map((feature) => (
            <Tag color="#0082C8" key={feature}>
              {feature}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "active" ? "#52c41a" : "#d9d9d9"}>
          {status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <Title level={2} style={{ color: "#0056A1", margin: 0 }}>
          Quản lý gói Premium
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/add-premium")}
          style={{
            background: "linear-gradient(to right, #0056A1, #0082C8)",
            border: "none",
          }}>
          Thêm gói mới
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
            dataSource={packages}
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
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default PremiumList;
