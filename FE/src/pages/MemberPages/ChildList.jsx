import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Tag, Spin, message, Typography, Button, Modal, Form, Input, Select, DatePicker, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../configs/api';
import MemberLayout from '../../layouts/MemberLayout';
import { PlusOutlined, DeleteOutlined, ExclamationCircleFilled, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// Constants for select options
const FEEDING_TYPES = ['N/A', 'BREASTFEEDING', 'FORMULA_FEEDING', 'SOLID_FOODS'];
const ALLERGY_TYPES = ['NONE', 'N/A', 'DRUG_ALLERGY', 'FOOD_ALLERGY', 'LATEX_ALLERGY', 'MOLD_ALLERGY', 'PET_ALLERGY', 'POLLEN_ALLERGY'];

const ChildList = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [currentChild, setCurrentChild] = useState(null);
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/children', {
        params: {
          page: 1,
          size: 10,
          sortBy: 'date',
          order: 'descending'
        }
      });

      if (response.data && response.data.children) {
        setChildren(response.data.children);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      message.error('Failed to load children list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Child Growth Tracking - Children List";
    fetchChildren();
  }, []);

  const handleChildClick = (childId) => {
    navigate(`/profile/growth-chart/${childId}`);
  };

  const handleAddChild = async (values) => {
    try {
      const formattedData = {
        ...values,
        birthDate: values.birthDate.toISOString(),
        gender: values.gender === 'male' ? 1 : 0,
        allergies: values.allergies ? [values.allergies] : ['NONE'],
      };

      const response = await api.post('/children', formattedData);

      if (response.data && response.data.message === "Child created successfully") {
        message.success('Thêm trẻ thành công');
        setIsModalVisible(false);
        form.resetFields();
        fetchChildren(); // Refresh danh sách
      }
    } catch (error) {
      console.error('Error adding child:', error);
      message.error('Không thể thêm trẻ. Vui lòng thử lại');
    }
  };

  const handleEditChild = (e, child) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền đến card
    setCurrentChild(child);
    
    // Chuẩn bị dữ liệu cho form
    editForm.setFieldsValue({
      name: child.name,
      gender: child.gender === 1 ? 'male' : 'female',
      birthDate: moment(child.birthDate),
      note: child.note || '',
    });
    
    setIsEditModalVisible(true);
  };

  const handleUpdateChild = async (values) => {
    if (!currentChild) return;
    
    setEditLoading(true);
    try {
      const formattedData = {
        ...values,
        birthDate: values.birthDate.toISOString(),
        gender: values.gender === 'male' ? 1 : 0,
      };

      const response = await api.put(`/children/${currentChild._id}`, formattedData);
      
      if (response.data && response.data.message === "Child updated successfully") {
        message.success('Cập nhật thông tin thành công');
        setIsEditModalVisible(false);
        fetchChildren(); // Refresh danh sách
      }
    } catch (error) {
      console.error('Error updating child:', error);
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteChild = async (childId, childName) => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/children/${childId}`);

      if (response.data && response.data.message === "Child deleted successfully") {
        message.success(`Đã xóa ${childName} thành công`);
        fetchChildren(); // Refresh danh sách sau khi xóa
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      message.error('Không thể xóa. Vui lòng thử lại');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCardClick = (e, childId) => {
    // Ngăn chặn sự kiện click lan truyền khi click vào nút xóa
    e.stopPropagation();
    navigate(`/profile/growth-chart/${childId}`);
  };

  return (
    <MemberLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#0056A1' }}>
            My Children
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ backgroundColor: '#0082c8' }}
          >
            Add Child
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={children}
            renderItem={(child) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={(e) => handleCardClick(e, child._id)}
                  style={{
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 1,
                      display: 'flex',
                      gap: '8px'
                    }}
                  >
                    {/* Edit button */}
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => handleEditChild(e, child)}
                      style={{
                        color: '#1890ff',
                        opacity: 0.7,
                        transition: 'all 0.3s',
                        padding: '4px 8px',
                        height: 'auto',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />

                    {/* Delete button */}
                    <Popconfirm
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ExclamationCircleFilled style={{ color: '#ff4d4f', fontSize: '16px' }} />
                          <span>Xác nhận xóa</span>
                        </div>
                      }
                      description={`Bạn có chắc chắn muốn xóa ${child.name}?`}
                      onConfirm={(e) => {
                        e.stopPropagation();
                        handleDeleteChild(child._id, child.name);
                      }}
                      onCancel={(e) => e.stopPropagation()}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{
                        loading: deleteLoading,
                        danger: true
                      }}
                      placement="left"
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: '#ff4d4f',
                          opacity: 0.7,
                          transition: 'all 0.3s',
                          padding: '4px 8px',
                          height: 'auto',
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </Popconfirm>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: child.gender === 1 ? '#0056A1' : '#FF69B4',
                        marginBottom: '8px'
                      }}
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Title level={4} style={{ margin: '8px 0' }}>
                      {child.name}
                    </Title>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <strong>Birth Date:</strong>{' '}
                    {moment(child.birthDate).format('DD/MM/YYYY')}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <strong>Gender:</strong>{' '}
                    <Tag color={child.gender === 1 ? '#0056A1' : '#FF69B4'}>
                      {child.gender === 1 ? 'Male' : 'Female'}
                    </Tag>
                  </div>

                  <div>
                    <strong>Relationship:</strong>{' '}
                    {child.relationships?.[0]?.type || 'N/A'}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}

        {/* Add Child Modal */}
        <Modal
          title="Add New Child"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddChild}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input child name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender!' }]}
            >
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="Birth Date"
              rules={[{ required: true, message: 'Please select birth date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="relationship"
              label="Relationship"
              rules={[{ required: true, message: 'Please select relationship!' }]}
            >
              <Select>
                <Option value="Parent">Parent</Option>
                <Option value="Guardian">Guardian</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="feedingType"
              label="Feeding Type"
              rules={[{ required: true, message: 'Please select feeding type!' }]}
            >
              <Select>
                {FEEDING_TYPES.map(type => (
                  <Option key={type} value={type}>{type.replace('_', ' ')}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="allergies"
              label="Allergies"
              rules={[{ required: true, message: 'Please select allergies!' }]}
            >
              <Select>
                {ALLERGY_TYPES.map(type => (
                  <Option key={type} value={type}>{type.replace('_', ' ')}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="note"
              label="Note"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#0082c8' }}>
                  Add Child
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Child Modal */}
        <Modal
          title="Edit Child Information"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentChild(null);
          }}
          footer={null}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateChild}
            initialValues={{
              name: '',
              gender: 'female',
              birthDate: null,
              note: ''
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input child name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender!' }]}
            >
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="Birth Date"
              rules={[{ required: true, message: 'Please select birth date!' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="note"
              label="Note"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => {
                  setIsEditModalVisible(false);
                  setCurrentChild(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={editLoading}
                  style={{ backgroundColor: '#0082c8' }}
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MemberLayout>
  );
};

export default ChildList; 