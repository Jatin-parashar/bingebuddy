import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./AddReview.module.css"; 
import axios from "axios";

const AddReview = ({ triggerRerender }) => {
  const params = useParams();
  const [showAddReview, setShowAddReview] = useState(false);
  const [error, setError] = useState(null);

  const handleAddReview = () => {
    setShowAddReview(true);
    setError(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowAddReview(false);
    setError(null); // Clear previous errors on form submission

    const formData = new FormData(event.target);

    const reviewData = {
      contentType: params.contentType,
      name: formData.get("name"),
      review: formData.get("review"),
      rating: formData.get("rating"),
    };

    event.target.reset();

    try {
      await axios.post(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/reviews/${
          params.contentId
        }.json`,
        reviewData
      );

      console.log("Review submitted successfully!");

      triggerRerender();
    } catch (err) {
      console.error("Error submitting the review:", err);
      setError("Failed to submit your review. Please try again.");
    }
  };

  return (
    <div className={styles.card}> {/* Apply the card styling */}
      {error && <div className={styles.error}>{error}</div>} {/* Error message */}
      
      {!showAddReview && (
        <button className={styles.button} onClick={handleAddReview}>
          Click here to drop your Review
        </button>
      )}
      {showAddReview && (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
            className={styles.inputField}  // Apply input styling
          />
          <textarea
            name="review"
            placeholder="Write your review here..."
            required
            maxLength={200}
            minLength={30}
            className={styles.textArea}  // Apply textarea styling
          />
          <input
            type="number"
            name="rating"
            max={10}
            min={1}
            defaultValue={1}
            required
            className={styles.inputField} // Apply input styling
          />
          <div>
            <button type="submit" className={styles.button}>
              Submit your Review
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`} // Apply cancel button styling
              onClick={() => {
                setShowAddReview(false);
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddReview;
