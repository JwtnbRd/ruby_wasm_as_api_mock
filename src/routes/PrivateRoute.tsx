import { useAuth } from "@/context/Authcontext"
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? <h1>Loading...</h1> : user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;