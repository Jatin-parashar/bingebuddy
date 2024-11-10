import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getSearchedContent } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../../assets/no-image.jpg";
import styles from "./SearchContent.module.css";

function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < limit) return;
    lastCall = now;
    return fn(...args);
  };
}

const SearchContent = ({ onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      throttledFetch.current(keyword);
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [keyword]);

  const throttledFetch = useRef(
    throttle(async (keyword) => {
      if (keyword) {
        const response = await getSearchedContent(keyword);
        const data = response.data;
        setSearchedData(data);
      }
    }, 1000)
  );

  return (
    <>
      <div className={styles.content}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input
          type="text"
          value={keyword}
          placeholder="Search here..."
          className={styles["modal-input"]}
          onChange={(event) => {
            setKeyword(event.target.value);
          }}
        />
      </div>

      <div style={{ margin: "20px 0", color: "white" }}>
        {!keyword && <div> No searched Content </div>}
        {keyword && searchedData && searchedData.results.length === 0 && (
          <div>No results found!</div>
        )}
        {keyword && searchedData && searchedData.results.length !== 0 && (
          <div className={styles.searchedData}>
            {searchedData.results.map((content) => (
              <div
                key={content.id}
                className={styles.searchedDataContent}
                onClick={() => {
                  navigate(`/${content.media_type}/detail/${content.id}`);
                  onClose();
                }}
              >
                <img
                  style={{ width: "50px", height: "70px" }}
                  src={
                    content.poster_path
                      ? `https://image.tmdb.org/t/p/original/${content.poster_path}`
                      : fallbackImage
                  }
                  alt={content.name}
                />
                <div className={styles["content-info"]}>
                  {content.name || content.title}
                </div>
                <div className={styles["content-media-type"]}>
                  {content.media_type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchContent;
