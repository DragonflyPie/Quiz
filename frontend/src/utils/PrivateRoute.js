import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  let { userData } = useContext(AuthContext);

  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
