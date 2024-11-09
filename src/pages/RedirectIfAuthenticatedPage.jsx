import React from "react";
import { useUserAuth } from "../store/UserAuthContextProvider";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticatedPage = ({ children }) => {
  const { user } = useUserAuth();
  if (user && user.emailVerified && user.displayName) {
    return <Navigate to="/" />;
  }
  return children;
};

export default RedirectIfAuthenticatedPage;
