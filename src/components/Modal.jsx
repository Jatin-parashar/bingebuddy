import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import "./Modal.css";
import { getSearchedContent } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../assets/no-image.jpg";

function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < limit) return;
    lastCall = now;
    return fn(...args);
  };
}

const Modal = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const navigate = useNavigate();

  const modalRef = useRef(null); // Ref for modal content

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      throttledFetch.current(keyword); // Call the throttled fetch after debounce
    }, 500); // Debounce for 500ms

    // Cleanup function for debounce
    return () => clearTimeout(debounceFetch);
  }, [keyword]);

  const throttledFetch = useRef(
    throttle(async (keyword) => {
      if (keyword) {
        console.log("Fetching data for keyword:", keyword);
        const response = await getSearchedContent(keyword);
        const data = response.data;
        setSearchedData(data);
        console.log(data);
      }
    }, 1000)
  ); // Throttle API call to 1 second

  // Close modal when clicking outside the modal content
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // Close the modal
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleOutsideClick); // Add event listener for outside click
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("mousedown", handleOutsideClick); // Clean up event listener
      setKeyword("");
      setSearchedData(null);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="content">
          <FontAwesomeIcon icon={faSearch} className="icon" />
          <input
            type="text"
            value={keyword}
            placeholder="Search here..."
            className="modal-input"
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
            <div className="searchedData">
              {searchedData.results.map((content) => (
                <div
                  key={content.id}
                  className="searchedDataContent"
                  onClick={() => {
                    navigate(`/${content.media_type}/detail/${content.id}`);
                    onClose();
                  }}
                >
                  <img
                  style={{width:"50px",height:"70px"}}
                    src={
                      content.poster_path
                        ? `https://image.tmdb.org/t/p/original/${content.poster_path}`
                        : fallbackImage 
                    }
                    alt={content.name}
                  />
                  <div className="content-info">
                    {content.name || content.title}
                  </div>
                  <div className="content-media-type">{content.media_type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel">
            Cancel
          </button>
        </div> */}
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
