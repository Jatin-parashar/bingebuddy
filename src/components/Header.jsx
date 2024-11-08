import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import SearchContent from "./SearchContent";
import Modal from "./common/Modal";
import userImg from "../assets/user-image.png";
import { useUserAuth } from "../store/UserAuthContextProvider";

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
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useUserAuth();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleDropdownToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleLogin = () => {
    handleNavigation("/login");
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (
      movieDropdownRef.current &&
      !movieDropdownRef.current.contains(event.target) &&
      tvDropdownRef.current &&
      !tvDropdownRef.current.contains(event.target) &&
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
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

  const handleNavigation = (path) => {
    navigate(path);
    setOpenDropdown(null);
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
      <Modal isOpen={isOpen} onClose={handleClose}>
        <SearchContent onClose={handleClose} />
      </Modal>
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
        <div className={styles.search}>
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => {
              handleSearch();
            }}
          />
        </div>

        <div
          ref={profileDropdownRef}
          style={{ width: "28px", height: "28px", position: "relative" }}
          onClick={() => handleDropdownToggle("Profile")}
        >
          {user ? (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#aaa", 
                color: "#fff", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={userImg}
              alt="User"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
              }}
            />
          )}

          {openDropdown === "Profile" && (
            <ul className={styles.profileDropdown}>
              {user ? (
                <>
                  <div>{user.displayName}</div>
                  <li onClick={() => handleNavigation("/profile")}>Profile</li>
                  <li onClick={handleLogout}>Logout</li>
                </>
              ) : (
                <li onClick={handleLogin}>Login</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
