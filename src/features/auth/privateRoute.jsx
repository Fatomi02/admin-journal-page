import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const data = localStorage.getItem("data");
  const auth = JSON.parse(data);
  return <>{auth?.token ? children : <Navigate to="/login" />}</>;
}

export default PrivateRoutes;
