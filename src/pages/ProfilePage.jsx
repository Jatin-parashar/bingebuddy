import React from "react";
import styles from "./ProfilePage.module.css";
import user from "../assets/user-image.jpg";

const ProfilePage = () => {
  return (
    <main>
      <section className={styles.headerIntro}>
        <div className={styles.profilePoster} />
        <div className={styles.introductoryContent}>
          <img src={user} alt="User" />
          <div>
            <div>Name</div>
            <div>Joined on</div>
          </div>
        </div>
      </section>
      <section>
        

      </section>
    </main>
  );
};

export default ProfilePage;
