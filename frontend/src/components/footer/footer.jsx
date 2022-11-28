import React from "react";
import styles from "./footer.module.css";
import AboutUs from "./aboutUs/aboutUs";
import Notice from "./notice/notice";

const Footer = (props) => {
  return (
    <div className={styles.container}>
      <footer className={styles.footer}>
        <div className={styles.notice}>
          <span className={styles.noticeTitle}>Notice</span>
          <Notice />
          <p className={styles.logo}>ⓒ Yoohoo</p>
        </div>

        <div className={styles.info}>
          <p className={styles.infoTitle}>DONG-A UNIVERSITY</p>
          <p className={styles.dept}>Department of Computer Engineering</p>
        </div>

        <div className={styles.about}>
          <span className={styles.aboutTitle}>About Us</span>
          <AboutUs />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
