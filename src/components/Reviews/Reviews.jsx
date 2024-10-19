import React, { useState } from "react";
import AddReview from "./AddReview";
import DisplayReviews from "./DisplayReviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Reviews.module.css";

const Reviews = () => {
  const [RefreshDisplay, setRefreshDisplay] = useState(false);

  const triggerRerender = () => {
    setRefreshDisplay((prev) => !prev);
  };

  return (
    <>
      <h3>
        <span>Reviews</span>
          <FontAwesomeIcon icon={faPlus} className={styles['icon-button']} />
      </h3>
      <AddReview triggerRerender={triggerRerender} />
      <DisplayReviews RefreshDisplay={RefreshDisplay} />
    </>
  );
};

export default Reviews;
