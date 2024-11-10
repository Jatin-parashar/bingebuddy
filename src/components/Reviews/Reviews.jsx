import React, { useState } from "react";
import AddReview from "./AddReview";
import DisplayReviews from "./DisplayReviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Reviews.module.css";
import Modal from "../common/Modal";
import { useUserAuth } from "../../store/UserAuthContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { getItemByField } from "../../firebase/firebaseDB";

const Reviews = () => {
  const { contentType, contentId } = useParams();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  async function reviewExistsByEmail(path, targetEmail) {
    const review = await getItemByField(path, "email", targetEmail);
    return !!review;
  }

  const handleOpen = async () => {
    if (user) {
      const reviewExists = await reviewExistsByEmail(
        `reviews/${contentType}/${contentId}`,
        user.email
      );
      if (reviewExists) {
        setHasReviewed(true);
        return;
      }
      setHasReviewed(false);
      setIsOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <h3>
        <span>Reviews</span>
        <div className={styles.tooltip}>
          <FontAwesomeIcon
            icon={faPlus}
            className={styles["icon-button"]}
            onClick={handleOpen}
          />
          <span className={styles.tooltiptext}>
            {hasReviewed ? "You have reviewed" : "Add your review"}
          </span>
        </div>
      </h3>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <AddReview user={user} handleClose={handleClose} />
      </Modal>
      <DisplayReviews />
    </>
  );
};

export default Reviews;
