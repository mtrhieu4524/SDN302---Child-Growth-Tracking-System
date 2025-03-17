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
    Avatar,
    Image,
} from "antd";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../configs/api";
import { useParams } from "react-router-dom";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
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

    useEffect(() => {
        document.title = "Child Growth Tracker - Consultation Chat";
        if (user && user._id && id) {
            fetchMessages();
        }
    }, [user, id, currentPage]);


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
    
            if (attachments.length > 0) {
                attachments.forEach((file) => {
                    formData.append("messageAttachments", file);
                });                
            }
    
            await api.post(`/consultation-messages`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            await fetchMessages(); 
    
            setNewMessage("");
            setAttachments([]);
            message.success("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            
            if (error.response?.status === 400 && error.response.data?.validationErrors) {
                error.response.data.validationErrors.forEach((err) => {
                    message.error("failed");
                });
            } else {
                message.error("Failed to send message. Please try again.");
            }
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

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <HeaderComponent />
            <div style={{ padding: "24px", maxWidth: "1000px", margin: "auto", flex: 1 }}>
                <Title level={2}>{messages[0]?.consultation?.requestDetails?.title}</Title>
                {fetchLoading ? (
                    renderLoading()
                ) : (
                    <>
                        <List
                            itemLayout="vertical"
                            dataSource={messages}
                            renderItem={(message) => (
                                <Card style={{ marginBottom: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                        <Avatar src={message.senderInfo?.avatar || <UserOutlined style={{ color: "black", border: "1px solid black", borderRadius: "50%" , height: "30px", width: "30px", padding:"10px"}}/>} />
                                        <div style={{ marginLeft: "8px" }}>
                                            <Text strong>{message.senderInfo.name}</Text>
                                            <br />
                                            <Text type="secondary">{formatDate(message.createdAt)}</Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text>{message.message}</Text>
                                    </div>
                                    {message.attachments && message.attachments.length > 0 && (
                                        <div style={{ marginTop: "16px" }}>
                                            <Image.PreviewGroup>
                                                {message.attachments.map((attachment, index) => (
                                                    <>
                                                        <Image
                                                            key={index}
                                                            src={attachment}
                                                            fallback="https://watchdiana.fail/blog/wp-content/themes/koji/assets/images/default-fallback-image.png"
                                                            width={"50%"}
                                                            style={{ marginRight: "8px" }}
                                                        />
                                                    </>
                                                ))}
                                            </Image.PreviewGroup>
                                        </div>
                                    )}
                                </Card>
                            )}
                        />
                        <Pagination
                            current={currentPage}
                            total={totalMessages}
                            pageSize={pageSize}
                            align="center"
                            onChange={handlePageChange}
                            style={{ textAlign: "center", marginTop: "16px" }}
                        />
                    </>
                )}
                <div style={{ marginTop: "24px" }}>
                    <TextArea
                        rows={4}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <div style={{ display: "flex", gap: "1em" }}>
                        <Upload
                            fileList={attachments}
                            beforeUpload={() => false}
                            onChange={handleAttachmentChange}
                            onRemove={handleRemoveAttachment}
                            multiple
                        >
                            <Button icon={<UploadOutlined />} style={{ marginTop: "8px" }}>
                                Attach Files
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={handleSendMessage}
                            loading={sendLoading}
                            style={{ marginTop: "8px" }}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
            <FooterComponent />
            <ScrollToTop />
        </div>
    );
};

export default ConsultationChat;