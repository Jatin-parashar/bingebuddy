import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DisplayReviews.module.css"; // Import CSS module

const DisplayReviews = ({ RefreshDisplay }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const queryURL = `${
          import.meta.env.VITE_FIREBASE_DATABASE_URL
        }/reviews/${params.contentId}.json`;

        const response = await axios.get(queryURL);
        const reviewsData = response.data;
        console.log(reviewsData);

        if (!reviewsData) {
          setReviews([]);
          return;
        }

        const filteredReviews = Object.keys(reviewsData).map(
          (key) => reviewsData[key]
        );
        console.log(filteredReviews);

        setReviews(filteredReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      }
    };

    fetchReviews();
  }, [RefreshDisplay]);

  return (
    <div className={styles.reviewsContainer}> {/* Main container styling */}
      {error && <div className={styles.error}>{error}</div>} {/* Error message */}

      {reviews.length > 0 ? (
        <ul className={styles.reviewList}> {/* List styling */}
          {reviews.map((review, index) => (
            <li key={index} className={styles.reviewItem}> {/* Individual review item */}
              <div className={styles.reviewerName}>{review.name}</div> {/* Reviewer name */}
              <div className={styles.reviewText}>{review.review}</div> {/* Review content */}
              <div className={styles.rating}>Rating: {review.rating}/10</div> {/* Rating */}
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
