import React, { useState, useEffect } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiPlus, BiMinus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { shopListThunk } from "../../../store/modules/shopList";
import styles from "./shopDetail.module.css";
import styled from "styled-components";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import ModalCal from "./modalCal";
import moment from "moment";
import axios from "axios";

const ShopDetail = (props) => {
  const REACT_PUBLIC_URL = "http://localhost:3000/";

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [startDate, setStartDay] = useState(""); //시작 날짜
  const [endDate, setEndDay] = useState(""); //반납 날짜
  const [count, setCount] = useState(1); // 수량
  const [dateCnt, setDateCnt] = useState(0); //일, 주, 월, 년 에 따라 계산 됨
  const [price, setPrice] = useState(0); // 총 금액

  const [productItem, setProductItem] = useState(""); //해당 게시물
  const [photoGroup, setPhotoGroup] = useState(""); //해당 게시물 사진 그룹
  const [currentItem, setCurrentItem] = useState(""); //선택된 사진

  /** 처음 렌더링 됐을 때, 현재 보여지는 사진 check */
  const [isPicLoaded, setIsPicLoaded] = useState(false);

  /** 거래하기 눌렀을 때 정보 check */
  /** 0: 거래 가능, 1: 대여 기간 미선택, 2: 본인 게시물 */
  const [trade, setTrade] = useState(0);

  /** 로그인 정보 check */
  const [loginInfo, setLoginInfo] = useState("");

  /**===================== */
  /* 추가 기능 */
  const [wish, setWish] = useState(false); // 찜하기 버튼
  const [wishItem, setWishItem] = useState(false);
  // const [wishItem, setWishItem] = useState(shopList); // 살펴보기 찜
  /**===================== */

  /* Shop -> Redux-Toolkit */
  const dispatch = useDispatch();
  const shopList = useSelector((state) => state.shopListSlice);

  useEffect(() => {
    dispatch(shopListThunk());
  }, []);

  /* 해당 아이템 */
  const location = useLocation();
  let nowItem = location.state.info;

  /* 페이지 이동 했을 때 */
  useEffect(() => {
    window.scrollTo(0, 0); // 스크롤 상단
    setStartDay("");
    setEndDay("");
    setCount(1);
    setPrice(0);
    setIsPicLoaded(false);
  }, [location]);

  /* 백엔드에서 선택한 게시물 가져오기 */
  useEffect(() => {
    const getItem = () => {
      axios
        .get(`/posts/${nowItem.post_id}`)
        .then((res) => {
          setProductItem(res.data.data);
          setPhotoGroup(
            res.data.data.photos.map((item, index) => ({
              id: index + 1,
              item,
              show: false,
            }))
          );
          setCurrentItem(res.data.data.photos[0]);
          setIsLoaded(true);
        })
        .catch((error) => console.log(error));
    };

    const getLoginCheck = () => {
      axios
        .get("/isLogin")
        .then((res) => {
          setLoginInfo(res.data);
        })
        .catch((error) => console.log(error));
    };

    getItem();
    getLoginCheck();
  }, [location]);

  /* 사용자가 고른 [시작 날짜 ~ 반납 날짜] => 대여 단위에 맞게 계산 */
  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDate = start.getTime() - end.getTime();

    let val = Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24))) + 1;
    switch (productItem.rental_unit) {
      case "일":
        val /= 1;
        break;
      case "주":
        val /= 7;
        break;
      case "월":
        val /= 30;
        break;
      case "년":
        val /= 365;
        break;
    }
    setDateCnt(val);
    setTrade(0);
  }, [startDate, endDate]);

  /* 총 금액 계산 */
  useEffect(() => {
    setPrice(dateCnt * count * productItem.rental_price);
  }, [dateCnt, count]);

  /* ================================ */
  /* 거래하기 버튼 */
  const navigate = useNavigate();

  const onClickTrade = () => {
    // 로그인 안 했을 때 -> 로그인 페이지로 이동
    if (loginInfo.data === false) {
      navigate("/login");
    } else {
      // 대여 기간 설정 안 했을 때
      if (isNaN(dateCnt)) {
        setTrade(1);
      }
      // 백엔드로 '거래 정보' POST
      else {
        const data = {
          post_id: nowItem.post_id,
          startDate: moment(startDate).format("YYYY-MM-DD"),
          returnDate: moment(endDate).format("YYYY-MM-DD"),
          total_price: price,
          rental_quantity: count,
        };
        axios
          .post("/requests", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            navigate("/profile", {
              state: {
                call: "SentStatus",
              },
            });
          })
          .catch((error) => setTrade(2));
      }
    }
  };

  /* ================================ */
  /* 모달창 닫기 */
  const modalClose = () => {
    setModalOpen(!modalOpen);
  };

  /* ================================ */
  /* 캘린더 시작, 반납 날짜 설정*/
  const changeStart = (value) => {
    setStartDay(value);
  };

  const changeEnd = (value) => {
    setEndDay(value);
  };

  /* ================================ */
  /* +, - 수량 버튼*/
  const plusBtn = () => {
    if (count >= productItem.quantity) {
      setCount(productItem.quantity);
    } else setCount(count + 1);
  };

  const minusBtn = () => {
    if (count === 1) {
      setCount(1);
    } else setCount(count - 1);
  };

  /* ================================ */
  /* 살펴보기 -> 왼쪽, 오른쪽 버튼 */

  function Left({ children, onClick }) {
    return (
      <div className={styles.lefttBtn}>
        <MdArrowBack onClick={onClick}>{children}</MdArrowBack>
      </div>
    );
  }

  function LeftArrow() {
    const { scrollPrev } = React.useContext(VisibilityContext);
    return <Left onClick={() => scrollPrev()} />;
  }

  function Right({ children, onClick }) {
    return (
      <div className={styles.rightBtn}>
        <MdArrowForward onClick={onClick}>{children}</MdArrowForward>
      </div>
    );
  }

  function RightArrow() {
    const { scrollNext } = React.useContext(VisibilityContext);
    return <Right onClick={() => scrollNext()} />;
  }

  /* ================================ */
  /* [게시물 상세보기] 찜하기 버튼 */
  const onClickWishBtn = () => {
    setWish((wish) => !wish);
  };

  /* [살펴보기] 찜하기 버튼 */
  function onClickWishBtn2(id, prevWish) {
    setWishItem(
      wishItem.map((it) => (it.id === id ? { ...it, wish: !prevWish } : it))
    );
  }

  /* ================================ */
  /* 물품 사진 */

  /** 크게 보여지는 사진 */
  const onView = (id) => {
    setCurrentItem(photoGroup.find((item) => item.id === id));
  };

  /* 사진 눌렀을 때 */
  function onClickPicture(id) {
    onView(id);

    /** 처음 렌더링 이후 다른 사진 클릭 했을 때 */
    if (photoGroup[0].show === true) {
      photoGroup[0].show = false;
      setIsPicLoaded(true);
    }

    for (let value of photoGroup) {
      if (value.id !== id) {
        value.show = false;
      } else {
        value.show = true;
      }
    }
  }

  /* ================================ */
  /* 카테고리 분류 */
  function Category(item) {
    switch (item) {
      case "desk":
        return "#책상";
      case "chair":
        return "#의자";
      case "faxMachine":
        return "#팩스기";
      case "copyMachine":
        return "#복사기";
      case "coffeeMachine":
        return "#커피머신";
      case "mouse":
        return "#마우스";
      case "computer":
        return "#컴퓨터";
    }
  }

  /* ================================ */
  return (
    <>
      {isLoaded && (
        <>
          <Header />
          <div className={styles.background}>
            <img
              className={styles.headerImg}
              src={process.env.PUBLIC_URL + "images/headerBackground.png"}
              alt="Header"
            />
            <div className={styles.container}>
              <div className={styles.productInfo}>
                {/* 사진, 회사 소개, 물품 소개, 살펴보기 */}
                <div className={styles.imgGroup}>
                  <div>
                    {currentItem.item ? (
                      <img
                        className={styles.img1}
                        src={
                          process.env.PUBLIC_URL +
                          "productList/" +
                          currentItem.item.dir
                        }
                        alt="Product"
                      />
                    ) : (
                      <img
                        className={styles.img1}
                        src={
                          process.env.PUBLIC_URL +
                          "productList/" +
                          currentItem.dir
                        }
                        alt="Product"
                      />
                    )}
                    <ul className={styles.imgBtn}>
                      {photoGroup &&
                        (!isPicLoaded && (photoGroup[0].show = true),
                        photoGroup.map((item, index) => (
                          <li
                            onClick={(event) => onClickPicture(item.id)}
                            key={index}
                          >
                            <img
                              className={
                                item.show ? styles.nowBtn : styles.imgBtnList
                              }
                              src={
                                process.env.PUBLIC_URL +
                                "productList/" +
                                item.item.dir
                              }
                              alt="Product"
                            />
                          </li>
                        )))}
                    </ul>
                  </div>
                </div>
                <div className={styles.company}>
                  {productItem.photo_dir === "" ? (
                    <img
                      className={styles.companyImg}
                      src={
                        process.env.PUBLIC_URL + "images/userProfileBasic.svg"
                      }
                      alt="Company"
                    />
                  ) : (
                    <img
                      className={styles.companyImg}
                      src={
                        process.env.PUBLIC_URL +
                        "productList/" +
                        productItem.photo_dir
                      }
                      alt="Company"
                    />
                  )}

                  <div className={styles.companyInfo}>
                    <p className={styles.companyName}>{productItem.company}</p>
                    <p className={styles.companyAddress}>
                      {productItem.address}
                    </p>
                  </div>
                </div>
                <div className={styles.hr}></div>
                <div>
                  <p className={styles.descriptionTitle}>물품 소개</p>
                  <div className={styles.descriptionContent}>
                    {productItem.explain}
                  </div>
                </div>
                <div className={styles.hr}></div>
                <div>
                  <p className={styles.lookTitle}>살펴보기</p>
                  <LookProducts>
                    <div className={styles.lookProducts}>
                      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                        {/* 현재 게시물과 다른것들만 보여주기 */}
                        {shopList.map(
                          (item, index) =>
                            item.post_id !== nowItem.post_id && (
                              <div key={index} className={styles.products1}>
                                <Link
                                  to={`/detail/${item.post_id}`}
                                  state={{ info: item }}
                                  key={index}
                                >
                                  <button className={styles.otherProductsBtn}>
                                    <img
                                      className={styles.otherProductsImg}
                                      src={
                                        process.env.PUBLIC_URL +
                                        "productList/" +
                                        item.image.dir
                                      }
                                      alt="Product"
                                    />
                                  </button>
                                  <div className={styles.info}>
                                    <p className={styles.otherProductsTitle}>
                                      {item.title}
                                    </p>
                                    <div className={styles.info2}>
                                      <p className={styles.otherProductsPrice}>
                                        {item.price.toLocaleString("ko-KR")}/
                                        {item.unit}
                                      </p>
                                      <div className={styles.unselectWishIcon}>
                                        <MdFavoriteBorder
                                          className={styles.unselectWishIcon}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            )
                        )}
                      </ScrollMenu>
                    </div>
                  </LookProducts>
                </div>
              </div>

              <div className={styles.productInfo2}>
                {/* 물품 제목, 대여 기간, 거래하기 버튼 */}
                <p className={styles.title}>{productItem.title}</p>
                <div className={styles.categoryGroup}>
                  {productItem.categories.map((item, index) => (
                    <div className={styles.category} key={index}>
                      {Category(item.name)}
                    </div>
                  ))}
                </div>
                <div className={styles.hr2}></div>
                <p className={styles.price}>
                  {productItem.rental_price.toLocaleString("ko-KR")}
                  원/
                  {productItem.rental_unit}
                </p>

                <div>
                  <div className={styles.period}>
                    <p className={styles.periodTitle}>대여 기간</p>
                    <div className={styles.helpImg}>
                      <AiOutlineExclamationCircle className={styles.helpImg} />
                      <div className={styles.helpContainer}>
                        <p className={styles.helpContent}>
                          대여 기간은 '{productItem.rental_unit}' 단위로만
                          <br></br>
                          설정할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className={
                      startDate === "" || endDate === ""
                        ? styles.periodBtn
                        : styles.selectPeriodBtn
                    }
                    onClick={modalClose}
                  >
                    {startDate === "" || endDate === ""
                      ? "대여 시작 날짜와 반납 날짜를 선택해주세요."
                      : moment(`${startDate}`).format("YYYY.MM.DD") +
                        "~" +
                        moment(`${endDate}`).format("YYYY.MM.DD")}
                  </button>
                  {modalOpen && (
                    <ModalCal
                      modalClose={modalClose}
                      changeStart={changeStart}
                      changeEnd={changeEnd}
                      unit={productItem.rental_unit}
                    />
                  )}
                </div>
                <div>
                  <p className={styles.countTitle}>수량</p>
                  <div className={styles.countBtns}>
                    <button className={styles.minusBtn} onClick={minusBtn}>
                      <BiMinus className={styles.btnIcon} />
                    </button>
                    <p className={styles.countNum}>{count}</p>
                    <button className={styles.plusBtn} onClick={plusBtn}>
                      <BiPlus className={styles.btnIcon} />
                    </button>
                  </div>
                </div>
                <div className={styles.hr2}></div>

                <div className={styles.totalCountInfo}>
                  <span className={styles.totalCountTitle}>주문 수량</span>
                  <p className={styles.totalCount}>{count} 개</p>
                </div>

                <div className={styles.totalPriceInfo}>
                  <span className={styles.totalPriceTitle}>총 금액</span>
                  <p className={styles.totalPrice}>
                    {isNaN(price) ? " " : price.toLocaleString("ko-KR")} 원
                  </p>
                </div>

                <div className={styles.btns}>
                  <button className={styles.tradeBtn} onClick={onClickTrade}>
                    거래하기
                  </button>
                  <button className={styles.wishBtn} onClick={onClickWishBtn}>
                    <div className={styles.wishContent}>
                      {wish ? (
                        <MdFavorite className={styles.wishIcon2} />
                      ) : (
                        <MdFavoriteBorder className={styles.wishIcon2} />
                      )}
                      <span>찜하기</span>
                    </div>
                  </button>
                </div>

                <div className={styles.warning}>
                  <p className={styles.warningText}>
                    {trade === 1 && "대여 기간을 설정해 주세요!"}
                    {trade === 2 &&
                      "본인 게시물에는 거래 요청을 할 수 없습니다!"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                <img
                  className={styles.footerImg}
                  src={process.env.PUBLIC_URL + "images/footBackground.png"}
                  alt="Footer"
                />
                <Footer />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShopDetail;

const LookProducts = styled.div`
  .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar {
    display: none;
  }
`;
