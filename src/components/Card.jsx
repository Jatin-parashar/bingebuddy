import React from "react";
import styles from "./Card.module.css";

const Card = ({ person }) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.poster}
        src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
        alt={`${person.name} Poster`}
      />
      <h3>{person.name}</h3>
      <p>{person.character}</p>
    </div>
  );
};

export default Card;
