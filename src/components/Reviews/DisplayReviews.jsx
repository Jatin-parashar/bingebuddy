import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DisplayReviews.module.css";
import usr from "../../assets/user-image.jpg";

const DisplayReviews = ({ RefreshDisplay }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const params = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const queryURL = `${
          import.meta.env.VITE_FIREBASE_DATABASE_URL
        }/reviews/${params.contentId}.json`;

        const response = await axios.get(queryURL);
        const reviewsData = response.data;

        if (!reviewsData) {
          setReviews([]);
          return;
        }

        const filteredReviews = Object.keys(reviewsData).map(
          (key) => reviewsData[key]
        );
        setReviews(filteredReviews);
      } catch (err) {
        setError("Failed to load reviews. Please try again later.");
      }
    };

    fetchReviews();
  }, [RefreshDisplay]);

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
                  <img
                    src={usr}
                    alt="Reviewer"
                  />
                </div>
                <div className={styles.reviewerDetails}>
                  <div className={styles.reviewerName}>{review.name}</div>
                  <div className={styles.reviewDate}>
                    {review.createdAt}
                  </div>
                </div>
                <div className={styles.rating}>{review.rating}/10 ⭐ </div>
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.reviewText}>
                  {expanded[index]
                    ? review.review
                    : review.review.length > 150
                    ? `${review.review.substring(0, 150)}...`
                    : review.review}
                </div>
                {review.review.length > 150 && (
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