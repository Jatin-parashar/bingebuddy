import React from "react";
import styles from "./CardDisplay.module.css";
import Card from "./Card";

const CardDisplay = ({ contentArray, cardWidth, media_type }) => {
  return (
    <>
      {contentArray &&
        contentArray.map((content) => {
          const mediaType = media_type || content.media_type; 
          return (
            <Card
              key={content.id}
              path={`/${mediaType}/detail/${content.id}`} 
            >
              <img
                className={styles.posterImage}
                src={`https://image.tmdb.org/t/p/original/${content.poster_path}`}
                alt={`${content.title || content.name} Poster`}
                style={{ width: cardWidth }}
              />
              <div className={styles.infoWrapper} style={{ width: cardWidth }}>
                <h3 className={styles.movieTitle}>
                  {content.name || content.title}
                </h3>
                <div className={styles.detailsWrapper}>
                  <span className={styles.releaseYear}>
                    {content.release_date &&
                      new Date(content.release_date).getFullYear()}
                    {content.first_air_date &&
                      new Date(content.first_air_date).getFullYear()}
                  </span>
                  <span className={styles.rating}>⭐ {content.vote_average}</span>
                </div>
              </div>
            </Card>
          );
        })}
    </>
  );
};

export default CardDisplay;
