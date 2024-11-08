import React, { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import banner from "../assets/banner.jpg";
import { useUserAuth } from "../store/UserAuthContextProvider";
import { fetchData } from "../db/firebasedb";

const ProfilePage = () => {
  const { user } = useUserAuth();
  const userId = user.uid;
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await fetchData(`users/${userId}`);
      if (data) {
        setUserInfo(data);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <main>
      <section className={styles.headerIntro}>
        <div
          className={styles.profilePoster}
          style={{ backgroundImage: `url(${banner})` }}
        />
        <div className={styles.introductoryContent}>
          <div className={styles.profileIMG} alt="User">
            {user.displayName.charAt(0).toUpperCase()}
          </div>

          <div className={styles.introductoryInfo}>
            <div>{userInfo.name || "N/A"}</div>
            <div>Joined: {userInfo.createdAt || "N/A"}</div>
          </div>
        </div>
      </section>

      <section className={styles.userInfoSection}>
        <h2>User Information</h2>
        <div className={styles.userInfoFields}>

          <div className={styles.userInfoItem}>
            <label>Name:</label>
            <span className={styles.userText}>{userInfo.name || "N/A"}</span>
          </div>

          <div className={styles.userInfoItem}>
            <label>Email:</label>
            <span className={styles.userText}>{userInfo.email || "N/A"}</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
