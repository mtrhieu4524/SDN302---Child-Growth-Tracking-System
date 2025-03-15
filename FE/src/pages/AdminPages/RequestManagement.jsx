import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Modal, message, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';

const { Title } = Typography;

const RequestManagement = () => {
    useEffect(() => {
        document.title = "Admin - Request Management";
    }, []);

    // Temporary hardcoded data
    const [requests] = useState([
        {
            key: '1',
            username: 'user1',
            childName: 'Nguyễn Văn A',
            requestType: 'Tư vấn dinh dưỡng',
            status: 'pending',
            createdAt: '2024-03-15',
        },
        {
            key: '2',
            username: 'user2',
            childName: 'Trần Thị B',
            requestType: 'Tư vấn phát triển',
            status: 'approved',
            createdAt: '2024-03-14',
        },
    ]);

    const handleViewDetails = (requestId) => {
        Modal.info({
            title: 'Chi tiết yêu cầu tư vấn',
            content: (
                <div>
                    <p>ID: {requestId}</p>
                    <p>Nội dung chi tiết sẽ được hiển thị ở đây</p>
                </div>
            ),
            okButtonProps: {
                style: {
                    background: "linear-gradient(to right, #0056A1, #0082C8)",
                    border: "none"
                }
            }
        });
    };

    const handleUpdateStatus = (requestId, newStatus) => {
        message.success(`Đã ${newStatus === 'approved' ? 'chấp nhận' : 'từ chối'} yêu cầu`);
    };

    const columns = [
        {
            title: 'Người yêu cầu',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tên trẻ',
            dataIndex: 'childName',
            key: 'childName',
        },
        {
            title: 'Loại yêu cầu',
            dataIndex: 'requestType',
            key: 'requestType',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={
                    status === 'pending' ? '#faad14' :
                    status === 'approved' ? '#52c41a' :
                    '#ff4d4f'
                }>
                    {status === 'pending' ? 'Đang chờ' :
                     status === 'approved' ? 'Đã duyệt' :
                     'Từ chối'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record.key)}
                        style={{
                            color: "#0056A1",
                            borderColor: "#0056A1"
                        }}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleUpdateStatus(record.key, 'approved')}
                                style={{
                                    background: "linear-gradient(to right, #0056A1, #0082C8)",
                                    border: "none"
                                }}
                            >
                                Duyệt
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleUpdateStatus(record.key, 'rejected')}
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
                Quản lý yêu cầu tư vấn
            </Title>
            <Table 
                columns={columns} 
                dataSource={requests}
                style={{ 
                    background: '#fff',
                    borderRadius: '8px',
                }}
            />
        </AdminLayout>
    );
};

export default RequestManagement;
