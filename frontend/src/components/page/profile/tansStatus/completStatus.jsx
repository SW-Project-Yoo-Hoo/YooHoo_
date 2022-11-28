import React, { useState, useEffect } from "react";
import styles from "./completStatus.module.css";
import { MdInfo, MdAttachMoney } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";

const CompletStatus = (props) => {
  const [post, setPost] = useState([]);

  //게시물 정보 버튼 토글 이벤트
  const onToggle = (id) => {
    setPost(
      post.map((post) =>
        post.deal_id === id ? { ...post, toggle: !post.toggle } : post
      )
    );
  };

  //게시물 정보 버튼
  const returnButtonShow = (props) => {
    return (
      <div className={styles.returnButtonShow}>
        {/* 금액, 대여단위 */}
        <div className={styles.dealPrice}>
          <span>
            {props.price.toLocaleString("ko-KR")}/{props.unit}
          </span>
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

  const ShowPost = (props) => {
    return (
      <div className={styles.post} key={props.deal_id}>
        {/* 게시물 사진 */}
        <div className={styles.postImgDay}>
          <Link to={`/detail/${props.post_id}`} state={{ info: props }}>
            <img
              className={styles.postImg}
              src={process.env.PUBLIC_URL + "productList/" + props.image}
              alt="이미지를 찾을 수 없습니다"
            />
          </Link>
          {/* button*/}
          <div
            className={styles.returnButton}
            onClick={(event) => {
              //이벤트 버블링 방지
              event.stopPropagation();
              //버튼 토글 이벤트
              onToggle(props.deal_id);
            }}
          >
            <MdInfo className={styles.iconInfoButton} />
          </div>
          {/* 게시물 정보 */}
          {props.toggle ? returnButtonShow(props) : ""}
        </div>

        {/* 게시물 제목 */}
        <div>
          <span className={styles.postTitle}>{props.title}</span>
        </div>

        {/* 게시물 총 금액 */}
        <div className={styles.postTotalPrice}>
          <div className={styles.iconPriceButtonWrapper}>
            <MdAttachMoney className={styles.iconPriceButton} />
          </div>
          <span>{props.total_price.toLocaleString("ko-KR")}원</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let postAdd = [...post];
    async function get() {
      await axios
        .get("/my/myPostDeals")
        .then(function (response) {
          if (response.data.code === 200) {
            //데이터 받기 성공
            let responseData = response.data.data;

            for (const [key, value] of Object.entries(responseData)) {
              postAdd[key] = {
                ...value,
                //버튼 토글 속성 추가
                toggle: false,
              };
            }
            setPost(postAdd.reverse());
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
          <span>완료된 거래가 없습니다</span>
        </div>
      ) : (
        <div className={styles.gridWrapper}>
          {post.map((post) => ShowPost(post))}
        </div>
      )}
    </div>
  );
};

export default CompletStatus;
