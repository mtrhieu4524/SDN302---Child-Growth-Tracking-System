import { useEffect } from "react";
import { Collapse, Typography } from "antd";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const FAQs = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Frequently Asked Questions";
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <br /><br />
            <div className="container mx-auto px-4 py-12">
                <Title level={2} style={{ textAlign: "center", color: "#00274E", fontWeight: "bold" }}>
                    Frequently Asked Questions
                </Title>
                <Paragraph style={{ textAlign: "center", color: "#666", maxWidth: "700px", margin: "auto" }}>
                    Find answers to the most commonly asked questions about Child Growth Tracking.
                </Paragraph>

                <Collapse accordion style={{ maxWidth: "800px", margin: "40px auto" }}>
                    <Panel header="How do I start tracking my child's growth?" key="1">
                        <Paragraph>To start tracking your child's growth, sign up for an account, add your child's profile, and enter their measurements.</Paragraph>
                    </Panel>
                    <Panel header="Is my child's data secure?" key="2">
                        <Paragraph>Yes, we prioritize data security and use encryption to protect your child's information.</Paragraph>
                    </Panel>
                    <Panel header="Can I track multiple children?" key="3">
                        <Paragraph>Yes, you can add multiple children under one account and manage their growth progress individually.</Paragraph>
                    </Panel>
                    <Panel header="How do I compare my child's growth with standard charts?" key="4">
                        <Paragraph>Our platform provides WHO and CDC standard growth charts to compare your child's growth percentile.</Paragraph>
                    </Panel>
                    <Panel header="Is there a mobile app available?" key="5">
                        <Paragraph>Yes, we have a mobile app that allows you to track your child's growth conveniently from your phone.</Paragraph>
                    </Panel>
                    <Panel header="What types of growth metrics can I track?" key="6">
                        <Paragraph>You can track height, weight, head circumference, BMI, and other key growth indicators.</Paragraph>
                    </Panel>
                    <Panel header="How often should I update my child's growth records?" key="7">
                        <Paragraph>It is recommended to update the measurements at least once a month for accurate tracking.</Paragraph>
                    </Panel>
                    <Panel header="Can I share my child's growth data with doctors?" key="8">
                        <Paragraph>Yes, you can download and share growth reports with pediatricians for professional analysis.</Paragraph>
                    </Panel>
                    <Panel header="What happens if I enter incorrect data?" key="9">
                        <Paragraph>You can always edit or delete incorrect entries from your child's growth record.</Paragraph>
                    </Panel>
                    <Panel header="Does the platform provide growth predictions?" key="10">
                        <Paragraph>Yes, we use AI-powered analytics to provide growth trend predictions based on historical data.</Paragraph>
                    </Panel>
                    <Panel header="Is Child Growth Tracking free to use?" key="11">
                        <Paragraph>We offer a free version with basic features. Premium plans provide advanced tracking and analytics.</Paragraph>
                    </Panel>
                    <Panel header="Can both parents access the same child's profile?" key="12">
                        <Paragraph>Yes, multiple family members can have shared access to a child's growth records.</Paragraph>
                    </Panel>
                    <Panel header="Does the system send reminders for measurements?" key="13">
                        <Paragraph>Yes, you can enable reminders to receive notifications for updating your child's growth data.</Paragraph>
                    </Panel>
                    <Panel header="What age range does the tracking support?" key="14">
                        <Paragraph>Our platform supports growth tracking from newborns up to 18 years of age.</Paragraph>
                    </Panel>
                    <Panel header="Are the growth charts based on medical standards?" key="15">
                        <Paragraph>Yes, we follow WHO and CDC guidelines to ensure medically accurate growth comparisons.</Paragraph>
                    </Panel>
                    <Panel header="Can I export my child's growth data?" key="16">
                        <Paragraph>Yes, you can export reports in PDF or CSV format for record-keeping or medical consultation.</Paragraph>
                    </Panel>
                    <Panel header="Is there a support team available for help?" key="17">
                        <Paragraph>Yes, our support team is available 24/7 to assist with any issues or questions.</Paragraph>
                    </Panel>
                    <Panel header="How do I delete my account if needed?" key="18">
                        <Paragraph>You can request account deletion in the settings or contact our support team for assistance.</Paragraph>
                    </Panel>
                    <Panel header="What devices are compatible with the platform?" key="19">
                        <Paragraph>The platform works on web browsers, Android, and iOS devices.</Paragraph>
                    </Panel>
                    <Panel header="How do I subscribe to the premium version?" key="20">
                        <Paragraph>You can subscribe through our pricing page and choose between monthly or yearly plans.</Paragraph>
                    </Panel>
                </Collapse>
            </div>

            <br /><br /><br /><br />
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default FAQs;
