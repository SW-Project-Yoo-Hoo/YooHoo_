import React from "react";
import styles from "./bookMarkPost.module.css";

const bookMarkPost = (props) => {
  const post = [];

  const postInfo1 = {
    //테스트용 객체
    id: "게시글 아이디1",
    img: "/Images/test.jpeg",
    title: "testTitle이 얼마나 길어질까유쩔죠~~",
    unit: "월",
    price: 500000,
  };

  const postInfo2 = {
    //테스트용 객체
    id: "게시글 아이디2",
    img: "/Images/home/earth.svg",
    title: "testTitle이 얼마나 길어질까유쩔죠~~",
    unit: "일",
    price: 50000,
  };

  const getpost = () => {
    //백엔드에서 정보 가져오기
    //정보가 존재하면 객체 넣기
    // post.push(postInfo1);
    // post.push(postInfo2);
  };

  const pageNaviHandling = (props) => {
    //해당 페이지 상세보기로 이동하기
    console.log("이동하기!");
  };

  const ShowPost = (props, id) => {
    return (
      <div
        className={styles.post}
        onClick={() => pageNaviHandling(props)}
        key={id}
      >
        {/* 게시물 사진 */}
        <img className={styles.postImg} src={props.img} alt="img" />

        {/* 게시물 제목 */}
        <div>
          <span className={styles.postTitle}>{props.title}</span>
        </div>

        {/* 게시물 가격/단위 */}
        <div>
          <span className={styles.colorUnselcet}>
            {props.price.toLocaleString("ko-KR")}원/{props.unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {getpost()}
      {/* 게시물이 없을때 */}
      <div className={post.length === 0 ? styles.noPost : styles.displayNone}>
        <span>찜한 게시물이 없습니다</span>
      </div>

      {/* 게시물이 있을때 */}
      <div
        className={post.length === 0 ? styles.displayNone : styles.gridWrapper}
      >
        {post.map((post) => ShowPost(post, post.id))}
      </div>
    </div>
  );
};

export default bookMarkPost;
