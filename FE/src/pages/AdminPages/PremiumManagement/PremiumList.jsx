import { useEffect } from "react";

const PremiumList = () => {
    useEffect(() => {
        document.title = "Admin - Premium Package List";
    }, []);

    return (
        <div>
            premium package list
        </div>
    );
};

export default PremiumList;
