import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  // userdata from provider to check if user is logged in
  let { userData } = useContext(AuthContext);

  // if user is logged render outlet (homepage), else - redirect to login page
  return userData ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
