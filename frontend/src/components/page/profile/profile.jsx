import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import EditProfile from "./editProfile/editProfile";
import MyPost from "./myPost/mypost";
import useLocalStorage from "./useLocalStorage";
import BookMark from "./myPost/bookMarkPost";
import WaitStatus from "./tansStatus/waitStatus";
import ProgressStatus from "./tansStatus/progressStatus";
import CompletStatus from "./tansStatus/completStatus";
import SentStatus from "./requestStatus/sentStatus";
import ReceivedStatus from "./requestStatus/receivedStatus";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Profile = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [editInfoCheck, setEditInfoCheck] = useState(true);

  //웹 스토리지 저장 커스텀 훅 호출
  const [call, setCall] = useLocalStorage("call", "MyPost");

  // 알람 페이지에서 넘어온 경우
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);

    //잘못된 접근 확인
    const pageHandling = async () => {
      await axios
        .get("/isLogin")
        .then(function (response) {
          //로그인 되어 있음
          if (response.data.data === false) {
            //로그인페이지로 이동
            window.location.href = "/login";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    //회원정보 불러오기
    const getUser = async () => {
      let userAdd = { ...userInfo };
      await axios
        .get("/my")
        .then(function (response) {
          let responseData = response.data.data;

          for (const [key, value] of Object.entries(responseData)) {
            if (value) {
              userAdd[key] = value;
            } else {
              userAdd[key] =
                process.env.PUBLIC_URL + "images/userProfileBasic.svg";
            }
          }

          setUserInfo(userAdd);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    pageHandling();
    getUser();

    if (location.state !== null) {
      setCall(location.state.call);
    }
  }, [location]);

  //컴포넌트 호출
  const callComponent = (props) => {
    switch (props) {
      // 게시물 보기-> 내 게시물
      case "MyPost":
        return <MyPost />;

      //게시물 보기 -> 찜한 게시물
      case "BookMark":
        return <BookMark />;

      //거래현황 -> 거래 대기 중
      case "WaitStatus":
        return <WaitStatus />;

      //거래현황 -> 거래 진행 중
      case "ProgressStatus":
        return <ProgressStatus />;

      //거래현황 -> 거래 완료
      case "CompletStatus":
        return <CompletStatus />;

      //요청현황 -> 대기 요청
      case "SentStatus":
        return <SentStatus />;

      //요청현황 -> 받은 요청
      case "ReceivedStatus":
        return <ReceivedStatus />;

      //프로필 수정
      case "EditProfile":
        return <EditProfile changeInfo={changeInfo} />;

      default:
        return <MyPost />;
    }
  };

  /** ================================= */
  /** 프로필 수정 */

  useEffect(() => {
    setEditInfoCheck(true); // 알림 지우기
  }, [call]);

  /** editProfile에서 바뀐 정보 */
  const changeInfo = (value) => {
    setUserInfo(value);
  };

  /** editProfile -> 바뀐 정보 check */
  function editCheck() {
    if (
      "companyName" in userInfo &&
      "adress" in userInfo &&
      "phone" in userInfo &&
      "photo" in userInfo
    ) {
      if (userInfo.phone.match(/^\d{2,3}-\d{3,4}-\d{4}$/) === null) {
        return false;
      } else return true;
    } else if (
      userInfo.companyName === "" ||
      userInfo.adress === "" ||
      userInfo.phone === ""
    ) {
      return false;
    }
    return false;
  }

  /** editProfile에서 완료 버튼 클릭 시 */
  /** 백엔드로 회원 정보 전송하기 */
  const editProfileHandling = () => {
    if (editCheck() !== false) {
      const formData = new FormData();
      formData.append("company", userInfo.companyName);
      formData.append("address", userInfo.adress);
      formData.append("contact", userInfo.phone);
      formData.append("photo", userInfo.photo[0]);

      axios
        .put("/members", formData, {
          headers: {
            "Contest-Type": "multipart/form-data",
          },
        })
        .then((res) => setUserInfo(res.data.data))
        .catch((error) => console.log(error));

      setEditInfoCheck(true); // 알림 지우기
      setCall("MyPost"); //내 게시물 보기로 이동하기
    } else {
      setEditInfoCheck(false); // 알림 띄우기
    }
  };
  /** ================================= */

  //로그아웃 버튼 클릭시
  const logoutHandling = () => {
    //백엔드에 로그아웃 요청
    axios
      .post("/logout")
      .then(function (response) {
        // response
        if (response.data.code === 200) {
          //로그아웃 성공
          //메인홈으로 이동

          window.location.href = "/home";
          setCall("MyPost");
        }
        // console.log(response);
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      {/* header */}
      <Header />
      <div className={styles.backGroundIamgeHeader} />

      {/* contents */}
      <div className={styles.displayFlex}>
        {/* 회원정보 + 메뉴 */}
        <div className={styles.userKategorie}>
          {/* 회원정보 */}
          <div className={styles.userInfo}>
            {/* 사진,이름 */}
            <div className={styles.userInfoTop}>
              {userInfo.photo_dir === "" ||
              userInfo.photo_dir === "images/userProfileBasic.svg" ? (
                <img
                  className={styles.userPhoto}
                  src={process.env.PUBLIC_URL + "images/userProfileBasic.svg"}
                  alt="회원 프로필 사진"
                />
              ) : userInfo.photo_dir === undefined ? (
                <div className={styles.userPhoto}></div>
              ) : (
                <img
                  className={styles.userPhoto}
                  src={
                    process.env.PUBLIC_URL + "productList/" + userInfo.photo_dir
                  }
                  alt="회원 프로필 사진"
                />
              )}
              <span className={styles.userName}>{userInfo.company}</span>
            </div>

            {/* 주소, 전화번호 */}

            <div
              className={[
                styles.userInfoBottom,
                styles.userInfoBottomMargin,
              ].join(" ")}
            >
              <MdLocationOn className={styles.userInfoIcon} />
              <span className={styles.userInfoText}>{userInfo.address}</span>
            </div>
            <div className={styles.userInfoBottom}>
              <MdPhone className={styles.userInfoIcon} />
              <span className={styles.userInfoText}>{userInfo.contact}</span>
            </div>
          </div>

          {/* 선 */}
          <div className={styles.kategorieLine} />

          {/* 카테고리 */}
          <div className={styles.kategorie}>
            {/* 메뉴 */}
            <div>
              {/* 게시물 보기 */}
              <div className={styles.menuTitleMargin}>
                {/* 메인제목 */}
                <span
                  className={
                    call === "MyPost" || call === "BookMark"
                      ? styles.menuTitle
                      : styles.menuTitleDefault
                  }
                  onClick={() => setCall("MyPost")}
                >
                  게시물 보기
                </span>

                {/* 서브제목 */}
                <div
                  className={
                    call === "MyPost" || call === "BookMark"
                      ? styles.menuSub
                      : styles.displayNone
                  }
                >
                  <div
                    className={[
                      styles.menuSubMargin,
                      styles.cursorPointer,
                    ].join(" ")}
                    onClick={() => setCall("MyPost")}
                  >
                    내 게시물
                  </div>
                  <div
                    className={styles.cursorPointer}
                    onClick={() => setCall("BookMark")}
                  >
                    찜한 게시물
                  </div>
                </div>
              </div>

              {/* 거래현황 */}
              <div className={styles.menuTitleMargin}>
                {/* 메인제목 */}
                <span
                  className={
                    call === "WaitStatus" ||
                    call === "ProgressStatus" ||
                    call === "CompletStatus"
                      ? styles.menuTitle
                      : styles.menuTitleDefault
                  }
                  onClick={() => setCall("WaitStatus")}
                >
                  거래현황
                </span>

                {/* 서브제목 */}
                <div
                  className={
                    call === "WaitStatus" ||
                    call === "ProgressStatus" ||
                    call === "CompletStatus"
                      ? styles.menuSub
                      : styles.displayNone
                  }
                >
                  <div
                    className={[
                      styles.menuSubMargin,
                      styles.cursorPointer,
                    ].join(" ")}
                    onClick={() => setCall("WaitStatus")}
                  >
                    거래 대기
                  </div>
                  <div
                    className={[
                      styles.menuSubMargin,
                      styles.cursorPointer,
                    ].join(" ")}
                    onClick={() => setCall("ProgressStatus")}
                  >
                    거래 중
                  </div>
                  <div
                    className={styles.cursorPointer}
                    onClick={() => setCall("CompletStatus")}
                  >
                    거래 완료
                  </div>
                </div>
              </div>

              {/* 요청현황 */}
              <div className={styles.menuTitleMargin}>
                {/* 메인제목 */}
                <span
                  className={
                    call === "SentStatus" || call === "ReceivedStatus"
                      ? styles.menuTitle
                      : styles.menuTitleDefault
                  }
                  onClick={() => setCall("SentStatus")}
                >
                  요청현황
                </span>

                {/* 서브제목 */}
                <div
                  className={
                    call === "SentStatus" || call === "ReceivedStatus"
                      ? styles.menuSub
                      : styles.displayNone
                  }
                >
                  <div
                    className={[
                      styles.menuSubMargin,
                      styles.cursorPointer,
                    ].join(" ")}
                    onClick={() => setCall("SentStatus")}
                  >
                    대기요청
                  </div>
                  <div
                    className={styles.cursorPointer}
                    onClick={() => setCall("ReceivedStatus")}
                  >
                    받은요청
                  </div>
                </div>
              </div>
            </div>

            {/* 정보 수정 및 로그아웃 */}
            <div className={styles.etc}>
              <div
                className={styles.cursorPointer}
                onClick={() => setCall("EditProfile")}
              >
                프로필 수정
              </div>
              <div
                className={styles.cursorPointer}
                onClick={() => logoutHandling()}
              >
                로그아웃
              </div>
            </div>
          </div>
        </div>
        {/* 게시물 보드 */}
        <div className={styles.posts}>
          {/* 페이지 제목 */}
          <div className={styles.postsTitle}>
            {/* 내 게시물 */}
            <div
              className={
                call === "MyPost" || call === "BookMark"
                  ? ""
                  : styles.displayNone
              }
            >
              <span
                className={call === "MyPost" ? styles.titleOn : styles.titleOff}
                onClick={() => setCall("MyPost")}
              >
                내 게시물
              </span>
              <span
                className={
                  call === "BookMark" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("BookMark")}
              >
                찜한 게시물
              </span>
            </div>

            {/* 거래현황 */}
            <div
              className={
                call === "WaitStatus" ||
                call === "ProgressStatus" ||
                call === "CompletStatus"
                  ? ""
                  : styles.displayNone
              }
            >
              <span
                className={
                  call === "WaitStatus" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("WaitStatus")}
              >
                거래 대기
              </span>
              <span
                className={
                  call === "ProgressStatus" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("ProgressStatus")}
              >
                거래 중
              </span>
              <span
                className={
                  call === "CompletStatus" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("CompletStatus")}
              >
                거래 완료
              </span>
            </div>

            {/* 요청현황 */}
            <div
              className={
                call === "SentStatus" || call === "ReceivedStatus"
                  ? ""
                  : styles.displayNone
              }
            >
              <span
                className={
                  call === "SentStatus" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("SentStatus")}
              >
                대기 요청
              </span>
              <span
                className={
                  call === "ReceivedStatus" ? styles.titleOn : styles.titleOff
                }
                onClick={() => setCall("ReceivedStatus")}
              >
                받은 요청
              </span>
            </div>

            {/* 프로필 수정 */}
            <div
              className={
                call === "EditProfile"
                  ? styles.editProfileTitle
                  : styles.displayNone
              }
            >
              <span className={styles.titleEdit}>프로필 수정</span>
              <span
                className={styles.titleEditDone}
                onClick={editProfileHandling}
              >
                완료
              </span>
            </div>
          </div>

          <div className={styles.postsTitleLine}></div>

          <div
            className={call === "EditProfile" ? styles.postsContentsEdit : ""}
          >
            {callComponent(call)}
            <div
              className={
                call === "EditProfile" && editInfoCheck === false
                  ? styles.editProfileAlert
                  : styles.displayNone
              }
            >
              모든 정보가 올바르게 입력되지 않았습니다.
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className={styles.bottomContainer}>
        <div className={styles.backGroundIamgeFoot} />
        <div className={styles.responsive}>
          <img
            className={styles.footImg}
            src={process.env.PUBLIC_URL + "images/myPage/woman.svg"}
            alt="illu"
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
