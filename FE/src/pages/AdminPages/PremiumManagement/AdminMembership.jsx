import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Spin,
  message,
  Empty
} from "antd";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../../configs/api";
import AdminLayout from "../../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const AdminMembership = () => {
  const [loading, setLoading] = useState(true);
  const [membershipPackages, setMembershipPackages] = useState([]);
  const navigate = useNavigate();

  const handleEditPlan = (id) => {
    // Chức năng chỉnh sửa gói membership (có thể thêm sau)
    message.info(`Edit package with ID: ${id}`);
  };

  const fetchMembershipPackages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/membership-packages", {
        params: {
          page: 1,
          size: 1000, // Lấy tất cả các gói
          search: "",
          order: "descending",
          sortBy: "date",
        },
      });

      if (response.data && response.data.packages) {
        // Lọc chỉ lấy các gói active
        const activePackages = response.data.packages.filter(pkg => !pkg.isDeleted);
        setMembershipPackages(activePackages);
      } else {
        message.error("No membership packages found");
        setMembershipPackages([]);
      }
    } catch (error) {
      console.error("Error fetching membership packages:", error);
      message.error("Failed to load membership packages");
      setMembershipPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin - Active Membership Packages";
    fetchMembershipPackages();
  }, []);

  const formatPrice = (price) => {
    return `${price.value.toLocaleString('vi-VN')} ${price.unit}`;
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}>
          <Title level={2} style={{ color: "#0056A1", margin: 0 }}>
            Active Membership Packages
          </Title>
          <Button
            type="primary"
            onClick={() => navigate("/admin/premium-list")}
            style={{
              background: "linear-gradient(to right, #0056A1, #0082C8)",
              border: "none",
              marginRight: "10px"
            }}>
            View All Packages
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : membershipPackages.length > 0 ? (
          <Row gutter={[24, 24]}>
            {membershipPackages.map((pkg) => (
              <Col xs={24} sm={12} md={8} key={pkg._id}>
                <Card
                  title={pkg.name}
                  bordered={false}
                  style={{
                    borderRadius: "8px",
                    textAlign: "center",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                  headStyle={{
                    backgroundColor: "#0082C8",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  hoverable
                >
                  <div
                    style={{
                      minHeight: "180px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Paragraph>{pkg.description}</Paragraph>
                    <Title
                      level={4}
                      style={{ color: "#0056A1", marginTop: "10px" }}
                    >
                      {formatPrice(pkg.price)}
                      <span style={{ fontSize: "16px", color: "#666" }}>
                        (
                        {pkg.convertedPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        VND)
                      </span>
                    </Title>
                    <Paragraph>
                      <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                      Duration: {pkg.duration.value} {pkg.duration.unit}
                    </Paragraph>
                    <Paragraph>
                      <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                      Post Limit: {pkg.postLimit}
                    </Paragraph>
                    <Paragraph>
                      <CheckCircleOutlined style={{ color: "#0082C8" }} />{" "}
                      Update Child Data: {pkg.updateChildDataLimit} times
                    </Paragraph>
                  </div>

                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    style={{
                      background: "#0082C8",
                      borderColor: "#0082C8",
                      width: "100%",
                      marginTop: "15px",
                    }}
                    onClick={() => handleEditPlan(pkg._id)}
                  >
                    Edit Package
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="No active membership packages available"
            style={{ margin: "48px 0" }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMembership; 