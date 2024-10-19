import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import { getSearchedContent } from "../services/apiService";
import Modal from "./Modal";

const contentTypeOptions = {
  movie: [
    { label: "Now Playing", path: "/movie/now_playing" },
    { label: "Popular", path: "/movie/popular" },
    { label: "Top Rated", path: "/movie/top_rated" },
    { label: "Upcoming", path: "/movie/upcoming" },
  ],
  tv: [
    { label: "Airing Today", path: "/tv/airing_today" },
    { label: "On The Air", path: "/tv/on_the_air" },
    { label: "Popular", path: "/tv/popular" },
    { label: "Top Rated", path: "/tv/top_rated" },
  ],
};

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const movieDropdownRef = useRef(null);
  const tvDropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook for navigation

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleDropdownToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleClickOutside = (event) => {
    if (
      movieDropdownRef.current &&
      !movieDropdownRef.current.contains(event.target) &&
      tvDropdownRef.current &&
      !tvDropdownRef.current.contains(event.target)
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigation when clicking on dropdown items
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the desired path
    setOpenDropdown(null); // Close the dropdown after navigation
  };

  const renderDropdownOptions = (contentType) => {
    const optionsList =
      contentType === "Movies"
        ? contentTypeOptions.movie
        : contentTypeOptions.tv;
    return (
      <ul className={styles.dropdown}>
        {optionsList.map((item, index) => (
          <li key={index} onClick={() => handleNavigation(item.path)}>
            {item.label}
          </li>
        ))}
      </ul>
    );
  };

  const handleSearch = async () => {
    handleOpen();
  };
  return (
    <header className={styles.header}>
      <Modal isOpen={isOpen} onClose={handleClose} />
      <nav className={styles.nav}>
        <div
          className={styles.logo}
          onClick={() => {
            navigate("/");
          }}
        >
          <h1>BingeBuddy</h1>
        </div>
        <div
          className={styles.navItem}
          onClick={() => handleDropdownToggle("Movies")}
          ref={movieDropdownRef}
        >
          <span>Movies</span>
          {openDropdown === "Movies" && renderDropdownOptions("Movies")}
        </div>

        <div
          className={styles.navItem}
          onClick={() => handleDropdownToggle("TV Shows")}
          ref={tvDropdownRef}
        >
          <span>TV Shows</span>
          {openDropdown === "TV Shows" && renderDropdownOptions("TV Shows")}
        </div>
      </nav>

      <div className={styles.end}>
        <div style={{fontSize:"18px",cursor:"pointer"}} onClick={()=>{navigate("/wishlist")}}>Wishlist</div>
        <div className={styles.search}>
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => {
              handleSearch();
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
