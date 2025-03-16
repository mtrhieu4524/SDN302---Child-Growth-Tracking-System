import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography, Card, Table } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const { Title } = Typography;

const growthData = [
    { key: "0", age: "0", weight: 3.2, height: 50, bmi: 12.8 },
    { key: "1", age: "3M", weight: 5.5, height: 60, bmi: 14.5 },
    { key: "2", age: "6M", weight: 7.8, height: 68, bmi: 16.2 },
    { key: "3", age: "1Y", weight: 9.5, height: 75, bmi: 17.1 },
    { key: "4", age: "2Y", weight: 12.0, height: 85, bmi: 18.0 },
    { key: "5", age: "5Y", weight: 18.0, height: 110, bmi: 18.2 },
    { key: "6", age: "10Y", weight: 30.0, height: 140, bmi: 19.5 },
    { key: "7", age: "15Y", weight: 50.0, height: 165, bmi: 20.8 },
];


const GrowthChart = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Growth Chart";
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
                <Title level={2} style={{ textAlign: "center", color: "#0056A1" }}>
                    Child Growth Chart
                </Title>
                <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
                    Track your child's weight, height, and BMI from infancy to adulthood.
                </p>

                <div style={{ display: "flex", gap: "20px", height: "650px" }}>
                    <Card
                        style={{
                            flex: 1,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            padding: "85px 40px 20px 0px",
                            height: "100%",
                        }}
                    >
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#0082C8" name="Weight (kg)" />
                                <Line type="monotone" dataKey="height" stroke="#00C853" name="Height (cm)" />
                                <Line type="monotone" dataKey="bmi" stroke="#FF9800" name="BMI" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card
                        style={{
                            flex: 1,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            padding: "0px 20px 20px 20px",
                            height: "100%",
                        }}
                    >
                        <Title level={3} style={{ textAlign: "center" }}>Growth Data Table</Title>
                        <Table
                            dataSource={growthData}
                            columns={[
                                { title: "Age", dataIndex: "age", key: "age" },
                                { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
                                { title: "Height (cm)", dataIndex: "height", key: "height" },
                                { title: "BMI", dataIndex: "bmi", key: "bmi" },
                            ]}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </div>
            </div>
            <br></br><br></br><br></br>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default GrowthChart;
