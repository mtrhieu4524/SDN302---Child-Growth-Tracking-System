import { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Typography,
  message,
  Spin,
  Input,
  Form,
  Modal,
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
      await api.post(`/consultation-messages/consultations/${id}`, {
        doctorId: user._id,
        message: newMessage,
      });
      setNewMessage("");
      fetchMessages(); // Refresh messages after sending
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}>
              <div>
                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                  Consultation Chat
                </Title>
                <Text type="secondary">Chat with the parent</Text>
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
                dataSource={messages}
                locale={{ emptyText: "No messages found" }}
                renderItem={(item) => (
                  <Card
                    style={{
                      marginBottom: 15,
                      borderRadius: 8,
                      padding: "15px",
                      background: "#ffffff",
                      transition: "all 0.3s",
                      border: "1px solid #e8e8e8",
                    }}
                    hoverable>
                    <div style={{ padding: "10px 0" }}>
                      <Text strong>
                        {item.sender === user._id ? "You" : "Parent"}:
                      </Text>{" "}
                      {item.message}
                      <br />
                      <Text type="secondary">{formatDate(item.createdAt)}</Text>
                    </div>
                  </Card>
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
                    style={{ marginBottom: "20px" }}
                  />
                </div>
              )}
              <Form style={{ marginTop: 20 }} onFinish={handleSendMessage}>
                <Form.Item>
                  <TextArea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: "100%" }}>
                    Send
                  </Button>
                </Form.Item>
              </Form>
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
