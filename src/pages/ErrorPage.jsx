import React from "react";
import { useRouteError } from "react-router-dom";
// import { createUser, deleteUser, getUser, updateUser } from "../db/firebasedb";

const ErrorPage = ({ message }) => {
  const error = useRouteError();
  // console.error(error);


  // createUser( "user2", {
  //   username: "example_user",
  //   email: "user@example.com",
  // });
  // getUser("user2");
  // updateUser("user2", { email: "newemail@example.com" });
  // deleteUser(db, "user1");




  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Oops! An error occurred.</h1>
      {error ? (
        <>
          <p>{error.statusText || error.message}</p>
        </>
      ): <p>{message}</p>}
    </div>
  );
};

export default ErrorPage;
