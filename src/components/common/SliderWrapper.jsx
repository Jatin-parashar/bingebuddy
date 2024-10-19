// SliderWrapper.js
import React from "react";
import styles from "./SliderWrapper.module.css";

const SliderWrapper = ({ children ,gap}) => {
  return (
    <div className={styles.sliderWrapper} style={{gap:gap}}>
      {children}
    </div>
  );
};

export default SliderWrapper;
