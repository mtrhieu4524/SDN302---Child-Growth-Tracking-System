import { useEffect } from "react";

const RequestManagement = () => {
    useEffect(() => {
        document.title = "Admin - Request Management";
    }, []);

    return (
        <div>
            request management
        </div>
    );
};

export default RequestManagement;
