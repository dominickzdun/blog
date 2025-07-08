import { Navigate } from "react-router";
import isTokenExpired from "./utils/isTokenExpired.js";

function ProtectedRoute({ children }) {
    const tokenExpired = isTokenExpired();

    if (tokenExpired) {
        // Clear expired token
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
