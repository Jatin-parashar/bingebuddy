import React from "react";
import styles from "./Recommendations.module.css";

const Recommendations = ({ movie }) => {
  return (
    <div className={styles.cardWrapper}>
      <img
        className={styles.posterImage}
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={`${movie.title} Poster`}
      />
      <div className={styles.infoWrapper}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
        <div className={styles.detailsWrapper}>
          <span className={styles.releaseYear}>
            {new Date(movie.release_date).getFullYear()}
          </span>
          <span className={styles.rating}>⭐ {movie.vote_average}</span>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
