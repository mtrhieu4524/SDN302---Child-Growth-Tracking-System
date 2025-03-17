import { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Typography,
  message,
  Modal,
  Input,
  Form,
  Space,
  Spin,
  Pagination,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import api from "../../configs/api";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal; // Import confirm from Modal

const DoctorConsultation = () => {
  const { user } = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    document.title = "Child Growth Tracker - Consultation Request";
    if (user && user._id) {
      fetchConsultations();
    }
  }, [user, currentPage]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/requests/users/${user._id}`, {
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
        response.data.requests &&
        response.data.requests.requests
      ) {
        setConsultations(response.data.requests.requests);
        setTotalRequests(response.data.requests.total);
      } else {
        message.error("Failed to load consultation requests");
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      message.error("Failed to load consultation requests");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle review action (show details in modal)
  const handleReview = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

  // Handle status update (accept or reject)
  const handleUpdateStatus = async (consultationId, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/requests/status/${consultationId}`, {
        doctorId: user._id,
        status: newStatus,
      });
      message.success(`Request ${newStatus} successfully!`);
      fetchConsultations();
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error);
      message.error(`Failed to ${newStatus.toLowerCase()} the request`);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation popup for accept
  const showAcceptConfirm = (consultationId) => {
    confirm({
      title: "Are you sure you want to accept this request?",
      content: "This action will mark the consultation request as accepted.",
      okText: "Yes, Accept",
      okType: "primary",
      cancelText: "No",
      onOk() {
        handleUpdateStatus(consultationId, "Accepted");
      },
      onCancel() {
        console.log("Accept action canceled");
      },
    });
  };

  // Show confirmation popup for reject
  const showRejectConfirm = (consultationId) => {
    confirm({
      title: "Are you sure you want to reject this request?",
      content: "This action will mark the consultation request as rejected.",
      okText: "Yes, Reject",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleUpdateStatus(consultationId, "Rejected");
      },
      onCancel() {
        console.log("Reject action canceled");
      },
    });
  };

  // Handle accept request
  const handleAccept = (consultationId) => {
    showAcceptConfirm(consultationId);
  };

  // Handle reject request
  const handleReject = (consultationId) => {
    showRejectConfirm(consultationId);
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
      case "pending":
        color = "warning";
        break;
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
                  Consultation Requests
                </Title>
                <Text type="secondary">Review consultation requests</Text>
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
                locale={{ emptyText: "No consultation requests found" }}
                renderItem={(item) => {
                  const { text: statusText, color: statusColor } =
                    getStatusProps(item.status);
                  return (
                    <Card
                      style={{
                        marginBottom: 15,
                        borderRadius: 8,
                        paddingBottom: 10,
                      }}
                      title={item.title || "Consultation Request"}
                      extra={<Text type={statusColor}>{statusText}</Text>}>
                      <div style={{ marginBottom: 15 }}>
                        <Text strong>Parent:</Text>{" "}
                        {item.member?.name || "Unknown"}
                        <br />
                        <Text strong>Child:</Text>{" "}
                        {item.children && item.children.length > 0
                          ? item.children[0].name
                          : "Unknown"}
                        <br />
                        {item.children &&
                          item.children.length > 0 &&
                          item.children[0].birthDate && (
                            <>
                              <Text strong>Age:</Text>{" "}
                              {calculateAge(item.children[0].birthDate)}
                              <br />
                            </>
                          )}
                        <Text strong>Submitted:</Text>{" "}
                        {formatDate(item.createdAt)}
                        <br />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 10,
                        }}>
                        <Space>
                          {item.status.toLowerCase() === "pending" && (
                            <>
                              <Button
                                danger
                                onClick={() => handleReject(item._id)}
                                loading={loading}>
                                Reject
                              </Button>
                              <Button
                                type="primary"
                                style={{
                                  backgroundColor: "#52c41a",
                                  borderColor: "#52c41a",
                                }}
                                onClick={() => handleAccept(item._id)}
                                loading={loading}>
                                Accept
                              </Button>
                            </>
                          )}
                          <Button
                            type="primary"
                            onClick={() => handleReview(item)}
                            loading={loading}>
                            View
                          </Button>
                        </Space>
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
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
      <FooterComponent />
      <ScrollToTop />

      <Modal
        title="Consultation Request Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
        ]}
        width={700}>
        {selectedConsultation &&
          selectedConsultation.children &&
          selectedConsultation.children.length > 0 && (
            <>
              <Title level={4}>
                Child: {selectedConsultation.children[0].name}
              </Title>
              <Text strong>Age:</Text>{" "}
              {calculateAge(selectedConsultation.children[0].birthDate)}
              <br />
              <Text strong>Parent:</Text>{" "}
              {selectedConsultation.member?.name || "Unknown"}
              <br />
              <Text strong>Status:</Text>{" "}
              {(() => {
                const { text: statusText, color: statusColor } = getStatusProps(
                  selectedConsultation.status
                );
                return <Text type={statusColor}>{statusText}</Text>;
              })()}
              <br />
              <Text strong>Request:</Text>{" "}
              {selectedConsultation.title || "No title provided"}
              <br />
              <Text strong>Submitted:</Text>{" "}
              {formatDate(selectedConsultation.createdAt)}
              <br />
              {selectedConsultation.children[0].growthVelocityResult && (
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Text strong>Growth Velocity Results:</Text>
                  <List
                    size="small"
                    dataSource={
                      selectedConsultation.children[0].growthVelocityResult
                    }
                    renderItem={(growthData) => (
                      <List.Item>
                        <Text>
                          {growthData.period} (
                          {new Date(growthData.startDate).toLocaleDateString()}{" "}
                          - {new Date(growthData.endDate).toLocaleDateString()}
                          ):
                        </Text>
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

export default DoctorConsultation;
