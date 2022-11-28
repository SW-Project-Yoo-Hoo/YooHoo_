import React from "react";
import styles from "./aboutUs.module.css";

const AboutUs = (props) => (
  <div className={styles.menu}>
    <ul className={styles.list}>
      <li className={styles.item}>
        <a href="https://github.com/OhHyeonJu0415" target="_blank">
          Oh Hyeon-ju
        </a>
      </li>
      <li className={styles.item}>
        <a href="https://github.com/hanb613" target="_blank">
          Yoo Yeong-seo
        </a>
      </li>
      <li className={styles.item}>
        <a href="https://github.com/object1997428" target="_blank">
          Ju Hyer-yeon
        </a>
      </li>
    </ul>
  </div>
);

export default AboutUs;
