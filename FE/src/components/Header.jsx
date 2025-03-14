import { Layout, Menu, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderComponent = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div style={{
                background: "linear-gradient(to right, #0082C8, #0056A1)",
                color: "white",
                textAlign: "center",
                padding: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                zIndex: 51,
                marginLeft: "-8px",
                marginRight: "-8px",
                margin: "-7px -8px 7px -8px"
            }}>
                Welcome to Child Growth Tracking
            </div>

            <Header style={{
                background: "#fff",
                padding: "0 5px 7px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "101%",
                maxWidth: "100vw",
                boxSizing: "border-box",
                borderBottom: "1px solid #ddd",
                marginLeft: "-8px",
                marginRight: "-8px",
                position: "sticky",
                top: "10px",
                zIndex: 50,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a href="/" title="Logo">
                        <h3 style={{ marginLeft: "10px", marginRight: "25px" }}>CHILD GROWTH TRACKING</h3>
                    </a>
                    <Input.Search placeholder="Search..." style={{ width: 250 }} />
                </div>

                <div style={{ flex: 1 }}>
                    <Menu mode="horizontal" style={{ marginTop: "6px", justifyContent: "center", display: "flex", borderBottom: "none" }}>
                        <Menu.Item key="growth-tracker">
                            <a href="#">Growth Tracker</a>
                        </Menu.Item>
                        <Menu.Item key="nutrition">
                            <a href="#">Nutrition Guide</a>
                        </Menu.Item>
                        <Menu.Item key="milestones">
                            <a href="#">Development Milestones</a>
                        </Menu.Item>
                        <Menu.Item key="about-us" onClick={() => navigate("/about-us")}>
                            About Us
                        </Menu.Item>
                    </Menu>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginRight: "10px" }}>
                    <a href="/login" style={{ color: "#1890ff", fontWeight: "500" }}>Sign in</a>
                    <Button
                        type="primary"
                        href="/register"
                        style={{ background: "#0082C8", borderColor: "#0082C8" }}
                    >
                        Create account
                    </Button>
                </div>

            </Header>
        </div>
    );
};

export default HeaderComponent;
