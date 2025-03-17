import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/api";
import AdminLayout from "../../../layouts/AdminLayout";
import moment from "moment";

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
        params: {
          page,
          size,
          search: "",
          order: "descending",
          sortBy: "date",
        },
      });

      if (response.data && response.data.packages) {
        const formattedPackages = response.data.packages
          .filter(pkg => !pkg.isDeleted)
          .map((pkg) => ({
            key: pkg._id,
            name: pkg.name,
            price: pkg.price.value,
            duration: pkg.duration.value,
            features: [
              pkg.description,
              `Post limit: ${pkg.postLimit}`,
              `Update child data limit: ${pkg.updateChildDataLimit}`,
            ],
            status: "active",
            createdAt: moment(pkg.createdAt).format("DD/MM/YYYY | hh:mm:ss A"),
          }));
        setPackages(formattedPackages);
        setPagination({
          current: page,
          pageSize: size,
          total: formattedPackages.length,
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
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Premium Package List";
    fetchPackages(pagination.current, pagination.pageSize);
  }, []);

  const handleDelete = (packageId) => {
    Modal.confirm({
      title: "Confirm Delete Premium Package",
      content: "Are you sure you want to delete this premium package?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "#ff4d4f", borderColor: "#ff4d4f" },
      },
      onOk: async () => {
        try {
          const response = await api.delete(`/membership-packages/${packageId}`);
          
          if (response.status === 200) {
            message.success('Premium package deleted successfully');
            setPackages(packages.filter(pkg => pkg.key !== packageId));
            setPagination(prev => ({
              ...prev,
              total: prev.total - 1
            }));
          }
        } catch (error) {
          console.error('Error deleting package:', error);
          message.error(error.response?.data?.message || 'Failed to delete package');
        }
      },
    });
  };

  const columns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Price (VNĐ)",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => new Intl.NumberFormat("vi-VN").format(price),
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Features",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color="#52c41a">
          Active
        </Tag>
      ),
    },
    {
      title: "Date created",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}>
            Delete
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
          Premium Package Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/add-premium")}
          style={{
            background: "linear-gradient(to right, #0056A1, #0082C8)",
            border: "none",
          }}>
          Add New Package
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
