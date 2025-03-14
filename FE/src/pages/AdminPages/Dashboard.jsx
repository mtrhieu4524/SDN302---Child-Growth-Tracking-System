import { useEffect } from "react";

const Dashboard = () => {
    useEffect(() => {
        document.title = "Admin - Dashboard";
    }, []);

    return (
        <div>
            dashboard
        </div>
    );
};

export default Dashboard;
