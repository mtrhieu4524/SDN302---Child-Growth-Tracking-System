import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import api from '../../../configs/api';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddPremium = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        document.title = "Admin - Add Premium Package";
    }, []);

    const onFinish = async (values) => {
        try {
            const formattedData = {
                name: values.name,
                description: values.description,
                price: values.price,
                unit: "VND",
                duration: values.duration,
                postLimit: values.postLimit,
                updateChildDataLimit: values.updateChildDataLimit
            };

            console.log('Data being sent:', formattedData);

            const response = await api.post('/membership-packages', formattedData);

            if (response.status === 201) {
                message.success('Premium package added successfully!');
                navigate('/admin/premium-list');
            }
        } catch (error) {
            console.error('Error details:', error.response || error);
            if (error.response?.status === 401) {
                message.error('Your session has expired. Please login again.');
                navigate('/login');
            } else {
                message.error(error.response?.data?.message || 'Failed to add premium package');
            }
        }
    };

    return (
        <AdminLayout>
            <Title level={2} style={{ color: "#0056A1", marginBottom: "24px" }}>
                Add New Premium Package
            </Title>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="name"
                    label="Package Name"
                    rules={[{ required: true, message: 'Please enter package name!' }]}
                >
                    <Input placeholder="Enter premium package name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter package description!' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Enter detailed description of premium package"
                    />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price (VND)"
                    rules={[{ required: true, message: 'Please enter package price!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1000}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="Enter package price"
                    />
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Duration (days)"
                    rules={[{ required: true, message: 'Please enter duration!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        placeholder="Enter number of days"
                    />
                </Form.Item>

                <Form.Item
                    name="postLimit"
                    label="Post Limit"
                    rules={[{ required: true, message: 'Please enter post limit!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        placeholder="Enter post limit"
                    />
                </Form.Item>

                <Form.Item
                    name="updateChildDataLimit"
                    label="Update Child Data Limit"
                    rules={[{ required: true, message: 'Please enter update child data limit!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        placeholder="Enter update child data limit"
                    />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button onClick={() => navigate('/admin/premium-list')}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                background: "linear-gradient(to right, #0056A1, #0082C8)",
                                border: "none"
                            }}
                        >
                            Add Package
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </AdminLayout>
    );
};

export default AddPremium;
