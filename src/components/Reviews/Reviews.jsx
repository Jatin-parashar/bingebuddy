import React, { useState } from "react";
import AddReview from "./AddReview";
import DisplayReviews from "./DisplayReviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Reviews.module.css";
import Modal from "../common/Modal";

const Reviews = () => {
  const [RefreshDisplay, setRefreshDisplay] = useState(false);

  const triggerRerender = () => {
    setRefreshDisplay((prev) => !prev);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <h3>
        <span>Reviews</span>
        <FontAwesomeIcon icon={faPlus} className={styles["icon-button"]} onClick={handleOpen}/>
      </h3>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <AddReview handleClose={handleClose} triggerRerender={triggerRerender} />
      </Modal>
      <DisplayReviews RefreshDisplay={RefreshDisplay} />
    </>
  );
};

export default Reviews;
