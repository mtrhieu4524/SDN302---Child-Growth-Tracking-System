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
  Table,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import api from "../../configs/api";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

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

  // Columns for Growth Velocity Results Table
  const growthVelocityColumns = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      render: (text, record) => (
        <Text>
          {text} ({formatDate(record.startDate)} - {formatDate(record.endDate)})
        </Text>
      ),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (weight) =>
        weight.description !== "Insufficient data" ? (
          <Text>{weight.weightVelocity}</Text>
        ) : (
          <Text type="secondary">Insufficient data</Text>
        ),
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
      render: (height) =>
        height.description !== "Insufficient data" ? (
          <Text>{height.heightVelocity}</Text>
        ) : (
          <Text type="secondary">Insufficient data</Text>
        ),
    },
  ];

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
        title={
          <span style={{ color: "#0056a1", fontSize: "30px", fontWeight: "bold" }}>
            Consultation Request Details
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
        ]}
        width={1200}
        centered
        maskClosable={false}
        mask={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        bodyStyle={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: "24px",
        }}
        style={{
          top: 20,
        }}
        destroyOnClose={true}
        className="consultation-detail-modal">
        {selectedConsultation &&
          selectedConsultation.children &&
          selectedConsultation.children.length > 0 && (
            <div style={{ padding: "0 10px" }}>
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
              {/* Growth Velocity Results */}
              {selectedConsultation.children[0].growthVelocityResult && (
                <div style={{ marginTop: 30, marginBottom: 30 }}>
                  <Title
                    level={4}
                    style={{ marginBottom: 20, color: "#0056A1" }}>
                    Growth Velocity Results
                  </Title>

                  <div
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                    }}>
                    {selectedConsultation.children[0].growthVelocityResult.map(
                      (result, index) => (
                        <div
                          key={index}
                          style={{
                            padding: 20,
                            borderBottom:
                              index <
                                selectedConsultation.children[0]
                                  .growthVelocityResult.length -
                                1
                                ? "1px solid #e8e8e8"
                                : "none",
                            backgroundColor:
                              index % 2 === 0 ? "#f9f9f9" : "white",
                          }}>
                          <div style={{ marginBottom: 15 }}>
                            <Title
                              level={5}
                              style={{
                                marginBottom: 8,
                                fontSize: 18,
                                backgroundColor: "#0056A1",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: 4,
                                display: "inline-block",
                              }}>
                              {result.period}
                            </Title>
                            <div
                              style={{
                                fontSize: 14,
                                color: "#666",
                                marginLeft: 5,
                              }}>
                              {formatDate(result.startDate)} -{" "}
                              {formatDate(result.endDate)}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 15,
                              flexWrap: "wrap",
                            }}>
                            {/* Weight Column */}
                            <div style={{ flex: 1, minWidth: "30%" }}>
                              <Card
                                title={
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}>
                                    <div
                                      style={{
                                        backgroundColor: "#f5a623",
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        marginRight: 8,
                                      }}></div>
                                    <span>Weight</span>
                                  </div>
                                }
                                style={{ height: "fit-content" }}
                                headStyle={{
                                  backgroundColor: "#fffbf2",
                                  borderBottom: "1px solid #ffebb7",
                                }}>
                                <div
                                  style={{
                                    padding: 10,
                                    fontSize: 16,
                                    minHeight: 80,
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  {result.weight.description ? (
                                    <div>
                                      <label>Weight Velocity:</label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 20,
                                        }}>
                                        {result.weight?.weightVelocity?.toFixed(
                                          2
                                        ) || "N/A"}
                                      </div>
                                      <label>Weight Percentile:</label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 5,
                                        }}>
                                        {result.weight?.percentile || "N/A"}
                                      </div>
                                    </div>
                                  ) : (
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 16 }}>
                                      Insufficient data to determine weight
                                      percentile.
                                    </Text>
                                  )}
                                </div>
                              </Card>
                            </div>

                            {/* Height Column */}
                            <div style={{ flex: 1, minWidth: "30%" }}>
                              <Card
                                title={
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}>
                                    <div
                                      style={{
                                        backgroundColor: "#4CAF50",
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        marginRight: 8,
                                      }}></div>
                                    <span>Height</span>
                                  </div>
                                }
                                style={{ height: "fit-content" }}
                                headStyle={{
                                  backgroundColor: "#f2fff3",
                                  borderBottom: "1px solid #d4edda",
                                }}>
                                <div
                                  style={{
                                    padding: 10,
                                    fontSize: 16,
                                    minHeight: 80,
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  {result.height.description !==
                                    "Insufficient data" ? (
                                    <div>
                                      <label>Height Velocity:</label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 20,
                                        }}>
                                        {result.height?.heightVelocity?.toFixed(
                                          2
                                        ) || "N/A"}
                                      </div>
                                      <label>Height Percentile:</label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 5,
                                        }}>
                                        {result.height?.percentile || "N/A"}
                                      </div>
                                    </div>
                                  ) : (
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 16 }}>
                                      Insufficient data to determine height
                                      percentile.
                                    </Text>
                                  )}
                                </div>
                              </Card>
                            </div>

                            {/* Head Circumference Column */}
                            <div style={{ flex: 1, minWidth: "30%" }}>
                              <Card
                                title={
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}>
                                    <div
                                      style={{
                                        backgroundColor: "#9C27B0",
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        marginRight: 8,
                                      }}></div>
                                    <span>Head Circumference</span>
                                  </div>
                                }
                                style={{ height: "fit-content" }}
                                headStyle={{
                                  backgroundColor: "#f9f0ff",
                                  borderBottom: "1px solid #e3c8f0",
                                }}>
                                <div
                                  style={{
                                    padding: 10,
                                    fontSize: 16,
                                    minHeight: 80,
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  {result.headCircumference &&
                                    result.headCircumference.description !==
                                    "Insufficient data" ? (
                                    <div>
                                      <label>
                                        Head Circumference Velocity:
                                      </label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 20,
                                        }}>
                                        {result.headCircumference?.headCircumferenceVelocity?.toFixed(
                                          2
                                        ) || "N/A"}
                                      </div>
                                      <label>
                                        Head Circumference Percentile:
                                      </label>
                                      <div
                                        style={{
                                          fontSize: 24,
                                          fontWeight: "bold",
                                          marginBottom: 5,
                                        }}>
                                        {result.headCircumference?.percentile ||
                                          "N/A"}
                                      </div>
                                    </div>
                                  ) : (
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 16 }}>
                                      Insufficient data to determine head
                                      circumference percentile.
                                    </Text>
                                  )}
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Percentile Information (if available) */}
                          {(result.weight.description &&
                            result.weight.description.includes("percentile")) ||
                            (result.height.description &&
                              result.height.description.includes("percentile")) ||
                            (result.headCircumference &&
                              result.headCircumference.description &&
                              result.headCircumference.description.includes(
                                "percentile"
                              )) ? (
                            <div
                              style={{
                                marginTop: 15,
                                padding: 15,
                                backgroundColor: "#f0f7ff",
                                borderRadius: 8,
                                border: "1px solid #d0e3ff",
                              }}>
                              <Text strong style={{ color: "#0056A1" }}>
                                Percentile Information:
                              </Text>
                              {result.weight.description &&
                                result.weight.description.includes(
                                  "percentile"
                                ) && (
                                  <div style={{ marginTop: 8 }}>
                                    <Text style={{ display: "block" }}>
                                      {result.weight.description}
                                    </Text>
                                  </div>
                                )}
                              {result.height.description &&
                                result.height.description.includes(
                                  "percentile"
                                ) && (
                                  <div style={{ marginTop: 8 }}>
                                    <Text style={{ display: "block" }}>
                                      {result.height.description}
                                    </Text>
                                  </div>
                                )}
                              {result.headCircumference &&
                                result.headCircumference.description &&
                                result.headCircumference.description.includes(
                                  "percentile"
                                ) && (
                                  <div style={{ marginTop: 8 }}>
                                    <Text style={{ display: "block" }}>
                                      {result.headCircumference.description}
                                    </Text>
                                  </div>
                                )}
                            </div>
                          ) : null}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
      </Modal>
    </div>
  );
};

export default DoctorConsultation;
