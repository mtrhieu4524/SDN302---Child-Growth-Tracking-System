import { useEffect } from "react";

const Login = () => {
    useEffect(() => {
        document.title = "Child Growth Tracking - Sign In";
    }, []);
    return (
        <div>
            login page
        </div>
    );
};

export default Login;
