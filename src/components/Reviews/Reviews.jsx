import React, { useState } from "react";
import AddReview from "./AddReview";
import DisplayReviews from "./DisplayReviews";

const Reviews = () => {
  const [RefreshDisplay, setRefreshDisplay] = useState(false);

  const triggerRerender = () => {
    setRefreshDisplay((prev) => !prev);
  };

  return (
    <>
      <AddReview triggerRerender={triggerRerender} />
      <DisplayReviews RefreshDisplay={RefreshDisplay} />
    </>
  );
};

export default Reviews;
