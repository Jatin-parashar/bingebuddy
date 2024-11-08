import React from "react";
import styles from "./AuthenticationPage.module.css";
import Auth from "../components/Auth/Auth";
import usr from "../assets/usr.png";
const AuthenticationPage = ({ type }) => {
  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div className={styles.authContainer}>
          <Auth type={type} />
        </div>
      </div>
      <img
        className={styles.bottomImage}
        src={usr}
        alt="User enjoying BingeBuddy"
      />
    </div>
  );
};

export default AuthenticationPage;
