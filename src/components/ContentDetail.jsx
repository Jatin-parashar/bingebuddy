import React from "react";
import styles from "./ContentDetail.module.css";

const ContentDetail = ({ details }) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.contentWrapper}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${details.backdrop_path})`,
        }}
      >
        <div className={styles.card}>
          {details.poster_path && (
            <img
              className={styles.poster}
              src={`https://image.tmdb.org/t/p/original/${details.poster_path}`}
              alt={`${details.title || details.name || "No Title"} Poster`}
            />
          )}
          <div className={styles.details}>
            <h2 className={styles.title}>
              {details.title || details.name || "No Title Available"}
            </h2>
            <div className={styles.info}>
              {(details.release_date || details.first_air_date) && (
                <>
                  {details.releaseDate && (
                    <span className={styles.releaseDate}>
                      {details.release_date.replace(/-/g, ".")}
                    </span>
                  )}
                  {details.first_air_date && (
                    <span className={styles.releaseDate}>
                      {details.first_air_date.replace(/-/g, ".")}
                    </span>
                  )}
                </>
              )}
              {details.runtime && (
                <span className={styles.runtime}>
                  {details.runtime} minutes
                </span>
              )}
              {details.vote_average && (
                <span className={styles.rating}>
                  Rating: {details.vote_average}
                </span>
              )}
            </div>
            <div className={styles.genres}>
              <div className={styles.genresContainer}>
                {details.genres &&
                  details.genres.map((genre) => (
                    <div className={styles.genreBox} key={genre.id}>
                      {genre.name}
                    </div>
                  ))}
              </div>
            </div>
            {details.overview && (
              <div className={styles.plot}>
                <strong>Plot:</strong> {details.overview}
              </div>
            )}
            {details.original_language && (
              <div className={styles.language}>
                <strong>Language:</strong> {details.original_language}
              </div>
            )}
            {details.tagline && (
              <div className={styles.tagline}>
                <strong>Tagline:</strong> {details.tagline}
              </div>
            )}
            {details.production_companies &&
              details.production_companies.length > 0 && (
                <div className={styles.production}>
                  <strong>Produced by:</strong>{" "}
                  {details.production_companies
                    .map((company) => company.name)
                    .join(", ")}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
