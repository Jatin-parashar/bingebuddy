import React, { Children } from "react";
import styles from "./Card.module.css";

const Card = ({ cardWidth = 100 ,children}) => {
  return (
    <div className={styles.card} style={{width:cardWidth}}>
      {children}
    </div>
  );
};

export default Card;
