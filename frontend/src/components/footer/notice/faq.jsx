import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import Footer from "../footer";
import styles from "./faq.module.css";
import QnA from "./qna.js";

const FAQ = (props) => {
  /* 페이지 이동 시 스크롤 상단으로 */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [qnaList, setQnaList] = useState(QnA);

  const onClick = (id) => {
    setQnaList(
      qnaList.map((item) =>
        item.id === id ? { ...item, show: !item.show } : item
      )
    );
  };

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.imgGroup}>
          <img
            className={styles.headerImg}
            src={process.env.PUBLIC_URL + "images/headerBackground.png"}
            alt="Header"
          />
          <img
            className={styles.faqPNG}
            src={process.env.PUBLIC_URL + "images/faq/faq.svg"}
            alt="FAQ"
          />
        </div>

        <div className={styles.faqGroup}>
          {qnaList.map((item, id) => (
            <div className={item.show ? styles.showFAQ : styles.closeFAQ}>
              <div
                className={styles.closeFAQ_question}
                onClick={() => {
                  onClick(id);
                }}
              >
                <div className={styles.faqList}>
                  <div className={styles.Q}>
                    {item.show ? (
                      <img
                        className={styles.minusIcon}
                        src={process.env.PUBLIC_URL + "images/faq/minus.png"}
                        alt="Minus"
                      />
                    ) : (
                      <img
                        className={styles.plusIcon}
                        src={process.env.PUBLIC_URL + "images/faq/plus.png"}
                        alt="plus"
                      />
                    )}
                    <span className={styles.question}>{item.question}</span>
                  </div>

                  <div className={styles.A}>
                    <div
                      className={item.show ? styles.answer : styles.answer_none}
                    >
                      <p className={styles.p}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <img
            className={styles.footerImg}
            src={process.env.PUBLIC_URL + "images/footBackground.png"}
            alt="Footer"
          />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FAQ;
