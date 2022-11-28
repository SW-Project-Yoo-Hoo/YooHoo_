import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./editProfile.module.css";
import { MdPhotoCamera } from "react-icons/md";

const EditProfile = ({ changeInfo }) => {
  const [inputs, setInputs] = useState({
    companyName: "",
    adress: "",
    phone: "",
  });

  /* 백엔드에서 물품 리스트 가져오기 */
  useEffect(() => {
    const getInfo = () => {
      axios
        .get("/members/my/myInfo")
        .then((res) => {
          setInputs(res.data.data);
        })
        .catch((error) => console.log(error));
    };

    getInfo();
  }, []);

  const { companyName, adress, phone } = inputs;

  const changeHandling = (e) => {
    const { value, name } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  useEffect(() => {
    changeInfo(inputs);
  }, [inputs]);

  //이미지
  const [showImages, setShowImages] = useState([]);

  //백엔드로 전송할 이미지
  const [uploadFile, setUploadFile] = useState([]);

  useEffect(() => {
    setInputs({
      ...inputs,
      photo: uploadFile,
    });
  }, [showImages]);

  // 이미지 상대경로 저장
  const imageAddHandling = (e) => {
    const imageLists = e.target.files;
    let imageUrlLists = [...showImages];
    let imageUrlListsOrigin = [...uploadFile];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
      imageUrlListsOrigin.push(imageLists[i]);
    }

    if (imageUrlLists.length > 1) {
      imageUrlLists = imageUrlLists.slice(1, 2);
    }

    setShowImages(imageUrlLists);
    setUploadFile(imageUrlListsOrigin.reverse());
  };

  const onChangeImg = (e) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files;
      console.log(uploadFile);
    }
  };

  return (
    <div className={styles.container}>
      {/* 프로필 사진 선택 */}
      <div className={styles.photo}>
        {/* 이미지 미리보기 */}
        <div className={styles.showPhoto}>
          {showImages.length !== 0 ? (
            showImages.map((image, id) => (
              <div key={id}>
                {/* 이미지 미리보기 */}
                <img
                  className={styles.showPhoto}
                  src={process.env.PUBLIC_URL + image}
                  alt={`${image}-${id}`}
                />
              </div>
            ))
          ) : inputs.photo_dir === "" ? (
            <img
              className={styles.showPhoto}
              src={process.env.PUBLIC_URL + "images/userProfileBasic.svg"}
              alt="Company"
            />
          ) : inputs.photo_dir === undefined ? (
            <div className={styles.showPhoto}></div>
          ) : (
            <img
              className={styles.showPhoto}
              src={process.env.PUBLIC_URL + "productList/" + inputs.photo_dir}
              alt="회원 프로필 사진"
            />
          )}
        </div>

        {/* 이미지 선택 */}
        <label className={styles.photoButton} onChange={imageAddHandling}>
          <MdPhotoCamera className={styles.photoButtonIcon} />
          <input
            type="file"
            id="imgFile"
            accept="image/*"
            className={styles.displayNone}
            onChange={onChangeImg}
          />
        </label>
      </div>

      {/* 정보 입력 */}
      <div className={styles.editInfo}>
        {/* 회사명 */}
        <div className={styles.editInfoColumn}>
          <span className={styles.title}>회사명</span>
          <input
            type="text"
            name="companyName"
            onChange={changeHandling}
            value={companyName || ""}
            placeholder={inputs.company}
            className={styles.input}
          />
        </div>

        {/* 회사주소 */}
        <div className={styles.editInfoColumn}>
          <span className={styles.title}>회사 주소</span>
          <input
            type="text"
            name="adress"
            onChange={changeHandling}
            value={adress || ""}
            placeholder={inputs.address}
            className={styles.input}
          />
        </div>

        {/* 전화번호 */}
        <div className={styles.editInfoColumn}>
          <span className={styles.title}>연락처</span>
          <input
            type="text"
            name="phone"
            onChange={changeHandling}
            value={phone || ""}
            placeholder={inputs.contact}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
