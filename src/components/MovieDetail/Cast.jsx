import React from "react";
import styles from "./Cast.module.css";
import fallbackImg from "../../assets/user-image.jpg";

const Cast = ({ person }) => {
  return (
    <div className={styles.cast}>
      <img
        className={styles.poster}
        src={
          person.profile_path
            ? `https://image.tmdb.org/t/p/original/${person.profile_path}`
            : fallbackImg
        }
        alt={`${person.name} Poster`}
      />
      <p className={styles.name}>{person.name}</p>
      <p className={styles.character}>{person.character}</p>
    </div>
  );
};

export default Cast;
