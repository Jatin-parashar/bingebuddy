import React, { Children } from "react";
import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";

const Card = ({children, path="/"}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card} onClick={()=>{navigate(path)}}>
      {children}
    </div>
  );
};

export default Card;
