import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Modal, message, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';

const { Title } = Typography;

const UserManagement = () => {
    useEffect(() => {
        document.title = "Admin - User Management";
    }, []);

    // Temporary hardcoded data
    const [users] = useState([
        {
            key: '1',
            username: 'user1',
            email: 'user1@example.com',
            role: 'user',
            status: 'active',
            premium: true,
        },
        {
            key: '2',
            username: 'user2',
            email: 'user2@example.com',
            role: 'user',
            status: 'inactive',
            premium: false,
        },
    ]);

    const handleDelete = (userId) => {
        Modal.confirm({
            title: 'Xác nhận xóa người dùng',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: {
                style: { background: '#ff4d4f', borderColor: '#ff4d4f' }
            },
            onOk: () => {
                message.success('Đã xóa người dùng');
            },
        });
    };

    const columns = [
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? '#0056A1' : '#0082C8'}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? '#52c41a' : '#faad14'}>
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Premium',
            dataIndex: 'premium',
            key: 'premium',
            render: (premium) => (
                <Tag color={premium ? '#722ed1' : '#d9d9d9'}>
                    {premium ? 'Premium' : 'Free'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => message.info('Chức năng đang phát triển')}
                        style={{
                            background: "linear-gradient(to right, #0056A1, #0082C8)",
                            border: "none"
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
                Quản lý người dùng
            </Title>
            <Table 
                columns={columns} 
                dataSource={users} 
                style={{ 
                    background: '#fff',
                    borderRadius: '8px',
                }}
            />
        </AdminLayout>
    );
};

export default UserManagement;
