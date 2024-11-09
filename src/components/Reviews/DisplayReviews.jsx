import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DisplayReviews.module.css";
import usr from "../../assets/user-image.jpg";
import { fetchData, listenForValueEvents } from "../../db/firebasedb";

const DisplayReviews = ({}) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const params = useParams();

  useEffect(() => {

    const unsubscribe = listenForValueEvents(
      params.contentType+"reviews/" + params.contentId,
      (reviewsData) => {
        if (!reviewsData) {
          setReviews([]);
          return;
        }
        const filteredReviews = Object.keys(reviewsData).map(
          (key) => reviewsData[key]
        );
        setReviews(filteredReviews);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.reviewsContainer}>
      {error && <div className={styles.error}>{error}</div>}

      {reviews.length > 0 ? (
        <ul className={styles.reviewList}>
          {reviews.map((review, index) => (
            <li key={index} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.imageContainer}>
                  <img src={usr} alt="Reviewer" />
                </div>
                <div className={styles.reviewerDetails}>
                  <div className={styles.reviewerName}>{review.name} </div>
                  {/* <span style={{color:"grey",fontSize:"9px"}}>{review.email}</span> */}
                  <div className={styles.reviewDate}>{review.createdAt}</div>
                </div>
                <div className={styles.rating}>{review.rating}/10 ⭐ </div>
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.reviewText}>
                  {expanded[index]
                    ? review.review
                    : review.review.length > 100
                    ? `${review.review.substring(0, 100)}...`
                    : review.review}
                </div>
                {review.review.length > 100 && (
                  <span
                    className={styles.readMore}
                    onClick={() => toggleReadMore(index)}
                  >
                    {expanded[index] ? "Read Less" : "Read More"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReviews}>No reviews found for this content.</p>
      )}
    </div>
  );
};

export default DisplayReviews;
