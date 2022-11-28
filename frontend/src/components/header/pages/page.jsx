import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Page = () => {
  const [page, setPage] = useState("/login");

  // 페이지 설정
  useEffect(() => {
    const pageHandling = async () => {
      await axios
        .get("/isLogin")
        .then(function (response) {
          //로그인 되어 있음
          if (response.data.data === true) {
            //프로필로 이동
            setPage("/post");
          } else {
            //로그인 페이지 이동
            setPage("/login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    pageHandling();
  }, []);

  return (
    <ul className={styles.container}>
      <li className={styles.pageStyle}>
        <Link to="/home" className={styles.active}>
          HOME
        </Link>
      </li>
      <li className={styles.pageStyle}>
        <Link to="/shop" className={styles.active}>
          SHOP
        </Link>
      </li>
      <li className={styles.pageStyle}>
        <Link to={page} className={styles.active}>
          POST
        </Link>
      </li>
      <li className={styles.pageStyle}>
        <Link to="/about" className={styles.active}>
          ABOUT
        </Link>
      </li>
    </ul>
  );
};

export default Page;
