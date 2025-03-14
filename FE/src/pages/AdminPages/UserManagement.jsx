import { useEffect } from "react";

const UserManagement = () => {
    useEffect(() => {
        document.title = "Admin - User Management";
    }, []);

    return (
        <div>
            user management
        </div>
    );
};

export default UserManagement;
