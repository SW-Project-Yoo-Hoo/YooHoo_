import React, { useState, useEffect } from "react";
import styles from "./post.module.css";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdCheck, MdPhotoCamera } from "react-icons/md";
import axios from "axios";

const Post = (props) => {
  //입력 데이터 확인
  const [incorrect, setIncorrect] = useState(false);
  const [alertText, setAlertText] = useState("test");

  const navigate = useNavigate();

  //제목, 상세내용
  const [inputs, setInputs] = useState({
    title: "",
    contents: "",
    price: "",
    quantity: "",
  });

  const { title, contents, price, quantity } = inputs;

  //제목, 상세내용 상태 업데이트
  const changeHandling = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  //이미지
  const [showImages, setShowImages] = useState([]);

  //백엔드로 전송할 이미지
  const [uploadFile, setUploadFile] = useState([]);

  // 이미지 상대경로 및 파일 저장
  const imageAddHandling = (e) => {
    const imageLists = e.target.files;
    let imageUrlLists = [...showImages];
    let imageUrlListsOrigin = [...uploadFile];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
      imageUrlListsOrigin.push(imageLists[i]);
    }

    if (imageUrlLists.length > 8) {
      imageUrlLists = imageUrlLists.slice(0, 8);
      imageUrlListsOrigin = imageUrlListsOrigin.slice(0, 8);
    }

    setShowImages(imageUrlLists);
    setUploadFile(imageUrlListsOrigin);
    console.log(uploadFile);
  };

  // X버튼 클릭 시 이미지 삭제
  const imageDeleteHandling = (id) => {
    setShowImages(showImages.filter((_, index) => index !== id));
    setUploadFile(uploadFile.filter((_, index) => index !== id));
  };

  const onChangeImg = (e) => {
    e.preventDefault();
  };

  //대여 물품 선택
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

  //대여단위
  const [dealUnit, setDealUnit] = useState("일");

  const enrollPost = async () => {
    //백엔드로 데이터 전송
    const formData = new FormData();
    //게시물 제목
    formData.append("title", title);
    //대여 단위
    formData.append("rental_unit", dealUnit);
    //대여 가격
    formData.append("rental_price", price);
    //수량
    formData.append("quantity", quantity);
    //내용
    formData.append("explain", contents);

    //사진들
    for (let i = 0; i < uploadFile.length; i++) {
      formData.append("photos", uploadFile[i]);
    }

    //카테고리들
    let categories = [];
    for (const [key, value] of Object.entries(stuffs)) {
      if (value) categories.push(key);
    }
    if (categories.length > 0) {
      //카테고리가 존재하면 이름 보내기
      for (let i = 0; i < categories.length; i++) {
        formData.append("categories", categories[i]);
      }
    } else {
      //카테고리가 존재하지 않으면 빈 배열 보내기
      formData.append("categories", Array.from({ length: 1 }));
    }

    const item = {
      title: title,
      rental_unit: dealUnit,
      rental_price: price,
      quantity: quantity,
      explain: contents,
      photos: uploadFile,
      categories: categories,
    };

    console.log(item);
    await axios
      .post("/posts", formData, {
        headers: {
          "Contest-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response);
        if (response.data.code === 201) {
          //게시물 등록 완료 되면 상세보기로 이동하기
          item.post_id = response.data.data;
          console.log(item);
          // window.location.href = `/detail/${response.data.data}`;
          navigate(`/detail/${response.data.data}`, {
            state: { info: item },
          });
          //state={{ info: props }}
        } else {
          console.log(response);
          //내부오류
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 등록하기 버튼 클릭 핸들링
  const postClickHandling = () => {
    //데이터 입력 확인
    if (title === "") {
      setAlertText("제목을 입력해주세요");
      setIncorrect(true);
    } else if (showImages.length < 1) {
      setAlertText("이미지를 첨부해주세요");
      setIncorrect(true);
    } else if (price === "") {
      setAlertText("가격을 입력해주세요");
      setIncorrect(true);
    } else if (quantity === "") {
      setAlertText("수량을 입력해주세요");
      setIncorrect(true);
    } else if (contents === "") {
      setAlertText("상세 내용을 입력해주세요");
      setIncorrect(true);
    } else {
      //데이터 입력이 모두 되어 있다면

      setIncorrect(false);
      enrollPost();
    }
  };

  const isNotNumber = (value) => {
    const regExp = /[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|-]/g;
    return regExp.test(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      {/* header */}
      <Header />
      <div className={styles.backGroundIamgeHeader} />

      {/* contents */}
      <div className={styles.postContainer}>
        {/* 게시물 제목 */}
        <div className={styles.title}>
          <span className={styles.titleText}>게시물 제목</span>
          <input
            type="text"
            name="title"
            maxLength="19"
            onChange={changeHandling}
            value={title}
            placeholder="게시물 제목을 입력해주세요(최대 20자)"
            className={styles.titleInput}
          />
        </div>

        {/* 이미지 */}
        <div className={styles.imageEnroll}>
          {/* 글자 */}
          <div className={styles.imageEnrollText}>
            <div className={styles.textMain}>
              <span className={styles.colorHighlight1}>이미지</span>
              <span className={styles.colorMainGreen}> *</span>
            </div>
            <span className={styles.textSub}>최대 8장 첨부 가능</span>
          </div>

          {/* 이미지 첨부 */}
          <div className={styles.imageEnrollPick}>
            {/* 이미지 미리보기 및 삭제 */}
            <div className={styles.imagePicked}>
              {/* 이미지 선택 전  */}
              <div
                className={
                  showImages.length > 0
                    ? styles.displayNone
                    : styles.imageUnPick
                }
              >
                <MdPhotoCamera className={styles.imageUnPickIcon} />
              </div>

              {/* 이미지 선택 후 */}
              {showImages.map((image, id) => (
                <div className={styles.imagePickedBord} key={id}>
                  {/* 삭제버튼 */}
                  <div
                    className={styles.deleteButton}
                    onClick={() => imageDeleteHandling(id)}
                  >
                    <MdCancel className={styles.deleteButtonStyle} />
                  </div>

                  {/* 이미지 미리보기 */}
                  <img
                    className={styles.imagePickedStyle}
                    src={process.env.PUBLIC_URL + image}
                    alt={`${image}-${id}`}
                  />
                </div>
              ))}
            </div>

            {/* 이미지 첨부하기 */}
            <label className={styles.buttonStyle} onChange={imageAddHandling}>
              첨부하기
              <input
                type="file"
                id="imgFile"
                multiple
                accept="image/*"
                className={styles.displayNone}
                onChange={onChangeImg}
              />
            </label>
          </div>
        </div>

        {/* 대여 물품 선택 */}
        <div className={styles.stuff}>
          {/* 제목 */}
          <div className={styles.imageEnrollText}>
            <div className={styles.textMain}>
              <span className={styles.colorHighlight1}>대여 물품</span>
            </div>
            <span className={styles.textSub}>복수 선택 가능</span>
          </div>

          {/* 물품 선택 */}
          <div className={styles.stuffPick}>
            {/* 책상 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 0, desk);
              }}
            >
              {/* text */}
              <div
                className={[
                  styles.stuffName,
                  desk ? styles.colorHighlight1 : styles.colorUnselect,
                ].join(" ")}
              >
                책상
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    desk ? styles.colorMainGreen : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 의자 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 1, chair);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    chair ? styles.colorHighlight1 : styles.colorUnselect,
                  ].join(" ")}
                >
                  의자
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    chair ? styles.colorMainGreen : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 팩스기 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 2, faxMachine);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    faxMachine ? styles.colorHighlight1 : styles.colorUnselect,
                  ].join(" ")}
                >
                  팩스기
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    faxMachine
                      ? styles.colorMainGreen
                      : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 복사기 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 3, copyMachine);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    copyMachine ? styles.colorHighlight1 : styles.colorUnselect,
                  ].join(" ")}
                >
                  복사기
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    copyMachine
                      ? styles.colorMainGreen
                      : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 커피머신 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 4, coffeeMachine);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    coffeeMachine
                      ? styles.colorHighlight1
                      : styles.colorUnselect,
                  ].join(" ")}
                >
                  커피머신
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    coffeeMachine
                      ? styles.colorMainGreen
                      : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 마우스 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 5, mouse);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    mouse ? styles.colorHighlight1 : styles.colorUnselect,
                  ].join(" ")}
                >
                  마우스
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    mouse ? styles.colorMainGreen : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>

            {/* 컴퓨터 */}
            <div
              className={styles.stuffChoice}
              onClick={() => {
                changeStuffHandling(Object.keys(stuffs), 6, computer);
              }}
            >
              {/* text */}
              <div className={styles.stuffLineName}>
                <span
                  className={[
                    styles.stuffName,
                    computer ? styles.colorHighlight1 : styles.colorUnselect,
                  ].join(" ")}
                >
                  컴퓨터
                </span>
              </div>

              {/* check */}
              <div>
                <MdCheck
                  className={[
                    styles.stuffIcon,
                    computer
                      ? styles.colorMainGreen
                      : styles.colorIconLightGrey,
                  ].join(" ")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 대여 단위, 가격 및 수량 */}
        <div className={styles.deal}>
          {/* 대여단위 */}
          <div className={styles.unit}>
            {/* 제목 */}
            <div className={styles.textMain}>
              <span className={styles.colorHighlight1}>대여 단위</span>
              <span className={styles.colorMainGreen}> *</span>
            </div>

            {/* 선 */}
            <div className={styles.line}></div>

            {/* 단위 선택 */}
            <div className={styles.unitPick}>
              {/* 일 */}
              <div
                className={styles.stuffChoice}
                onClick={() => {
                  setDealUnit("일");
                }}
              >
                {/* text */}
                <div
                  className={[
                    styles.stuffName,
                    dealUnit === "일"
                      ? styles.colorHighlight1
                      : styles.colorUnselect,
                  ].join(" ")}
                >
                  일 단위
                </div>

                {/* check */}
                <div>
                  <MdCheck
                    className={[
                      styles.stuffIcon,
                      dealUnit === "일"
                        ? styles.colorMainGreen
                        : styles.colorIconLightGrey,
                    ].join(" ")}
                  />
                </div>
              </div>

              {/* 주 */}
              <div
                className={styles.stuffChoice}
                onClick={() => {
                  setDealUnit("주");
                }}
              >
                {/* text */}
                <div className={styles.stuffLineName}>
                  <span
                    className={[
                      styles.stuffName,
                      dealUnit === "주"
                        ? styles.colorHighlight1
                        : styles.colorUnselect,
                    ].join(" ")}
                  >
                    주 단위
                  </span>
                </div>

                {/* check */}
                <div>
                  <MdCheck
                    className={[
                      styles.stuffIcon,
                      dealUnit === "주"
                        ? styles.colorMainGreen
                        : styles.colorIconLightGrey,
                    ].join(" ")}
                  />
                </div>
              </div>

              {/* 월 */}
              <div
                className={styles.stuffChoice}
                onClick={() => {
                  setDealUnit("월");
                }}
              >
                {/* text */}
                <div className={styles.stuffLineName}>
                  <span
                    className={[
                      styles.stuffName,
                      dealUnit === "월"
                        ? styles.colorHighlight1
                        : styles.colorUnselect,
                    ].join(" ")}
                  >
                    월 단위
                  </span>
                </div>

                {/* check */}
                <div>
                  <MdCheck
                    className={[
                      styles.stuffIcon,
                      dealUnit === "월"
                        ? styles.colorMainGreen
                        : styles.colorIconLightGrey,
                    ].join(" ")}
                  />
                </div>
              </div>

              {/* 년 */}
              <div
                className={styles.stuffChoice}
                onClick={() => {
                  setDealUnit("년");
                }}
              >
                {/* text */}
                <div className={styles.stuffLineName}>
                  <span
                    className={[
                      styles.stuffName,
                      dealUnit === "년"
                        ? styles.colorHighlight1
                        : styles.colorUnselect,
                    ].join(" ")}
                  >
                    년 단위
                  </span>
                </div>

                {/* check */}
                <div>
                  <MdCheck
                    className={[
                      styles.stuffIcon,
                      dealUnit === "년"
                        ? styles.colorMainGreen
                        : styles.colorIconLightGrey,
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 가격 및 수량 */}
          <div className={styles.priceQuantity}>
            {/* 제목 */}
            <div className={styles.textMain}>
              <span className={styles.colorHighlight1}>가격 및 수량</span>
              <span className={styles.colorMainGreen}> *</span>
            </div>

            {/* 선 */}
            <div className={styles.line}></div>

            {/* 입력창 */}
            <div className={styles.priceQuantityPick}>
              {/* 가격 */}
              <div className={styles.price}>
                {/* 제목 */}
                <span className={styles.priceQuantityTitle}>가격</span>

                {/* 단위 */}
                <div className={styles.displayFlex}>
                  <input
                    type="text"
                    name="price"
                    onChange={(e) => {
                      if (
                        e.nativeEvent.data &&
                        isNotNumber(e.nativeEvent.data)
                      ) {
                        e.preventDefault();
                        return null;
                      }
                      changeHandling(e);
                    }}
                    value={price}
                    className={styles.priceInput}
                  />
                  <span className={styles.priceQuantityUnit}>
                    원/{dealUnit}
                  </span>
                </div>
              </div>

              {/* 수량 */}
              <div className={styles.quantity}>
                {/* 제목 */}
                <span className={styles.priceQuantityTitle}>수량</span>

                {/* 단위 */}
                <div className={styles.displayFlex}>
                  <input
                    type="text"
                    name="quantity"
                    onChange={(e) => {
                      if (
                        e.nativeEvent.data &&
                        isNotNumber(e.nativeEvent.data)
                      ) {
                        e.preventDefault();
                        return null;
                      }
                      changeHandling(e);
                    }}
                    value={quantity}
                    className={[styles.priceInput, styles.quantityInput].join(
                      " "
                    )}
                  />
                  <span className={styles.priceQuantityUnit}>개</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 내용 */}
        <div className={styles.detailText}>
          {/* 제목 */}
          <div className={styles.textMain}>
            <span className={styles.colorHighlight1}>상세 내용</span>
            <span className={styles.colorMainGreen}> *</span>
          </div>

          {/* 입력창 */}
          <div className={styles.detailTextFild}>
            <textarea
              type="text"
              name="contents"
              maxLength="499"
              onChange={changeHandling}
              value={contents}
              rows={6}
              placeholder="제품 사용 이력, 제품 사용법, 대여 시 주의점, 가격과 대여기간에 대한 설명 등 제품과 관련된 내용을 자유롭게 작성해주세요.(최대 500자)"
              className={styles.detailTextFildInput}
            />
          </div>
        </div>

        {/* 등록하기 버튼 */}
        <div className={styles.enrollButton}>
          <span className={incorrect ? styles.alertText : styles.displayNone}>
            {alertText}
          </span>

          <div
            className={styles.buttonStyle}
            onClick={() => postClickHandling()}
          >
            등록하기
          </div>
        </div>
      </div>

      {/* foot */}
      <div className={styles.bottomContainer}>
        <div className={styles.backGroundIamgeFoot} />
        <Footer />
      </div>
    </div>
  );
};

export default Post;
