import { Layout, Menu, Button, Input, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Header } = Layout;

const HeaderComponent = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Kiểm tra user trong localStorage
        const user = localStorage.getItem("user");
        const adminToken = localStorage.getItem("adminToken");

        if (adminToken) {
            setIsLoggedIn(true);
            setUserName("Admin User");
        } else if (user) {
            const userData = JSON.parse(user);
            setIsLoggedIn(true);
            setUserName(userData.username || "User");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        setIsLoggedIn(false);
        setUserName("");
        navigate("/login");
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <a href="/profile">Hồ sơ</a>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

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
                paddingTop: "10px",
                marginBottom: "5px"
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
                        <h3 style={{ marginTop: "25px", marginLeft: "10px", marginRight: "25px" }}>CHILD GROWTH TRACKING</h3>
                    </a>
                    {/* <Input.Search placeholder="Search..." style={{ width: 250 }} /> */}
                </div>

                <div style={{ flex: 1, marginTop: "5px" }}>
                    <Menu mode="horizontal" style={{ justifyContent: "center", display: "flex", borderBottom: "none" }}>
                        <Menu.SubMenu key="tracking" title="Growth Tracking">
                            <Menu.Item key="growth-tracker">
                                <a href="/growth-tracker">Tracker</a>
                            </Menu.Item>
                            <Menu.Item key="growth-charts">
                                <a href="/growth-charts">Growth Charts</a>
                            </Menu.Item>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="health" title="Health & Nutrition">
                            <Menu.Item key="milestones">
                                <a href="/milestones">Development Milestones</a>
                            </Menu.Item>
                            <Menu.Item key="alerts">
                                <a href="/alerts">Health Alerts</a>
                            </Menu.Item>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="services" title="Services">
                            <Menu.Item key="consultation">
                                <a href="/consultation">Doctor Consultation</a>
                            </Menu.Item>
                            <Menu.Item key="membership">
                                <a href="/membership">Membership Plan</a>
                            </Menu.Item>
                        </Menu.SubMenu>

                        <Menu.SubMenu key="blogs&faqs" title="Blog & FAQ">
                            <Menu.Item key="blogs">
                                <a href="/blogs">Blogs</a>
                            </Menu.Item>
                            <Menu.Item key="faqs">
                                <a href="/faqs">FAQs</a>
                            </Menu.Item>
                        </Menu.SubMenu>

                        <Menu.Item key="about-us">
                            <a href="/about-us">About Us</a>
                        </Menu.Item>
                    </Menu>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginRight: "10px" }}>
                    {isLoggedIn ? (
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <a style={{ color: "#1890ff", fontWeight: "500", display: "flex", alignItems: "center" }}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                {userName}
                            </a>
                        </Dropdown>
                    ) : (
                        <>
                            <a href="/login" style={{ color: "#1890ff", fontWeight: "500" }}>Sign in</a>
                            <Button
                                type="primary"
                                href="/register"
                                style={{ background: "#0082C8", borderColor: "#0082C8" }}
                            >
                                Create account
                            </Button>
                        </>
                    )}
                </div>

            </Header>
        </div>
    );
};

export default HeaderComponent;
