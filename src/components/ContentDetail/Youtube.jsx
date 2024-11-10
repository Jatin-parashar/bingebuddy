import React from "react";
import styles from "./YouTube.module.css";

const Youtube = ({ videoData }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoData.key}`;

  return (
    <div className={styles.trailerWrapper}>
      <iframe
        className={styles.iframe}
        src={videoUrl}
        title={videoData.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Youtube;
