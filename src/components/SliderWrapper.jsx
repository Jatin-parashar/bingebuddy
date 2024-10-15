import React from "react";
import styles from "./SliderWrapper.module.css";

const SliderWrapper = ({ children }) => {
  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default SliderWrapper;
