import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddPremium = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        document.title = "Admin - Add Premium Package";
    }, []);

    const features = [
        'Tư vấn dinh dưỡng',
        'Theo dõi phát triển',
        'Tư vấn trực tiếp',
        'Báo cáo chi tiết',
        'Hỗ trợ 24/7'
    ];

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Thêm gói Premium thành công!');
        navigate('/premium-list');
    };

    return (
        <AdminLayout>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
                Thêm gói Premium mới
            </Title>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="name"
                    label="Tên gói"
                    rules={[{ required: true, message: 'Vui lòng nhập tên gói!' }]}
                >
                    <Input placeholder="Nhập tên gói Premium" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Giá (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá gói!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1000}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="Nhập giá gói"
                    />
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Thời hạn (ngày)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời hạn!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        placeholder="Nhập số ngày"
                    />
                </Form.Item>

                <Form.Item
                    name="features"
                    label="Tính năng"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tính năng!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn các tính năng của gói"
                        style={{ width: '100%' }}
                    >
                        {features.map(feature => (
                            <Option key={feature} value={feature}>
                                {feature}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập mô tả chi tiết về gói Premium"
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    initialValue="active"
                >
                    <Select>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Tạm ngưng</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={() => navigate('/premium-list')}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                background: "linear-gradient(to right, #0056A1, #0082C8)",
                                border: "none"
                            }}
                        >
                            Thêm gói
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </AdminLayout>
    );
};

export default AddPremium;
