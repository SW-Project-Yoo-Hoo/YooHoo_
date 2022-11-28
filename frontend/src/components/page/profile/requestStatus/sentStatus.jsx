import React, { useState, useEffect } from "react";
import styles from "./sentStatus.module.css";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";

const SentStatus = (props) => {
  const [post, setPost] = useState([]);

  //요청취소 버튼 토글 이벤트
  const onToggle = (id) => {
    setPost(
      post.map((post) =>
        post.request_id === id ? { ...post, toggle: !post.toggle } : post
      )
    );
  };

  //거절 후 포스트 지우기
  const remove = (id) => {
    // post.post_id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = post.post_id 가 id 인 것을 제거함
    setPost(post.filter((post) => post.request_id !== id));
  };

  //요청 취소 버튼
  const returnButtonShow = (props) => {
    const cancelRequest = (event) => {
      //백엔드로 거래 취소 정보 전송
      event.stopPropagation();
      console.log("요청 취소");
      axios
        .put(`/requests/${props.request_id}`)
        .then(function (response) {
          if (response.data.code === 200) {
            //거절 성공
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log(error);
        });
      remove(props.request_id);
    };

    return (
      <div className={styles.returnButtonShow}>
        <div
          className={styles.returnButtonText}
          onClick={(event) => cancelRequest(event)}
        >
          <span>요청 취소</span>
        </div>
      </div>
    );
  };

  const ShowPost = (props) => {
    return (
      <div className={styles.post} key={props.request_id}>
        {/* 게시물 사진 */}
        <div className={styles.postImgDay}>
          <Link to={`/detail/${props.post_id}`} state={{ info: props }}>
            <img
              className={styles.postImg}
              src={process.env.PUBLIC_URL + "productList/" + props.image.dir}
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
              onToggle(props.request_id);
            }}
          >
            <MdCancel className={styles.iconButton} />
          </div>
          {/* 요청취소 버튼 */}
          {props.toggle ? returnButtonShow(props) : ""}
        </div>

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
        .get("/my/requests")
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
  }, [post.post_id]);

  return (
    <div className={styles.container}>
      {post.length === 0 ? (
        <div className={styles.noPost}>
          <span>대기 요청이 없습니다</span>
        </div>
      ) : (
        <div className={styles.gridWrapper}>
          {post.map((post) => ShowPost(post))}
        </div>
      )}
    </div>
  );
};

export default SentStatus;
