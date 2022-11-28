import React, { useState, useEffect } from "react";
import styles from "./home.module.css";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Link } from "react-router-dom";
import { MdOutlineTrendingFlat } from "react-icons/md";
import axios from "axios";

const Home = (props) => {
  const [page, setPage] = useState("/login");
  const [pagePost, setPagePost] = useState("/login");

  // 페이지 설정
  useEffect(() => {
    const pageHandling = async () => {
      await axios
        .get("/isLogin")
        .then(function (response) {
          //로그인 되어 있음
          if (response.data.data === true) {
            //프로필로 이동
            setPage("/profile");
            setPagePost("/post");
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
    <div className={styles.home}>
      <Header />
      <div className={styles.backGroundImage}>
        <div className={styles.container}>
          {/* part.1 */}
          <div className={styles.partOne}>
            {/* text,button */}
            <div className={styles.partOneTextButton}>
              {/* text */}
              <div>
                {/* mainTitle */}
                <div>
                  <span className={styles.partOneMainBigText}>Resource</span>
                  <span className={styles.partOneMainSmallText}>Exchange</span>

                  <div className={styles.partOneText}>
                    <span className={styles.partOneMainSmallTextBottom}>
                      For The
                    </span>
                    <span className={styles.partOneMainBigText}>
                      Resourceful
                    </span>
                  </div>
                </div>
                {/* subTitle */}
                <div>
                  <span className={styles.partOneSubText}>
                    Transform how you source, procure, and
                  </span>
                  <span className={styles.partOneSubText}>
                    use resources with YooHoo.
                  </span>
                </div>
              </div>

              {/* button */}
              <div>
                <Link to="/about">
                  <div className={styles.buttonStyle}>Read More</div>
                </Link>
              </div>
            </div>

            {/* img */}
            <img
              className={styles.partOneImage}
              src={process.env.PUBLIC_URL + "images/home/computerWoman.svg"}
              alt="illu"
            />
          </div>

          {/* part.2 */}
          <div className={styles.partTwo}>
            {/* shopNow */}
            <div className={styles.shopNow}>
              {/* Img */}
              <img
                className={styles.shopNowImg}
                src={
                  process.env.PUBLIC_URL + "images/home/resourceVisibility.svg"
                }
                alt="illu"
              ></img>

              {/* Text */}
              <div className={styles.shopNowText}>
                <span className={styles.partTwoMainText}>물품 가시성 확보</span>
                <span className={styles.partTwoSubText}>
                  유후를 이용해 하나의 플랫폼에서 빠르고 효율적으로
                </span>
                <span className={styles.partTwoSubText}>
                  게시물 업로드, 물품 확인 및 거래를 할 수 있습니다.
                </span>
                <Link to="/shop" className={styles.link}>
                  <div className={styles.linkGo}>
                    <span className={styles.partTwoButton}>Shop Now</span>
                    <MdOutlineTrendingFlat className={styles.arrowIcon} />
                  </div>
                </Link>
              </div>
            </div>

            {/* postNow */}
            <div className={styles.postNow}>
              {/* Text */}
              <div className={styles.postNowText}>
                <span className={styles.partTwoMainText}>자원 공유</span>
                <span className={styles.partTwoSubText}>
                  기업 내 유휴자원을 공유하고
                </span>
                <span className={styles.partTwoSubText}>
                  연결된 기업들을 통해 재고 가치를 극대화하세요.
                </span>
                <Link to={pagePost} className={styles.link}>
                  <div className={styles.linkGo}>
                    <span className={styles.partTwoButton}>Post Now</span>
                    <MdOutlineTrendingFlat className={styles.arrowIcon} />
                  </div>
                </Link>
              </div>
              {/* Img */}

              <img
                className={styles.postNowImg}
                src={process.env.PUBLIC_URL + "images/home/resourceShare.svg"}
                alt="illu"
              ></img>
            </div>

            {/* profiletNow */}
            <div className={styles.profileNow}>
              {/* img */}
              <img
                className={styles.profileNowImg}
                src={process.env.PUBLIC_URL + "images/home/profile.svg"}
                alt="illu"
              ></img>

              {/* Text */}
              <div className={styles.profileNowText}>
                <span className={styles.partTwoMainText}>마이 유후</span>
                <span className={styles.partTwoSubText}>
                  공유 현황 및 물품 정보, 대여 기간 등
                </span>
                <span className={styles.partTwoSubText}>
                  모든 정보를 확인하세요.
                </span>
                <Link to={page} className={styles.link}>
                  <div className={styles.linkGo}>
                    <span className={styles.partTwoButton}>Profile Now</span>
                    <MdOutlineTrendingFlat className={styles.arrowIcon} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* part.3 */}
          <div className={styles.partThree}>
            {/* Text */}
            <div className={styles.partThreeText}>
              <div className={styles.partThreeMainTitle}>
                <span>Connect to a larger world of resources</span>
              </div>

              <div className={styles.partThreeSubTitleWrap}>
                <div>
                  <span className={styles.partThreeSubTitle}>
                    재사용 및 유휴 자원 공유를 통해
                  </span>
                  <span>자원의 지속적인 순환을 촉진합니다.</span>
                </div>
                <div>
                  <span className={styles.partThreeSubTitle}>
                    방치 혹은 폐기되는 유휴 자원이 없는
                  </span>
                  <span>미래를 만들어갑니다.</span>
                </div>
              </div>
            </div>

            {/* Img */}
            <div className={styles.partThreeImgWrap}>
              <img
                className={styles.partThreeImg}
                src={process.env.PUBLIC_URL + "images/home/earth.svg"}
                alt="illu"
              ></img>
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
