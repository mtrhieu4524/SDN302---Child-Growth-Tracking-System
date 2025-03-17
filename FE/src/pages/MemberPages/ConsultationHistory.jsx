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
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ConsultationHistory = () => {
  const { user } = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();

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
          as: "MEMBER",
        },
      });

      if (
        response.data &&
        response.data.consultations &&
        Array.isArray(response.data.consultations)
      ) {
        const acceptedConsultations = response.data.consultations.filter(
          (consultation) =>
            consultation.requestDetails &&
            consultation.requestDetails.status === "Accepted"
        );

        const requestIdMap = new Map();

        acceptedConsultations.forEach((consultation) => {
          const requestId = consultation.requestId;

          if (
            !requestIdMap.has(requestId) ||
            new Date(consultation.updatedAt) >
              new Date(requestIdMap.get(requestId).updatedAt)
          ) {
            requestIdMap.set(requestId, consultation);
          }
        });

        const uniqueConsultations = Array.from(requestIdMap.values());
        uniqueConsultations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setConsultations(uniqueConsultations);
        setTotalRequests(uniqueConsultations.length || 0);
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

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

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

  const handleStartConsultation = (consultationId) => {
    navigate(`/member-consultation-history/chat/${consultationId}`);
  };

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
                  View the history of your accepted consultations
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
                locale={{ emptyText: "No accepted consultation history found" }}
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
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      hoverable
                      title={
                        <Title
                          level={4}
                          style={{ margin: 0, color: "#0056A1" }}>
                          Doctor: {member.name || "Unknown"}
                        </Title>
                      }
                      extra={<Text type={statusColor}>{statusText}</Text>}>
                      <div style={{ padding: "10px 0", color: "#333" }}>
                        <Text strong>Title:</Text>{" "}
                        {item.requestDetails?.title || "Untitled Consultation"}
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
                          loading={loading}
                          style={{
                            backgroundColor: "#0056A1",
                            borderColor: "#0056A1",
                            borderRadius: 4,
                          }}>
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
        title={
          <span
            style={{ color: "#0056a1", fontSize: "30px", fontWeight: "bold" }}>
            Consultation Details
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            type="primary"
            onClick={() => handleStartConsultation(selectedConsultation._id)}
            style={{
              backgroundColor: "#0056A1",
              borderColor: "#0056A1",
              borderRadius: 4,
            }}>
            Start Consultation
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
          selectedConsultation.requestDetails?.children?.length > 0 && (
            <div style={{ padding: "0 10px" }}>
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
              {/* Growth Velocity Results */}
              {selectedConsultation.requestDetails.children[0]
                .growthVelocityResult && (
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
                    {selectedConsultation.requestDetails.children[0].growthVelocityResult.map(
                      (result, index) => (
                        <div
                          key={index}
                          style={{
                            padding: 20,
                            borderBottom:
                              index <
                              selectedConsultation.requestDetails.children[0]
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

export default ConsultationHistory;
