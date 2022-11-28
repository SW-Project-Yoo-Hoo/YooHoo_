import React from "react";
import styles from "./header.module.css";
import Page from "./pages/page";
import UserInfo from "./userInfo/userInfo";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <header className={styles.wrapHeader}>
      {/* left component : logo */}
      <div className={styles.header}>
        <Link to="/">
          <img
            className={styles.logoStyle}
            src={process.env.PUBLIC_URL + "images/header/logo.png"}
            alt="logo"
          ></img>
        </Link>

        {/* rigth component : pages, search, alram, profile */}
        <div className={styles.headerComponent}>
          <Page />
          <UserInfo />
        </div>
      </div>
    </header>
  );
};

export default Header;
