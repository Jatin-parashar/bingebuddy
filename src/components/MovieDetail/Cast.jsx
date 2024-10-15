import React from "react";
import styles from "./Cast.module.css";

const Cast = ({ person, imageWidth }) => {
  return (
    <>
      <img
        className={styles.poster}
        src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
        alt={`${person.name} Poster`}
        style={{ width: `${imageWidth}px`, height: `${imageWidth}px` }}
      />
      <h3>{person.name}</h3>
      <p>{person.character}</p>
    </>
  );
};

export default Cast;
