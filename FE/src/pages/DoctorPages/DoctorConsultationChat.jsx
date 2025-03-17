import { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Typography,
  message,
  Spin,
  Input,
  Pagination,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../configs/api";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const DoctorConsultationChat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const pageSize = 10;
  const { id } = useParams();

  useEffect(() => {
    document.title = "Child Growth Tracker - Consultation Chat";
    if (user && user._id && id) {
      fetchMessages();
    }
  }, [user, id, currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/consultation-messages/consultations/${id}`,
        {
          params: {
            id: id,
            page: currentPage,
            size: pageSize,
            search: "",
            order: "descending",
            sortBy: "date",
          },
        }
      );

      if (response.data && Array.isArray(response.data.consultationMessages)) {
        setMessages(response.data.consultationMessages);
        setTotalMessages(response.data.totalMessages || 0);
      } else {
        message.info(response.data.Message || "No messages found");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      message.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      message.warning("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      // Create a FormData object to handle multipart/form-data
      const formData = new FormData();
      formData.append("consultationId", id); // From useParams()
      formData.append("message", newMessage);

      // If you have file attachments to send, you would append them like this:
      // if (files && files.length > 0) {
      //   files.forEach((file) => {
      //     formData.append("messageAttachment", file);
      //   });
      // }

      // Make the API request with the correct headers for multipart/form-data
      await api.post(`/consultation-messages/consultations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message");
    } finally {
      setLoading(false);
    }
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
            <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
              Consultation Message
            </Title>
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
                dataSource={messages}
                locale={{ emptyText: "No messages found" }}
                renderItem={(item, index) => (
                  <div
                    style={{
                      borderBottom: "1px solid #e8e8e8",
                      padding: "15px",
                      background: index % 2 === 0 ? "#fafafa" : "#fff",
                    }}>
                    {/* Người gửi */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Text strong style={{ width: 100 }}>
                        {item.sender === user._id ? "You" : "Parent"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </div>
                    {/* Nội dung tin nhắn */}
                    <div
                      style={{
                        marginLeft: 100,
                        marginTop: 5,
                        maxWidth: "100%",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}>
                      <div
                        style={{
                          maxWidth: "100%",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item.message,
                        }}></div>
                    </div>
                  </div>
                )}
              />
              {totalMessages > pageSize && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalMessages}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
              {/* Form gửi tin nhắn */}
              <div style={{ marginTop: 20 }}>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ marginBottom: 10 }}
                />
                <Button
                  type="primary"
                  onClick={handleSendMessage}
                  loading={loading}
                  style={{ width: "100%" }}>
                  Send
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default DoctorConsultationChat;
