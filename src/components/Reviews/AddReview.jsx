import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./AddReview.module.css";
import { appendToList } from "../../db/firebasedb";

const AddReview = ({ handleClose,user }) => {
  const params = useParams();
  const [error, setError] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.target);

    const reviewData = {
      contentType: params.contentType,
      name:user.displayName,
      email:user.email,
      review: formData.get("review"),
      rating: formData.get("rating"),
      createdAt: new Date().toLocaleString(),
      
    };

    event.target.reset();
    handleClose();
    
    try{
      const key = await appendToList(params.contentType+"reviews/"+params.contentId,reviewData);
    }
    catch(err){
      // console.error("Error submitting the review:", err);
      setError("Failed to submit your review. Please try again.");
    }

  };

  return (
    <div className={styles.card}>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleFormSubmit}>

        <textarea
          name="review"
          placeholder="Write your review here..."
          required
          maxLength={200}
          minLength={10}
          className={styles.textArea}
          autoComplete="off"
        />
        <input
          type="number"
          name="rating"
          max={10}
          min={1}
          defaultValue={1}
          required
          className={styles.inputField}
          autoComplete="off"
        />
        <div>
          <button type="submit" className={styles.button}>
            Submit your Review
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={() => {
              setError(null);
              handleClose();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
