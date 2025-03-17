import { useEffect, useState } from "react";
import { Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        visible && (
            <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                onClick={scrollToTop}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    background: "#EF6351",
                    borderColor: "#EF6351",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                }}
            >
                BACK TO TOP
            </Button>
        )
    );
};

export default ScrollToTop;
