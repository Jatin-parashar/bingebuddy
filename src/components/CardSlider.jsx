import React from "react";
import styles from "./CardSlider.module.css";

const CardSlider = ({cast}) => {

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.cardContainer}>
        {cast.map((person) => (
          <div key={person.id} className={styles.card}>

          <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
                    alt={`${person.name} Poster`}
                  />
            <h3>{person.name}</h3>
            <p>{person.character}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;
