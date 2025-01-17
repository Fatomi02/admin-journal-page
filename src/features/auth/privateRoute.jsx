import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  let auth = localStorage.getItem("auth");
  return <>{auth !== "true" ? children : <Navigate to="/login" />}</>;
}

export default PrivateRoutes;
