import { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  message,
  Card,
  Typography,
  Select,
  Input,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header";
import FooterComponent from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { RightOutlined, PlusOutlined, FormOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const GrowthTracker = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([
    { id: 1, name: "Emma Johnson" },
    { id: 2, name: "Liam Smith" },
    { id: 3, name: "Olivia Brown" },
  ]);
  const [isAddingChild, setIsAddingChild] = useState(false);

  useEffect(() => {
    if (children.length > 0) {
      setSelectedChild(children[0].id);
    }
  }, [children]);

  const handleChildChange = (value) => {
    setSelectedChild(value);
  };

  const toggleFormMode = () => {
    setIsAddingChild(!isAddingChild);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isAddingChild) {
      const newChild = {
        id: children.length + 1,
        name: values.fullName,
        birthday: values.birthday.format("YYYY-MM-DD"),
      };
      setChildren([...children, newChild]);
      setSelectedChild(newChild.id);
      message.success("New child added successfully!");
      setIsAddingChild(false);
    } else {
      const newMeasurement = {
        date: values.date.format("YYYY-MM-DD"),
        weight: values.weight,
        height: values.height,
        bmi: (
          values.weight / ((values.height / 100) * (values.height / 100))
        ).toFixed(2),
      };
      message.success("Measurement saved successfully!");
    }
    form.resetFields();
  };

  useEffect(() => {
    document.title = "Child Growth Tracking - Child Growth Tracker";
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <div style={{ minHeight: "calc(100vh - 128px)", padding: "80px 20px 10px 20px", background: "#f0f2f5" }}>
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <Title level={2} style={{ color: "#0056A1", marginBottom: 0 }}>
                  Child Growth Tracker
                </Title>
                <Text type="secondary">Record your child's growth measurements</Text>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Select
                  value={selectedChild}
                  onChange={handleChildChange}
                  style={{ width: 200 }}
                  disabled={isAddingChild}
                >
                  {children.map((child) => (
                    <Option key={child.id} value={child.id}>
                      {child.name}
                    </Option>
                  ))}
                </Select>
                <Button type="default" icon={isAddingChild ? <FormOutlined /> : <PlusOutlined />} onClick={toggleFormMode} >
                  {isAddingChild ? "Add Data" : "Add Child"}
                </Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#0082c8", borderColor: "#0082c8", display: "flex", alignItems: "center", gap: "5px" }}
                  onClick={() => navigate("/profile/growth-chart")}
                >
                  Child Growth Chart <RightOutlined />
                </Button>
              </div>
            </div>
          }
          style={{ maxWidth: 900, margin: "0 auto", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          headStyle={{ background: "#fafafa", borderBottom: "none" }}
        >
          <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ date: moment() }}>
            {isAddingChild ? (
              <>
                <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter child's full name" }]}>
                  <Input placeholder="Enter child's full name" size="large" />
                </Form.Item>
                <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: "Please select a birthday" }]}>
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item name="date" label="Measurement Date" rules={[{ required: true, message: "Please select a date" }]}>
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
                <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true, message: "Please enter weight" }]}>
                  <InputNumber min={0} step={0.1} style={{ width: "100%" }} placeholder="Enter weight in kg" size="large" />
                </Form.Item>
                <Form.Item name="height" label="Height (cm)" rules={[{ required: true, message: "Please enter height" }]}>
                  <InputNumber min={0} step={0.1} style={{ width: "100%" }} placeholder="Enter height in cm" size="large" />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: "100%", borderRadius: 4, background: "#0082C8", border: "none", height: 40 }} size="large">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <FooterComponent />
      <ScrollToTop />
    </div>
  );
};

export default GrowthTracker;
