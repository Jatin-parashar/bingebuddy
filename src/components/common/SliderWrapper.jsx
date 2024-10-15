// SliderWrapper.js
import React from "react";
import styles from "./SliderWrapper.module.css";

const SliderWrapper = ({ children }) => {
  return (
    <div className={styles.sliderWrapper}>
      {children}
    </div>
  );
};

export default SliderWrapper;
