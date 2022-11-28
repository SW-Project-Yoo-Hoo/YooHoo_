import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { Navigate } from "react-router-dom";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import axios from "axios";

const Login = (props) => {
  /* 페이지 이동 시 스크롤 상단으로 */
  useEffect(() => {
    window.scrollTo(0, 0);
    //잘못된 접근 확인
    const pageHandling = async () => {
      await axios
        .get("/isLogin")
        .then(function (response) {
          //로그인 되어 있음
          if (response.data.data === true) {
            //프로필페이지로 이동
            window.location.href = "/profile";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    pageHandling();
  }, []);

  //회원정보 상태
  const [inputs, setInputs] = useState({
    id: "",
    pw: "",
  });

  const { id, pw } = inputs;

  const changeHandling = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [incorrect, setIncorrect] = useState(false);

  const loginHandling = () => {
    const data = {
      email: id,
      password: pw,
    };

    axios
      .post("/login", data, {
        headers: {
          "Content-Type": "application/json",
          "access-control-allow-origin": "*",
        },
      })
      .then(function (response) {
        if (response.data.code === 200) {
          //로그인 성공
          //로그인 정보가 올바르면 원래 있던 페이지로 돌아가기
          if (window.history.go(-1) == "/signUp") {
            window.history.go(-2);
          } else window.history.back();
        }
        //else {
        //   //내부오류 회원가입 실패
        // }
      })
      .catch(function (error) {
        //로그인 정보가 올바르지 않으면 알림 띄우기
        setIncorrect(true);
      });
  };

  const signUpHandling = () => {
    window.location.href = "/signUp";
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.backGroundIamge} />

      <div className={styles.loginContainer}>
        {/* loginImg */}
        <img
          className={styles.loginImg}
          src={process.env.PUBLIC_URL + "images/login/login.svg"}
          alt="img"
        ></img>

        {/* loginForm */}
        <div className={styles.loginForm}>
          <span className={styles.title}>로그인</span>

          {/* id */}
          <div className={styles.form}>
            <label className={styles.label}>
              아이디
              <input
                type="text"
                name="id"
                onChange={changeHandling}
                value={id}
                placeholder="아이디를 입력해주세요"
                className={styles.input}
              />
            </label>
          </div>

          {/* pw */}
          <div className={styles.form}>
            <label className={styles.label}>
              비밀번호
              <input
                type="password"
                name="pw"
                onChange={changeHandling}
                value={pw}
                placeholder="비밀번호를 입력해주세요"
                className={styles.input}
              />
            </label>
          </div>

          {/* loginAlert */}
          <div className={incorrect ? styles.alertInfo : styles.alertInfoNone}>
            <span className={styles.alertSpan}>
              로그인 정보가 올바르지 않습니다.
            </span>
          </div>

          {/* loginButton */}
          <div
            className={
              incorrect ? styles.loginButton : styles.loginButtonDefault
            }
          >
            <button className={styles.loginButtonStyle} onClick={loginHandling}>
              로그인
            </button>
          </div>

          {/* signUpButton */}
          <div className={styles.signUpButton}>
            <button
              className={styles.signUpButtonStyle}
              onClick={signUpHandling}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const MyPage = (props) => {
  return <Login />;
};

export default MyPage;
