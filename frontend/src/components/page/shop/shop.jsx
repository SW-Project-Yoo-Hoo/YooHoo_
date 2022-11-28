import React, { useState, useEffect, useRef } from "react";
import Footer from "../../footer/footer";
import styles from "./shop.module.css";
import { MdChecklistRtl, MdFavoriteBorder, MdFavorite } from "react-icons/md";
import Header from "../../header/header";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { shopListThunk } from "../../../store/modules/shopList";
import { useDispatch, useSelector } from "react-redux";

const Shop = (props) => {
  const REACT_PUBLIC_URL = "http://localhost:3000/";

  /* Redux-Toolkit */
  const dispatch = useDispatch();
  const shopList = useSelector((state) => state.shopListSlice);

  const [wishItem, setWishItem] = useState(shopList);
  // const [wishItem, setWishItem] = useState(ShopImg);

  useEffect(() => {
    dispatch(shopListThunk());
  }, []);

  /* 페이지 이동 시 스크롤 상단으로 */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* 찜하기 버튼 */
  function onClickWishBtn(id, prevWish) {
    setWishItem(
      wishItem.map((it) => (it.id === id ? { ...it, wish: !prevWish } : it))
    );
  }

  /* ============================================== */
  /* SHOP -> 조합 추천 받기 */

  /** '조합 추천 받기' 버튼 */
  const [recommend, setRecommend] = useState(false);
  /** '추천 받기' 버튼 */
  const [getRecommend, setGetRecommend] = useState(false);

  const nowDate = new Date();
  const [startDate, setStartDate] = useState(
    moment(nowDate).format("YYYY. MM. DD")
  );
  const [endDate, setEndDate] = useState(
    moment(nowDate).format("YYYY. MM. DD")
  );

  const [showDate, setShowDate] = useState([]);

  /** 추천 받은 게시물 id*/
  const [postId, setPostId] = useState("");
  /** 추천 받은 게시물*/
  const [recPost, setRecPost] = useState("");
  /** 추천 받은 게시물 있는지 ? 없는지 ? */
  const [isRecPost, setIsRecPost] = useState(false);

  // 대여 물품
  const [stuffs, setStuffs] = useState({
    desk: false,
    chair: false,
    faxMachine: false,
    copyMachine: false,
    coffeeMachine: false,
    mouse: false,
    computer: false,
  });

  const {
    desk,
    chair,
    faxMachine,
    copyMachine,
    coffeeMachine,
    mouse,
    computer,
  } = stuffs;

  //대여물품 상태 업데이트
  const changeStuffHandling = (objects, id, value) => {
    const name = objects[id];
    setStuffs({
      ...stuffs,
      [name]: !value,
    });
  };

  /* '조합 추천 받기' 버튼 -> 정보 초기화*/
  const onClickRecommend = () => {
    setGetRecommend(false);
    setRecommend((recommend) => !recommend);
    setStartDate(moment(nowDate).format("YYYY. MM. DD"));
    setEndDate(moment(nowDate).format("YYYY. MM. DD"));
    setStuffs({
      desk: false,
      chair: false,
      faxMachine: false,
      copyMachine: false,
      coffeeMachine: false,
      mouse: false,
      computer: false,
    });
  };

  /* '추천 받기' 버튼 */
  /* 백엔드에 추천 받은 정보 보내기 */
  const onClickGetRecommend = () => {
    let cmpA = new Date(startDate);
    let cmpB = new Date(endDate);

    if (cmpA > cmpB) {
      setGetRecommend(true);
      setIsRecPost(false);
    } else {
      let categories = [];
      for (const [key, value] of Object.entries(stuffs)) {
        if (value) categories.push(key);
      }

      const data = {
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
        categoryNames: categories,
      };

      axios
        .post("/my/recommended_post", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setGetRecommend(true);
          if (res.data.message === "게시물 추천 성공") {
            setPostId(res.data.data.post_id);
            setIsRecPost(true);
            shopList.map(
              (item) =>
                item.post_id === res.data.data.post_id && setRecPost(item)
            );
            setShowDate({ startDate, endDate });
          } else {
            setIsRecPost(false);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const startDateRef = useRef();
  const endDateRef = useRef();

  function startDateChange(e, val) {
    const dateLength = 8;
    let value = "",
      result = "";

    val === "start"
      ? (value = startDateRef.current.value.replace(/\D+/g, ""))
      : (value = endDateRef.current.value.replace(/\D+/g, ""));

    for (let i = 0; i < value.length && i < dateLength; i++) {
      switch (i) {
        case 4:
          result += ". ";
          break;
        case 6:
          result += ". ";
          break;
        default:
          break;
      }

      result += value[i];
    }

    if (val === "start") {
      startDateRef.current.value = result;
      setStartDate(e.target.value);
    } else {
      endDateRef.current.value = result;
      setEndDate(e.target.value);
    }
  }
  /* ============================================== */

  return (
    <>
      <Header />
      <div className={styles.background}>
        <img
          className={styles.headerImg}
          src={process.env.PUBLIC_URL + "images/headerBackground.png"}
          alt="Header"
        />

        <div className={styles.container}>
          <div className={styles.spanGroup}>
            <span className={styles.title}>SHOP</span>

            <div className={styles.recommendDiv}>
              <div className={styles.recommendBtn} onClick={onClickRecommend}>
                <MdChecklistRtl className={styles.recommendIcon} />
                <span className={styles.recommendSpan}>조합 추천 받기</span>
              </div>
              {recommend && (
                <div className={styles.contents}>
                  <div className={styles.finishBtn} onClick={onClickRecommend}>
                    완료
                  </div>
                  <div className={styles.recommendHr}></div>
                  <div className={styles.dateContainer}>
                    <span className={styles.startTitle}>시작 날짜</span>
                    <span className={styles.endTitle}>반납 날짜</span>
                    <div className={styles.dateDiv}>
                      <input
                        type="text"
                        className={styles.dateInput}
                        onChange={(e) => startDateChange(e, "start")}
                        value={startDate}
                        ref={startDateRef}
                      />
                      <input
                        type="text"
                        className={styles.dateInput}
                        onChange={(e) => startDateChange(e, "end")}
                        value={endDate}
                        ref={endDateRef}
                      />
                    </div>
                  </div>

                  <div className={styles.categories}>
                    <div className={styles.spanGroup2}>
                      <span className={styles.startTitle}>카테고리</span>
                      <span className={styles.title2}>복수 선택 가능</span>
                    </div>
                    <div className={styles.btnGroup}>
                      <button
                        className={styles.tlBtn}
                        onClick={() => {
                          changeStuffHandling(Object.keys(stuffs), 0, desk);
                        }}
                      >
                        <span
                          className={desk ? styles.select : styles.unselect}
                        >
                          책상
                        </span>
                      </button>
                      <button
                        className={styles.tBtn}
                        onClick={() => {
                          changeStuffHandling(Object.keys(stuffs), 1, chair);
                        }}
                      >
                        <span
                          className={chair ? styles.select : styles.unselect}
                        >
                          의자
                        </span>
                      </button>
                      <button
                        className={styles.tBtn}
                        onClick={() => {
                          changeStuffHandling(
                            Object.keys(stuffs),
                            2,
                            faxMachine
                          );
                        }}
                      >
                        <span
                          className={
                            faxMachine ? styles.select : styles.unselect
                          }
                        >
                          팩스기
                        </span>
                      </button>
                      <button
                        className={styles.trBtn}
                        onClick={() => {
                          changeStuffHandling(
                            Object.keys(stuffs),
                            3,
                            copyMachine
                          );
                        }}
                      >
                        <span
                          className={
                            copyMachine ? styles.select : styles.unselect
                          }
                        >
                          복사기
                        </span>
                      </button>
                      <button
                        className={styles.blBtn}
                        onClick={() => {
                          changeStuffHandling(
                            Object.keys(stuffs),
                            4,
                            coffeeMachine
                          );
                        }}
                      >
                        <span
                          className={
                            coffeeMachine ? styles.select : styles.unselect
                          }
                        >
                          커피머신
                        </span>
                      </button>
                      <button
                        className={styles.bBtn}
                        onClick={() => {
                          changeStuffHandling(Object.keys(stuffs), 5, mouse);
                        }}
                      >
                        <span
                          className={mouse ? styles.select : styles.unselect}
                        >
                          마우스
                        </span>
                      </button>
                      <button
                        className={styles.bBtn}
                        onClick={() => {
                          changeStuffHandling(Object.keys(stuffs), 6, computer);
                        }}
                      >
                        <span
                          className={computer ? styles.select : styles.unselect}
                        >
                          컴퓨터
                        </span>
                      </button>
                      <button className={styles.brBtn}></button>
                    </div>
                    <div
                      className={styles.getBtn}
                      onClick={onClickGetRecommend}
                    >
                      추천 받기
                    </div>
                  </div>
                  <div className={styles.recommendHr2}></div>
                  <div className={styles.recommend}>
                    {getRecommend ? (
                      isRecPost ? (
                        <Link
                          to={`/detail/${postId}`}
                          state={{ info: recPost }}
                        >
                          <div className={styles.productInfo}>
                            <img
                              className={styles.recommendImg}
                              src={
                                process.env.PUBLIC_URL +
                                "productList/" +
                                recPost.image.dir
                              }
                              alt="Product"
                            />

                            <div className={styles.recommendGroup}>
                              <span className={styles.recommendTitle}>
                                {recPost.title}
                              </span>
                              <div className={styles.recommendDateGroup}>
                                <span className={styles.recommendDateTitle}>
                                  시작 날짜
                                </span>
                                <span className={styles.recommendDate}>
                                  {showDate.startDate}
                                </span>
                              </div>
                              <div className={styles.recommendDateGroup}>
                                <span className={styles.recommendDateTitle}>
                                  반납 날짜
                                </span>
                                <span className={styles.recommendDate}>
                                  {showDate.endDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <span className={styles.alertText}>
                          해당되는 게시물이 없습니다! <br />
                          정보를 다시 확인해주세요
                        </span>
                      )
                    ) : (
                      <span className={styles.alertText}>
                        가장 저렴한 게시물을 추천 받아 보세요!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.hr}></div>
            <span className={styles.subTitle}>All Products</span>
          </div>
          <div className={styles.productGroup}>
            {shopList.map((item, index) => (
              <Link
                to={`/detail/${item.post_id}`}
                state={{ info: item }}
                key={index}
              >
                <div className={styles.product}>
                  <img
                    className={styles.productImg}
                    src={
                      process.env.PUBLIC_URL + "productList/" + item.image.dir
                    }
                    alt="Product"
                  />
                  <div className={styles.info}>
                    <p className={styles.productTitle}>{item.title}</p>
                    <div className={styles.info2}>
                      <p className={styles.productPrice}>
                        {item.price.toLocaleString("ko-KR")}원/{item.unit}
                      </p>
                      <div className={styles.unselectWishIcon}>
                        <MdFavoriteBorder className={styles.unselectWishIcon} />
                      </div>

                      {/* 찜하기 기능 추가시 주석 제거 */}
                      {/* <div
                      className={
                        wishItem[item.id - 1].wish
                          ? styles.selectWishIcon
                          : styles.unselectWishIcon
                      }
                      onClick={() =>
                        onClickWishBtn(item.id, wishItem[item.id - 1].wish)
                      }
                    >
                      {wishItem[item.id - 1].wish ? (
                        <MdFavorite className={styles.selectWishIcon} />
                      ) : (
                        <MdFavoriteBorder className={styles.unselectWishIcon} />
                      )}
                    </div> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <img
              className={styles.footerImg}
              src={process.env.PUBLIC_URL + "images/footBackground.png"}
              alt="Footer"
            />
            <img
              className={styles.footerImg2}
              src={process.env.PUBLIC_URL + "images/shop/bottomIllu.svg"}
              alt="Illu"
            />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
