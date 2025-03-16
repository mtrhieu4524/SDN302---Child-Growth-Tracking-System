import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Modal, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const { Title } = Typography;

const PremiumList = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = "Admin - Premium Package List";
    }, []);

    // Temporary hardcoded data
    const [packages] = useState([
        {
            key: '1',
            name: 'Gói Cơ bản',
            price: 99000,
            duration: 30,
            features: ['Tư vấn dinh dưỡng', 'Theo dõi phát triển'],
            status: 'active'
        },
        {
            key: '2',
            name: 'Gói Nâng cao',
            price: 199000,
            duration: 90,
            features: ['Tư vấn dinh dưỡng', 'Theo dõi phát triển', 'Tư vấn trực tiếp'],
            status: 'inactive'
        },
    ]);

    const handleDelete = (packageId) => {
        Modal.confirm({
            title: 'Xác nhận xóa gói Premium',
            content: 'Bạn có chắc chắn muốn xóa gói Premium này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: {
                style: { background: '#ff4d4f', borderColor: '#ff4d4f' }
            },
            onOk: () => {
                message.success('Đã xóa gói Premium');
            },
        });
    };

    const columns = [
        {
            title: 'Tên gói',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN').format(price),
        },
        {
            title: 'Thời hạn (ngày)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Tính năng',
            dataIndex: 'features',
            key: 'features',
            render: (features) => (
                <>
                    {features.map(feature => (
                        <Tag color="#0082C8" key={feature}>
                            {feature}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? '#52c41a' : '#d9d9d9'}>
                    {status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
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
                        onClick={() => navigate(`/update-premium/${record.key}`)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ color: "#0056A1", margin: 0 }}>
                    Quản lý gói Premium
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/add-premium')}
                    style={{
                        background: "linear-gradient(to right, #0056A1, #0082C8)",
                        border: "none"
                    }}
                >
                    Thêm gói mới
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={packages}
                style={{ 
                    background: '#fff',
                    borderRadius: '8px',
                }}
            />
        </AdminLayout>
    );
};

export default PremiumList;
