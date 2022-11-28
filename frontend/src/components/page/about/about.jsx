import React from "react";
import Footer from "../../footer/footer";
import styles from "./about.module.css";
import { VscGithub } from "react-icons/vsc";
import { FaInstagram } from "react-icons/fa";
import Header from "../../header/header";
import { useRef } from "react";

const About = (props) => {
  const moveArea = useRef();

  const onClick = () => {
    moveArea.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <Header />
      <div className={styles.background}>
        {/* Title */}
        <div className={styles.title}>
          <span className={styles.content}>LET'S TALK ABOUT US</span>
        </div>

        <div className={styles.continer}>
          {/* Topic1 */}
          <div className={styles.topic1}>
            <div className={styles.topic1_span}>
              <span className={styles.topic1_Title}>Digital Commerce</span>
              <p className={styles.topic1_Content}>
                Put your resources to reuse !
              </p>
              <p className={styles.topic1_Content2}>
                Transform how you source, procure, and use resources with
                Yoohoo.
              </p>
              <button className={styles.topic1_Btn} onClick={onClick}>
                Read More
              </button>
            </div>

            <img
              className={styles.shoppingPNG}
              src={process.env.PUBLIC_URL + "images/about/shopping.svg"}
              alt="Shopping"
            />
          </div>

          {/* Topic2 */}
          <div ref={moveArea} className={styles.topic2}>
            <img
              className={styles.earthPNG}
              src={process.env.PUBLIC_URL + "images/about/earth.svg"}
              alt="Earth"
            />

            <div className={styles.topic2_span}>
              <span className={styles.topic2_Title}>Our story</span>
              <div className={styles.content_Group}>
                <p className={styles.topic2_Content}>반갑습니다! </p>
                <p className={styles.topic2_Content}>
                  저희는 부산 소재 동아대학교에 재학 중인 컴퓨터공학과
                  학생들입니다.
                </p>
                <p className={styles.topic2_Content}>
                  Yoohoo는 사무용품을 공유하는 서비스가 해외에서는 활성화 되어
                  있지만, 아직 공유 문화가 익숙하지 않은 한국에서는 존재하지
                  않는 서비스임을 파악하고 그것을 활성화 하고자 만들게
                  되었습니다.
                </p>
                <p className={styles.topic2_Content}>
                  기업 간의 유휴 자원으로 남아 있는 사무용품을 공유함에 따라 양
                  쪽 기업이 모두 경제적 이익을 얻을 수 있습니다.
                </p>
                <p className={styles.topic2_Content}>
                  Yoohoo는 경제적 이익과 더불어 자원 순환으로 인한 폐기물 감소와
                  환경 보호에 궁극적인 목표를 두고 있으며 여러분과 함께 이루어
                  가고자 합니다.
                </p>
                <p className={styles.topic2_Content}>
                  Yoohoo 홈페이지에 방문해 주셔서 감사합니다 :{" )"}
                </p>
              </div>
            </div>
          </div>

          {/* Topic3 */}
          <div className={styles.topic3}>
            <span className={styles.topic3_Title}>Profile</span>
            <div className={styles.memberGroup}>
              <div className={styles.member}>
                <img
                  className={styles.memberImg}
                  src={process.env.PUBLIC_URL + "images/about/hj.svg"}
                  alt="HJ"
                />
                <p className={styles.memberName}>Oh Hyeon-ju</p>
                <p className={styles.memberRole}>Front-end Developer</p>
                <a href="https://github.com/OhHyeonJu0415" target="_blank">
                  <VscGithub className={styles.githubIcon} />
                </a>
                <a href="https://www.instagram.com/oh.___.hj/" target="_blank">
                  <FaInstagram className={styles.instaIcon} />
                </a>
              </div>

              <div className={styles.member}>
                <img
                  className={styles.memberImg}
                  src={process.env.PUBLIC_URL + "images/about/ys.svg"}
                  alt="YS"
                />
                <p className={styles.memberName}>Yoo Yeong-seo</p>
                <p className={styles.memberRole}>Front-end Developer</p>
                <a href="https://github.com/hanb613" target="_blank">
                  <VscGithub className={styles.githubIcon} />
                </a>
                <a href="https://www.instagram.com/_yeong__s2/" target="_blank">
                  <FaInstagram className={styles.instaIcon} />
                </a>
              </div>

              <div className={styles.member}>
                <img
                  className={styles.memberImg}
                  src={process.env.PUBLIC_URL + "images/about/hy.svg"}
                  alt="HY"
                />
                <p className={styles.memberName}>Ju Hyer-yeon</p>
                <p className={styles.memberRole}>Back-end Developer</p>
                <a href="https://github.com/object1997428" target="_blank">
                  <VscGithub className={styles.githubIcon} />
                </a>
                <a href="https://www.instagram.com/qqq_9797/" target="_blank">
                  <FaInstagram className={styles.instaIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default About;
