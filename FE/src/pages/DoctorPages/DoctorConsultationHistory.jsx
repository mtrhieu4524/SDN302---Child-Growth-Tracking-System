import { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Typography,
  message,
  Modal,
  Spin,
  Pagination,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../configs/api";

const { Title, Text } = Typography;

const DoctorConsultationHistory = () => {
  const { user } = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    document.title = "Child Growth Tracker - Consultation History";
    if (user && user._id) {
      fetchConsultationHistory();
    }
  }, [user, currentPage]);

  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultations/users/${user._id}`, {
        params: {
          id: user._id,
          page: currentPage,
          size: pageSize,
          search: "",
          order: "descending",
          sortBy: "date",
          status: "",
          as: "DOCTOR",
        },
      });

      if (
        response.data &&
        response.data.consultations &&
        Array.isArray(response.data.consultations)
      ) {
        setConsultations(response.data.consultations);
        setTotalRequests(response.data.totalConsultation || 0);
      } else {
        message.error("Failed to load consultation history");
      }
    } catch (error) {
      console.error("Error fetching consultation history:", error);
      message.error("Failed to load consultation history");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle view details action (show details in modal)
  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate age from birthdate
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }

    return years === 0
      ? `${months} months`
      : `${years} years, ${months} months`;
  };

  // Capitalize status and set color
  const getStatusProps = (status) => {
    const capitalizedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    let color;

    switch (status.toLowerCase()) {
      case "rejected":
        color = "danger";
        break;
      case "ongoing":
      case "accepted":
        color = "success";
        break;
      default:
        color = "default";
    }

    return { text: capitalizedStatus, color };
  };

  // Render loading spinner
  const renderLoading = () => (
    <div style={{ textAlign: "center", padding: "50px 0" }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <div style={{ padding: "80px 20px", background: "#f0f2f5" }}>
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}>
              <div>
                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                  Consultation History
                </Title>
                <Text type="secondary">
                  View the history of your past consultations
                </Text>
              </div>
            </div>
          }
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
          {loading ? (
            renderLoading()
          ) : (
            <>
              <List
                itemLayout="vertical"
                dataSource={consultations}
                locale={{ emptyText: "No consultation history found" }}
                renderItem={(item) => {
                  const { text: statusText, color: statusColor } =
                    getStatusProps(item.status);
                  const child = item.requestDetails?.children?.[0] || {};
                  const member = item.requestDetails?.member || {};
                  const doctor = item.requestDetails?.doctor || {};

                  return (
                    <Card
                      style={{
                        marginBottom: 15,
                        borderRadius: 8,
                        padding: "15px",
                        background: "#ffffff",
                        transition: "all 0.3s",
                        border: "1px solid #e8e8e8",
                      }}
                      hoverable
                      title={
                        <Title level={4} style={{ margin: 0 }}>
                          {item.requestDetails?.title ||
                            "Untitled Consultation"}
                        </Title>
                      }
                      extra={<Text type={statusColor}>{statusText}</Text>}>
                      <div style={{ padding: "10px 0" }}>
                        <Text strong>Parent:</Text> {member.name || "Unknown"}
                        <br />
                        <Text strong>Child:</Text> {child.name || "Unknown"}
                        <br />
                        {child.birthDate && (
                          <>
                            <Text strong>Age:</Text>{" "}
                            {calculateAge(child.birthDate)}
                            <br />
                          </>
                        )}
                        <Text strong>Doctor:</Text> {doctor.name || "Unknown"}
                        <br />
                        <Text strong>Submitted:</Text>{" "}
                        {formatDate(item.createdAt)}
                        <br />
                        <Text strong>Updated:</Text>{" "}
                        {formatDate(item.updatedAt)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 10,
                        }}>
                        <Button
                          type="primary"
                          onClick={() => handleViewDetails(item)}
                          loading={loading}>
                          View Details
                        </Button>
                      </div>
                    </Card>
                  );
                }}
              />
              {totalRequests > pageSize && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalRequests}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    style={{ marginBottom: "20px" }}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
      <FooterComponent />
      <ScrollToTop />

      {/* Modal for Consultation Details */}
      <Modal
        title="Consultation Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button type="primary">Start Consultation</Button>,
        ]}
        width={700}>
        {selectedConsultation &&
          selectedConsultation.requestDetails?.children?.length > 0 && (
            <>
              <Title level={4}>
                Child: {selectedConsultation.requestDetails.children[0].name}
              </Title>
              <Text strong>Age:</Text>{" "}
              {calculateAge(
                selectedConsultation.requestDetails.children[0].birthDate
              )}
              <br />
              <Text strong>Parent:</Text>{" "}
              {selectedConsultation.requestDetails.member?.name || "Unknown"}
              <br />
              <Text strong>Doctor:</Text>{" "}
              {selectedConsultation.requestDetails.doctor?.name || "Unknown"}
              <br />
              <Text strong>Status:</Text>{" "}
              {(() => {
                const { text: statusText, color: statusColor } = getStatusProps(
                  selectedConsultation.status
                );
                return <Text type={statusColor}>{statusText}</Text>;
              })()}
              <br />
              <Text strong>Request Title:</Text>{" "}
              {selectedConsultation.requestDetails.title || "No title provided"}
              <br />
              <Text strong>Submitted:</Text>{" "}
              {formatDate(selectedConsultation.createdAt)}
              <br />
              <Text strong>Updated:</Text>{" "}
              {formatDate(selectedConsultation.updatedAt)}
              <br />
              {selectedConsultation.requestDetails.children[0]
                .growthVelocityResult && (
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Text strong>Growth Velocity Results:</Text>
                  <List
                    size="small"
                    dataSource={
                      selectedConsultation.requestDetails.children[0]
                        .growthVelocityResult
                    }
                    renderItem={(growthData) => (
                      <List.Item>
                        <Text>
                          {growthData.period} (
                          {new Date(growthData.startDate).toLocaleDateString()}{" "}
                          - {new Date(growthData.endDate).toLocaleDateString()}
                          ):
                        </Text>{" "}
                        {growthData.weight.description !==
                        "Insufficient data" ? (
                          <Text>
                            Weight: {growthData.weight.weightVelocity}
                          </Text>
                        ) : (
                          <Text type="secondary">Insufficient weight data</Text>
                        )}
                        {growthData.height.description !==
                        "Insufficient data" ? (
                          <Text>
                            , Height: {growthData.height.heightVelocity}
                          </Text>
                        ) : (
                          <Text type="secondary">
                            , Insufficient height data
                          </Text>
                        )}
                        {growthData.headCircumference.description !==
                        "Insufficient data" ? (
                          <Text>
                            , Head:{" "}
                            {
                              growthData.headCircumference
                                .headCircumferenceVelocity
                            }
                          </Text>
                        ) : (
                          <Text type="secondary">
                            , Insufficient head circumference data
                          </Text>
                        )}
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </>
          )}
      </Modal>
    </div>
  );
};

export default DoctorConsultationHistory;
