import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role")?.toLowerCase();
  console.log("ProtectedRoute role:", role);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;