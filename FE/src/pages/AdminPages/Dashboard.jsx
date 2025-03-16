import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { UserOutlined, FileOutlined, CrownOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';

const { Title } = Typography;

const Dashboard = () => {
    useEffect(() => {
        document.title = "Admin - Dashboard";
    }, []);

    // Temporary hardcoded data
    const stats = {
        totalUsers: 150,
        totalRequests: 45,
        totalPremiumUsers: 30,
    };

    const cardStyle = {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        border: "none",
    };

    return (
        <AdminLayout>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
                Dashboard
            </Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                    <Card style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: "#0056A1" }}>Tổng số người dùng</span>}
                            value={stats.totalUsers}
                            prefix={<UserOutlined style={{ color: "#0082C8" }} />}
                            valueStyle={{ color: "#0056A1" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: "#0056A1" }}>Yêu cầu tư vấn</span>}
                            value={stats.totalRequests}
                            prefix={<FileOutlined style={{ color: "#0082C8" }} />}
                            valueStyle={{ color: "#0056A1" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={cardStyle}>
                        <Statistic
                            title={<span style={{ color: "#0056A1" }}>Người dùng Premium</span>}
                            value={stats.totalPremiumUsers}
                            prefix={<CrownOutlined style={{ color: "#0082C8" }} />}
                            valueStyle={{ color: "#0056A1" }}
                        />
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default Dashboard;
