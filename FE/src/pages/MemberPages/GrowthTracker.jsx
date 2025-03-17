import { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  message,
  Card,
  Typography,
  Table,
  Modal,
  Spin,
  Tag,
  Popconfirm,
} from "antd";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { RightOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../configs/api";

const { Title, Text } = Typography;

const GrowthTracker = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { childId } = useParams();
  const [childInfo, setChildInfo] = useState(null);
  const [isGrowthDataVisible, setIsGrowthDataVisible] = useState(false);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch child info
  const fetchChildInfo = async () => {
    if (!childId) {
      navigate('/profile/children');
      return;
    }
    try {
      const response = await api.get(`/children/${childId}`);
      if (response.data && response.data.child) {
        setChildInfo(response.data.child);
      }
    } catch (error) {
      console.error('Error fetching child info:', error);
      message.error('Failed to load child information');
      navigate('/profile/children');
    }
  };

  useEffect(() => {
    fetchChildInfo();
  }, [childId]);

  // Fetch growth data for selected child
  const fetchGrowthData = async () => {
    if (!childId) return;
    try {
      setLoading(true);
      const response = await api.get(`/children/${childId}/growth-data`);
      if (response.data && response.data.growthData) {
        setGrowthData(response.data.growthData.map(record => ({
          ...record,
          key: record._id
        })));
      }
    } catch (error) {
      console.error('Error fetching growth data:', error);
      message.error('Failed to load growth data');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!childId) return;

    try {
      setLoading(true);
      const newMeasurement = {
        height: values.height,
        weight: values.weight,
        inputDate: values.date.toISOString(),
        headCircumference: values.headCircumference,
        armCircumference: values.armCircumference,
      };

      const response = await api.post(`/children/${childId}/growth-data`, newMeasurement);
      
      if (response.data && response.data.message === "Success") {
        message.success("Growth data added successfully!");
        form.resetFields(['weight', 'height', 'headCircumference', 'armCircumference']);
        fetchGrowthData(); // Refresh data list
      }
    } catch (error) {
      console.error('Error saving growth data:', error);
      if (error.response) {
        if (error.response.status === 409) {
          message.error('A measurement for this date already exists. Please choose a different date.');
        } else {
          message.error(`Failed to save growth data: ${error.response.data.message || 'Unknown error'}`);
        }
      } else {
        message.error('Failed to save growth data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showGrowthData = () => {
    if (!childId) return;
    fetchGrowthData();
    setIsGrowthDataVisible(true);
  };

  const handleDelete = async (growthDataId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/children/${childId}/growth-data/${growthDataId}`);
      
      if (response.data && response.data.message === "Success") {
        message.success("Growth data deleted successfully");
        // Refresh data list after deletion
        fetchGrowthData();
      }
    } catch (error) {
      console.error('Error deleting growth data:', error);
      message.error('Failed to delete growth data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'inputDate',
      key: 'inputDate',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Height (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'Head Circumference (cm)',
      dataIndex: 'headCircumference',
      key: 'headCircumference',
    },
    {
      title: 'Arm Circumference (cm)',
      dataIndex: 'armCircumference',
      key: 'armCircumference',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Delete Growth Data"
          description="Are you sure you want to delete this growth data?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    }
  ];

  useEffect(() => {
    document.title = "Child Growth Tracking - Child Growth Tracker";
  }, []);

  if (!childId || !childInfo) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <HeaderComponent />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>Please select a child from the Child List first</Title>
          <Button 
            type="primary" 
            onClick={() => navigate('/profile/children')}
            style={{ marginTop: '20px' }}
          >
            Go to Child List
          </Button>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <div
        style={{
          minHeight: "calc(100vh - 128px)",
          padding: "80px 20px 10px 20px",
          background: "#f0f2f5",
        }}>
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
                  Child Growth Tracker
                </Title>
                <Text type="secondary">
                  Record your child's growth measurements
                </Text>
                {childInfo && (
                  <Text strong style={{ display: 'block', marginTop: '8px' }}>
                    Child: {childInfo.name}
                  </Text>
                )}
              </div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Button
                  type="primary"
                  onClick={showGrowthData}
                  style={{
                    backgroundColor: "#0082c8",
                    borderColor: "#0082c8",
                  }}>
                  Growth Data
                </Button>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#0082c8",
                    borderColor: "#0082c8",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                  onClick={() => navigate(`/profile/growth-chart/${childId}`)}>
                  Child Growth Chart <RightOutlined />
                </Button>
              </div>
            </div>
          }
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          headStyle={{ background: "#fafafa", borderBottom: "none" }}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ date: moment() }}>
            <Form.Item
              name="date"
              label="Measurement Date"
              rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker 
                style={{ width: "100%" }} 
                size="large"
                showTime
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="Weight (kg)"
              rules={[{ required: true, message: "Please enter weight" }]}>
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: "100%" }}
                placeholder="Enter weight in kg"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="height"
              label="Height (cm)"
              rules={[{ required: true, message: "Please enter height" }]}>
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: "100%" }}
                placeholder="Enter height in cm"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="headCircumference"
              label="Head Circumference (cm)">
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: "100%" }}
                placeholder="Enter Head Circumference"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="armCircumference"
              label="Arm Circumference (cm)">
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: "100%" }}
                placeholder="Enter Arm Circumference"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "100%",
                  borderRadius: 4,
                  background: "#0082C8",
                  border: "none",
                  height: 40,
                }}
                size="large">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Modal
          title="Growth Data History"
          open={isGrowthDataVisible}
          onCancel={() => setIsGrowthDataVisible(false)}
          width={1000}
          footer={null}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={growthData}
              columns={columns}
              rowKey="_id"
              pagination={false}
              scroll={{ y: 400 }}
            />
          )}
        </Modal>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default GrowthTracker;
