import React, { useState, useEffect } from "react";
import styles from "./receivedStatus.module.css";
import { MdPlayCircleFilled } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/ko";

const ReceivedStatus = (props) => {
  const [post, setPost] = useState([]);

  const [recommendPost, setRecommendPost] = useState([]);

  //현재 날짜(형식 지정해주기)
  const now = moment().format("YYYY.MM.DD");

  //수락,거절 버튼 토글 이벤트
  const onToggle = (id) => {
    setPost(
      post.map((post) =>
        post.request_id === id ? { ...post, toggle: !post.toggle } : post
      )
    );
  };

  //조합 추천 버튼 토글 이벤트
  const onRecommendToggle = (id) => {
    setPost(
      post.map((post) =>
        post.request_id === id
          ? {
              ...post,
              recommendToggle: !post.recommendToggle,
              warningText: false,
            }
          : post
      )
    );
  };

  //수락,거절 버튼/조합 추천 버튼 한번에 토글 이벤트
  const allToggle = (id) => {
    setPost(
      post.map((post) =>
        post.request_id === id
          ? {
              ...post,
              recommendToggle: !post.recommendToggle,
              toggle: !post.toggle,
            }
          : post
      )
    );
  };

  //경고 문구 토글 이벤트
  const warningToggle = (id, value) => {
    setPost(
      post.map((post) =>
        post.request_id === id ? { ...post, warningText: value } : post
      )
    );
  };

  //거절 후 포스트 지우기
  const remove = (id) => {
    // post.post_id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = post.post_id가 id 인 것을 제거함
    setPost(post.filter((post) => post.request_id !== id));
  };

  //조합추천 게시물 확인
  const recommendPostCheck = (id) => {
    for (const value of Object.values(recommendPost)) {
      if (value === id) {
        return true;
      }
    }
    return false;
  };

  //조합추천 입력 창
  const recommendModal = (props) => {
    //조합 추천 날짜 상태관리
    const changeHandling = (e) => {
      const { value, name } = e.target;
      if (name === "startDate") {
        setPost(
          post.map((post) =>
            post.request_id === props.request_id
              ? { ...post, recommendStartDate: value }
              : post
          )
        );
      } else {
        setPost(
          post.map((post) =>
            post.request_id === props.request_id
              ? { ...post, recommendEndDate: value }
              : post
          )
        );
      }
    };

    //조합추천결과 게시물 상태 관리
    const recommendResult = async () => {
      //시작날짜,반납날짜 백엔드 전송 형식 변환
      let startDate = moment(new Date(props.recommendStartDate)).format(
        "YYYY-MM-DD"
      );
      let endDate = moment(new Date(props.recommendEndDate)).format(
        "YYYY-MM-DD"
      );

      //백엔드로 정보 전송
      await axios
        .post("/my/recommended_request", {
          post_id: props.post_id,
          startDate,
          endDate,
        })
        .then(function (response) {
          if (response.data.code === 200) {
            //데이터 받기 성공

            // console.log(response);

            //해당 조합이 없을때
            if (response.data.data === null) {
              warningToggle(props.request_id, "true");
            } else {
              let responseData = response.data.data;
              let temp = [];

              for (const [key, value] of Object.entries(responseData)) {
                temp = {
                  ...value,
                };
              }
              console.log(temp);
              setRecommendPost(temp);
              setPost(
                post.map((post) =>
                  post.request_id === props.request_id
                    ? {
                        ...post,
                        recommend: "취소",
                        recommendToggle: !post.recommendToggle,
                        toggle: !post.toggle,
                      }
                    : post
                )
              );
            }
          }
        })
        .catch(function (error) {
          // 오류발생시 실행
          console.log(error);
        });
    };

    return (
      <div className={styles.recommend}>
        {/* 제목 */}
        <div className={styles.recommendTitle}>
          <span>거래 기간을 설정해주세요</span>
        </div>

        {/* 날짜 입력 */}
        <div className={styles.recommendDate}>
          {/* 시작날짜 */}
          <div className={styles.recommendStartDate}>
            <label className={styles.label}>
              시작날짜
              <input
                type="text"
                name="startDate"
                onChange={changeHandling}
                value={props.recommendStartDate}
                placeholder={now}
                className={styles.input}
              />
            </label>
          </div>

          {/* 반납날짜 */}
          <div className={styles.recommendEndDate}>
            <label className={styles.label}>
              반납날짜
              <input
                type="text"
                name="endDate"
                onChange={changeHandling}
                value={props.recommendEndDate}
                placeholder={now}
                className={styles.input}
              />
            </label>
          </div>

          {/* 경고문구 */}
          {props.warningText ? (
            <div className={styles.warningText}>
              <span>해당되는 요청이 없습니다! 정보를 다시 확인해주세요</span>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* 취소, 확인 버튼 */}
        <div className={styles.recommendSubmit}>
          <button
            className={styles.recommendSubmitButton}
            onClick={() => {
              allToggle(props.request_id);
            }}
          >
            취소
          </button>
          <button
            className={[
              styles.recommendDone,
              styles.recommendSubmitButton,
            ].join(" ")}
            onClick={() => {
              //시작날짜,반납날짜 형식이 모두 맞으면
              if (
                moment(
                  props.recommendStartDate,
                  "YYYY.MM.DD",
                  true
                ).isValid() &&
                moment(props.recommendEndDate, "YYYY.MM.DD", true).isValid()
              ) {
                //시작날짜와 반납날짜의 순서가 맞으면
                if (
                  moment(new Date(props.recommendEndDate)).isAfter(
                    new Date(props.recommendStartDate)
                  )
                ) {
                  //백엔드로 정보 전송
                  recommendResult();
                } else {
                  warningToggle(props.request_id, "true");
                }
              }
              //시작날짜,반납날짜 형식이 틀리면
              else {
                warningToggle(props.request_id, "true");
              }
            }}
          >
            완료
          </button>
        </div>
      </div>
    );
  };

  //조합추천,수락,거절 버튼
  const returnButtonShow = (props) => {
    //조합 추천 취소하기
    const recommendCancle = (props) => {
      setRecommendPost([]);
      setPost(
        post.map((post) =>
          post.request_id === props.request_id
            ? {
                ...post,
                recommend: "받기",
                toggle: !post.toggle,
              }
            : post
        )
      );
    };

    //수락하기
    const acceptButton = (event) => {
      //백엔드로 거래 수락 정보 전송
      event.stopPropagation();
      axios
        .post(`/requests/${props.request_id}`)
        .then(function (response) {
          console.log(response);
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

    //거절하기
    const rejectButton = (event) => {
      //백엔드로 거래 거절 정보 전송
      event.stopPropagation();

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
        {/* 조합 추천 받기/취소 */}
        <div
          className={styles.returnButtonText}
          onClick={() => {
            {
              props.recommend === "받기"
                ? onRecommendToggle(props.request_id)
                : recommendCancle(props);
            }
          }}
        >
          <span>조합 추천 {props.recommend}</span>
        </div>
        <div className={styles.returnButtonLine} />
        {/* 수락하기 */}
        <div
          className={styles.returnButtonText}
          onClick={(event) => acceptButton(event)}
        >
          <span>수락하기</span>
        </div>
        <div className={styles.returnButtonLine} />
        {/* 거절하기 */}
        <div
          className={styles.returnButtonText}
          onClick={(event) => rejectButton(event)}
        >
          <span>거절하기</span>
        </div>
      </div>
    );
  };

  //게시물
  const ShowPost = (props) => {
    return (
      <div className={styles.post} key={props.request_id}>
        {/* 게시물 사진 */}
        <div className={styles.postImgDay}>
          <Link to={`/detail/${props.post_id}`} state={{ info: props }}>
            <img
              className={[
                styles.postImg,
                recommendPostCheck(props.request_id)
                  ? styles.recommendImage
                  : "",
              ].join(" ")}
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
            <MdPlayCircleFilled className={styles.iconButton} />
          </div>
          {/* 수락하기, 거절하기 버튼 */}
          {props.toggle ? returnButtonShow(props) : ""}
          {props.recommendToggle ? recommendModal(props) : ""}
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
        .get("/my/requests_received")
        .then(function (response) {
          if (response.data.code === 200) {
            //데이터 받기 성공
            let responseData = response.data.data;

            for (const [key, value] of Object.entries(responseData)) {
              postAdd[key] = {
                ...value,
                //버튼 토글 속성 추가
                toggle: false,
                //조합 추천 토글 속성 추가
                recommendToggle: false,
                //조합 추천 시작날짜 속성 추가
                recommendStartDate: now,
                //조합 추천 반납날짜 속성 추가
                recommendEndDate: now,
                //경고 문구 속성 추가
                warningText: false,
                //조합 추천 상태 속성 추가
                recommend: "받기",
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
          <span>받은 요청이 없습니다</span>
        </div>
      ) : (
        <div className={styles.gridWrapper}>
          {post.map((post) => ShowPost(post))}
        </div>
      )}
    </div>
  );
};

export default ReceivedStatus;
