import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ScrollToTop from "./../components/ScrollToTop";
import { Card, Typography, Avatar, Button } from "antd";
import { UserAddOutlined, LineChartOutlined, SearchOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  useEffect(() => {
    document.title = "Child Growth Tracking - Home";
  }, []);


  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 0) {
        navigate("/profile/growth-chart");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, #fcfcf3, #d6eaff)",
        padding: "30px 10%",
        minHeight: "400px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block" }}>
            <Title style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "#0082C8",
              marginBottom: "20px",
            }}>
              Take Charge of Your Child/Ward’s Growth and Development.
            </Title>
            <hr style={{
              width: "130px",
              height: "3px",
              backgroundColor: "#0082C8",
              border: "none",
              margin: "0",
            }} />
          </div>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Text style={{ fontSize: "15px", color: "#333" }}>
              Our system helps you visualize your child’s growth and development, compare it to world-class standards,
              and get up-to-date insights on how your child is progressing relative to others.
            </Text>
          </div>

          {(!user || user.role === 0) && (
            <Button
              type="primary"
              style={{
                backgroundColor: "#0082C8",
                borderColor: "#0082C8",
                padding: "12px 24px",
                fontSize: "15px",
                borderRadius: "50px"
              }}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          )}
        </div>

        <div style={{ height: 250, flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
          <img src="https://nigrowth.com/assets/img/banner-img.png" alt="Growth Tracking" style={{ maxWidth: "400px", borderRadius: "10px" }} />
        </div>
      </div>

      <div style={{ padding: "60px 10%", textAlign: "left" }}>
        <div style={{ display: "inline-block" }}>
          <Title style={{ color: "#666", fontSize: "16px", textTransform: "uppercase", marginBottom: "-20px" }}>The Process</Title>
          <Title style={{ fontSize: "25px", fontWeight: "bold", color: "#00274E", marginBottom: "10px" }}>
            How Child Growth Tracking Works
          </Title>
          <hr style={{
            width: "130px",
            height: "3px",
            backgroundColor: "#0082C8",
            border: "none",
            margin: "0",
          }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "30px" }}>
          <div style={{
            flex: 1,
            background: "#fff",
            padding: "30px",
            borderRadius: "none",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left"
          }}>
            <UserAddOutlined style={{ fontSize: "40px", color: "#0082C8", marginBottom: "5px" }} />
            <Title style={{ fontSize: "18px", fontWeight: "bold", color: "#00274E" }}>Add a Child to Track</Title>
            <Text style={{ fontSize: "14px", color: "#666" }}>Get started by adding a child to track and entering basic details.</Text>
          </div>

          <div style={{
            flex: 1,
            background: "#fff",
            padding: "30px",
            borderRadius: "none",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left"
          }}>
            <LineChartOutlined style={{ fontSize: "40px", color: "#0082C8", marginBottom: "5px" }} />
            <Title style={{ fontSize: "18px", fontWeight: "bold", color: "#00274E" }}>Enter Child’s Measurement</Title>
            <Text style={{ fontSize: "14px", color: "#666" }}>Record all necessary measurements with the corresponding date.</Text>
          </div>

          <div style={{
            flex: 1,
            background: "#fff",
            padding: "30px",
            borderRadius: "none",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left"
          }}>
            <SearchOutlined style={{ fontSize: "40px", color: "#0082C8", marginBottom: "5px" }} />
            <Title style={{ fontSize: "18px", fontWeight: "bold", color: "#00274E" }}>See How Child Compares</Title>
            <Text style={{ fontSize: "14px", color: "#666" }}>Check standard charts and graphs to compare growth progress.</Text>
          </div>
        </div>

        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <Title style={{ fontSize: "25px", color: "#00274E", marginBottom: "20px", paddingLeft: "80px", paddingRight: "80px" }}>
            Want to monitor your child’s growth to avoid future complications and track potential health issues?
          </Title>
          {(!user || user.role === 0) && (
            <Button
              type="primary"
              style={{
                backgroundColor: "#0082C8",
                borderColor: "#0082C8",
                padding: "12px 24px",
                fontSize: "15px",
                borderRadius: "50px"
              }}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>

      <div style={{ background: "#f9f9f9", padding: "60px 10%", textAlign: "center" }}>
        <Title style={{ fontSize: "25px", fontWeight: "bold", color: "#00274E", marginBottom: "10px" }}>
          Get the mobile app
        </Title>
        <Text style={{ fontSize: "16px", color: "#666", marginBottom: "30px", maxWidth: "600px", margin: "0 auto" }}>
          Child Growth Tracking is your one-stop platform for anything relating to tracking and
          monitoring child growth to ensure your child is off to a great start in life.
        </Text>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px", marginBottom: "20px" }}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" style={{ height: "50px" }} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" style={{ height: "50px" }} />
          </a>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 10%", backgroundColor: "#fff" }}>
        <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "350px", height: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>

            <div style={{ position: "absolute", width: "300px", height: "300px", backgroundColor: "#d6eaff", borderRadius: "50%", zIndex: -1 }}></div>

            <img
              src="https://nigrowth.com/assets/img/mobile-app-mockup.png"
              alt="Mobile App"
              style={{
                marginTop: "25px",
                width: "120%",
                position: "absolute",
                left: "-60px",
                zIndex: 2,
                borderRadius: "10px",
                outline: "none"
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "left", paddingLeft: "40px" }}>
          <Title level={2} style={{ fontWeight: "bold", color: "#00274E", marginBottom: "10px" }}>
            Trusted by medical professionals & parents worldwide
          </Title>
          <Text style={{ color: "#666", display: "block", marginBottom: "30px" }}>
            Feedback from amazing professionals and parents using the Child Growth Tracking System.
          </Text>

          <div style={{ display: "flex", gap: "20px" }}>
            <Card style={{ borderRadius: 0, flex: 1, textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" size={60} style={{ margin: "auto" }} />
              <div style={{ marginTop: "10px" }}>
                <Title level={5} style={{ fontWeight: "bold", color: "#00274E", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                  Darren Elder <CheckCircleOutlined style={{ fontSize: "18px", color: "#0082C8" }} />
                </Title>
                <Text style={{ color: "#666", display: "block", marginTop: "10px" }}>
                  Child Growth Tracking is indeed very helpful and easy to use. I used it to track my child’s growth to make sure my child is growing well without any issues.
                </Text>
              </div>
            </Card>

            <Card style={{ borderRadius: 0, flex: 1, textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" size={60} style={{ margin: "auto" }} />
              <div style={{ marginTop: "10px" }}>
                <Title level={5} style={{ fontWeight: "bold", color: "#00274E", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                  Deborah Angel <CheckCircleOutlined style={{ fontSize: "18px", color: "#0082C8" }} />
                </Title>
                <Text style={{ color: "#666", display: "block", marginTop: "10px" }}>
                  Child Growth Tracking is indeed very helpful and easy to use. I used it to track my child’s growth to make sure my child is growing well without any issues.
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>


      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
