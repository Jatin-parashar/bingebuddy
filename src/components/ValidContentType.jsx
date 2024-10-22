import React from "react";
import { Navigate, useParams } from "react-router-dom";

const ValidContentType = ({ children }) => {
  const { contentType } = useParams();
  const acceptedTypes = ["movie", "tv"];

  if (!acceptedTypes.includes(contentType)) {
    const error = new Error("Page does not exist!");
    error.statusCode = 404;
    throw error;
  }

  return children; 
};

export default ValidContentType;
