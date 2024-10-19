import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection:"column"
      }}
    >
      <h1>Oops! An error occurred.</h1>
      <p>{error.statusText || error.message}</p>
      <p>Error Code: {error.status || "Unknown"}</p>
    </div>
  );
};

export default ErrorPage;
