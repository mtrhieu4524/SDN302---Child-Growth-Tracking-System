import { useState, useEffect, useContext, useRef } from "react";
import {
    Card,
    List,
    Button,
    Typography,
    message,
    Spin,
    Input,
    Pagination,
    Upload,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../configs/api";
import { useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ConsultationChat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMessages, setTotalMessages] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const pageSize = 10;
    const { id } = useParams();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        document.title = "Child Growth Tracker - Consultation Chat";
        if (user && user._id && id) {
            fetchMessages();
        }
    }, [user, id, currentPage]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setFetchLoading(true);
            const response = await api.get(
                `/consultation-messages/consultations/${id}`,
                {
                    params: {
                        id: id,
                        page: currentPage,
                        size: pageSize,
                        search: "",
                        order: "ascending",
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
            setFetchLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() && attachments.length === 0) {
            message.warning("Please enter a message or attach a file");
            return;
        }

        try {
            setSendLoading(true);

            const formData = new FormData();
            formData.append("consultationId", id);
            formData.append("message", newMessage || "");

            // Gửi attachments dưới dạng array trong FormData
            if (attachments.length > 0) {
                attachments.forEach((file, index) => {
                    formData.append(`messageAttachments[${index}]`, file);
                });
            }

            const response = await api.post(`/consultation-messages`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const sentMessage = {
                sender: user._id,
                message: newMessage,
                createdAt: new Date().toISOString(),
                messageAttachments: attachments.map((file) => ({
                    url:
                        response.data.attachments?.find((att) => att.name === file.name)
                            ?.url || URL.createObjectURL(file),
                })),
            };

            setMessages((prevMessages) => [...prevMessages, sentMessage]);
            setTotalMessages((prevTotal) => prevTotal + 1);

            setNewMessage("");
            setAttachments([]);
        } catch (error) {
            console.error("Error sending message:", error);
            message.error("Failed to send message");
        } finally {
            setSendLoading(false);
        }
    };

    const handleAttachmentChange = ({ fileList }) => {
        setAttachments(fileList.map((file) => file.originFileObj));
    };

    const handleRemoveAttachment = (file) => {
        const newAttachments = attachments.filter(
            (item) => item !== file.originFileObj
        );
        setAttachments(newAttachments);
        return true;
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
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: "100vh" }}>
            <HeaderComponent />
            <div style={{ padding: "80px 300px", background: "#f0f2f5" }}>
                <Card
                    title={
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                            <span
                                onClick={() => navigate("/member-consultation-history")}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    cursor: "pointer",
                                    color: "#0056A1",
                                    fontSize: 16,
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "5px",
                                }}
                            >
                                {"<"} Back to consultation history
                            </span>

                            <Title level={2} style={{ color: "#0056A1", marginTop: "20px", marginBottom: "20px" }}>
                                Consultation Message
                            </Title>
                        </div>
                    }
                    style={{
                        width: "100%",
                        margin: "0 auto",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    {fetchLoading ? (
                        renderLoading()
                    ) : (
                        <>
                            <div
                                style={{
                                    maxHeight: "calc(100vh - 200px)",
                                    overflowY: "auto",
                                    marginBottom: "20px",
                                    padding: "0 10px",
                                }}>
                                <List
                                    dataSource={messages}
                                    locale={{ emptyText: "No messages found" }}
                                    renderItem={(item, index) => {
                                        const isSender = item.sender === user._id;
                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: isSender ? "flex-end" : "flex-start",
                                                    padding: "15px 0",
                                                }}>
                                                <div
                                                    style={{
                                                        maxWidth: "70%",
                                                        borderRadius: isSender
                                                            ? "10px 0 10px 10px"
                                                            : "0 10px 10px 10px",
                                                        backgroundColor: isSender ? "#DCF8C6" : "#E8E8E8",
                                                        padding: "10px",
                                                        margin: isSender
                                                            ? "0 0 10px 10px"
                                                            : "0 10px 10px 0",
                                                    }}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}>
                                                        <Text
                                                            strong
                                                            style={{ fontSize: "16px", marginRight: "10px" }}>
                                                            {isSender ? "You" : "Doctor"}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: "14px" }}>
                                                            {formatDate(item.createdAt)}
                                                        </Text>
                                                    </div>
                                                    <div
                                                        style={{
                                                            wordBreak: "break-word",
                                                            marginTop: "5px",
                                                            fontSize: "16px",
                                                        }}>
                                                        {item.message}
                                                    </div>
                                                    {/* {item.messageAttachments &&
                            item.messageAttachments.length > 0 && (
                              <div style={{ marginTop: "10px" }}>
                                {item.messageAttachments.map(
                                  (attachment, idx) => (
                                    <img
                                      key={idx}
                                      src={
                                        attachment.url ||
                                        URL.createObjectURL(attachment)
                                      }
                                      alt="Attachment"
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        marginTop: "5px",
                                        borderRadius: "5px",
                                        objectFit: "contain",
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            )} */}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <div ref={messagesEndRef} />
                            </div>
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
                            <div style={{ marginTop: 20, padding: "0 10px" }}>
                                <TextArea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    style={{ marginBottom: 10, width: "100%" }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                    }}>
                                    {/* <Upload
                    beforeUpload={() => false}
                    onChange={handleAttachmentChange}
                    onRemove={handleRemoveAttachment}
                    multiple
                    fileList={attachments.map((file, index) => ({
                      uid: `-${index}`,
                      name: file.name,
                      status: "done",
                      originFileObj: file,
                    }))}
                    accept="image/*,application/pdf">
                    <Button
                      icon={<UploadOutlined />}
                      size="large"
                      style={{
                        fontSize: "16px",
                        padding: "0 20px",
                        height: "40px",
                      }}>
                      Attach Files
                    </Button>
                  </Upload> */}
                                    <Button
                                        type="primary"
                                        onClick={handleSendMessage}
                                        loading={sendLoading}
                                        size="large"
                                        style={{
                                            fontSize: "16px",
                                            padding: "0 20px",
                                            height: "40px",
                                        }}>
                                        Send Message
                                    </Button>
                                </div>
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

export default ConsultationChat;
