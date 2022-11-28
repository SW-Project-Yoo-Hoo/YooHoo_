import React, { useState, useEffect } from "react";
import styles from "./waitStatus.module.css";
import moment from "moment";
import "moment/locale/ko";
import axios from "axios";
import { Link } from "react-router-dom";

const WaitStatus = (props) => {
  const [post, setPost] = useState([]);

  //디데이 계산하기
  const countDay = (props) => {
    //현재 날짜(형식 지정해주기)
    const now = moment(new Date(moment().format("YYYY.MM.DD")));

    //디데이를 설정할 날짜
    const dDay = moment(new Date(props.startDate));

    //day 기준으로 날짜 차이 구하기
    return dDay.diff(now, "days");
  };

  const ShowPost = (props) => {
    return (
      <div className={styles.post} key={props.deal_id}>
        {/* 게시물 사진 */}
        <Link to={`/detail/${props.post_id}`} state={{ info: props }}>
          <div className={styles.postImgDay}>
            <img
              className={styles.postImg}
              src={process.env.PUBLIC_URL + "productList/" + props.image}
              alt="이미지를 찾을 수 없습니다"
            />
            {/* d-day */}
            <div className={styles.dDay}>
              <span>D - {countDay(props)}</span>
            </div>
          </div>
        </Link>

        {/* 게시물 제목 */}
        <div>
          <span className={styles.postTitle}>{props.title}</span>
        </div>

        {/* 게시물 대여 날짜 */}
        <div className={[styles.dealDate, styles.dealDateMargin].join(" ")}>
          <span>시작날짜</span>
          <span>{props.startDate}</span>
        </div>
        <div className={styles.dealDate}>
          <span>반납날짜</span>
          <span>{props.returnDate}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let postAdd = [...post];
    async function get() {
      await axios
        .get("/my/myPreDeals")
        .then(function (response) {
          if (response.data.code === 200) {
            //데이터 받기 성공
            let responseData = response.data.data;
            for (const [key, value] of Object.entries(responseData)) {
              postAdd[key] = value;
            }
            setPost(postAdd);
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log(error);
        });
    }
    get();
  }, []);

  return (
    <div className={styles.container}>
      {post.length === 0 ? (
        <div className={styles.noPost}>
          <span>대기 중인 거래가 없습니다</span>
        </div>
      ) : (
        <div className={styles.gridWrapper}>
          {post.map((post) => ShowPost(post))}
        </div>
      )}
    </div>
  );
};

export default WaitStatus;
