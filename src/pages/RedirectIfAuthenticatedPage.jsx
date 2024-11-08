import React from "react";
import { useUserAuth } from "../store/UserAuthContextProvider";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticatedPage = ({children}) => {
  const { user } = useUserAuth();

  console.log(user);
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default RedirectIfAuthenticatedPage;
