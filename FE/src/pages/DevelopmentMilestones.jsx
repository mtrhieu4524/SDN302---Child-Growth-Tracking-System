import { useEffect } from "react";
import { Timeline, Card, Typography, Table } from "antd";
import { SmileOutlined, RocketOutlined, BulbOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const { Title } = Typography;

const milestoneData = [
    { key: "1", age: "0-3 Months", milestone: "Smiles, follows objects, lifts head briefly", icon: <SmileOutlined style={{ color: "#ff5722" }} /> },
    { key: "2", age: "4-6 Months", milestone: "Rolls over, reaches for objects, babbles", icon: <RocketOutlined style={{ color: "#009688" }} /> },
    { key: "3", age: "7-9 Months", milestone: "Sits without support, responds to name, crawls", icon: <BulbOutlined style={{ color: "#ff9800" }} /> },
    { key: "4", age: "10-12 Months", milestone: "Stands with support, says simple words", icon: <RocketOutlined style={{ color: "#3f51b5" }} /> },
    { key: "5", age: "1-2 Years", milestone: "Walks independently, stacks objects, recognizes names", icon: <BulbOutlined style={{ color: "#4caf50" }} /> },
    { key: "6", age: "2-3 Years", milestone: "Runs, speaks short sentences, begins pretend play", icon: <SmileOutlined style={{ color: "#9c27b0" }} /> },
    { key: "7", age: "4-5 Years", milestone: "Hops, counts to 10, draws simple figures", icon: <RocketOutlined style={{ color: "#e91e63" }} /> },
];

const activityData = [
    { key: "1", age: "0-3 Months", activity: "Talk and sing to your baby, provide high-contrast toys." },
    { key: "2", age: "4-6 Months", activity: "Encourage tummy time, introduce colorful objects." },
    { key: "3", age: "7-9 Months", activity: "Let them explore textures, play peek-a-boo." },
    { key: "4", age: "10-12 Months", activity: "Encourage crawling, introduce simple words." },
    { key: "5", age: "1-2 Years", activity: "Read books together, play stacking games." },
    { key: "6", age: "2-3 Years", activity: "Encourage pretend play, introduce basic puzzles." },
    { key: "7", age: "4-5 Years", activity: "Practice counting, drawing, and storytelling." },
];

const DevelopmentMilestones = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Development Milestones";
    }, []);

    return (
        <div style={{ background: "#f9f9f9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
                <Title level={2} style={{ textAlign: "center", color: "#00274E" }}>
                    Development Milestones
                </Title>
                <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
                    Track important milestones in your child's physical and cognitive development.
                </p>

                <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
                    <Card
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            padding: "60px 70px 20px 0px",
                        }}
                    >
                        <Timeline mode="left">
                            {milestoneData.map(({ key, age, milestone, icon }) => (
                                <Timeline.Item key={key} label={<strong>{age}</strong>} dot={icon}>
                                    {milestone}
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>

                    <Card
                        style={{
                            flex: 1,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            padding: "20px",
                        }}
                    >
                        <Title level={3} style={{ textAlign: "center" }}>Recommended Activities</Title>
                        <Table
                            dataSource={activityData}
                            columns={[
                                { title: "Age", dataIndex: "age", key: "age" },
                                { title: "Suggested Activities", dataIndex: "activity", key: "activity" },
                            ]}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </div>
            </div>

            <br /><br /><br />
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default DevelopmentMilestones;
