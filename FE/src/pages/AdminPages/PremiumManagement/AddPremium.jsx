import { useEffect } from "react";

const AddPremium = () => {
    useEffect(() => {
        document.title = "Admin - Add Premium Package";
    }, []);

    return (
        <div>
            add premium package
        </div>
    );
};

export default AddPremium;
