import {
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaChevronLeft,
  FaStar,
} from "react-icons/fa";
import {
  PanelContainer,
  TopHeader,
  TitleGroup,
  ActionIcons,
  RatingInfo,
  TabMenu,
  ImageLicenseCard,
} from "./DetailPanel.styles";
import ReviewTab from "./ReviewTab";
import ImageSlider from "./ImageSlider";
import BasicInfoTab from "./BasicInfoTab";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DetailPanel = ({
  place,
  isOpen,
  onClose,
  isBookmarked,
  onBookmark,
  // 길찾기 기능 연동: 기본정보 탭의 경로찾기 동작을 MapPage까지 전달
  onFindRoute,
  // 계획 모드에서는 같은 상세 패널의 기본 동작을 "계획에 추가"로 재사용한다.
  primaryActionLabel = "경로찾기",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 장소 상세 개선: MapPage가 조회해 합친 상세 데이터를 사용해 동일 API의 중복 요청을 막는다.
  const displayPlace = place;
  // S3 장소 이미지 연동: 상세 API가 없거나 실패해도 지도 핀에 포함된 대표 이미지를 표시한다.
  const displayImages =
    displayPlace?.placeImages ||
    displayPlace?.images ||
    (displayPlace?.imageUrl ? [displayPlace.imageUrl] : []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = displayImages[activeImageIndex];
  const activeLicense =
    activeImage && typeof activeImage !== "string"
      ? activeImage.license
      : null;
  const activeTab = location.pathname.endsWith("/review") ? "리뷰" : "기본정보";

  useEffect(() => {
    setActiveImageIndex(0);
  }, [displayPlace?.placeNo]);

  const handleTabClick = (tab) => {
    if (!displayPlace?.placeNo) return;
    const basePath = location.pathname.startsWith("/gimpoTop10") ? "/gimpoTop10" : "/place";
    if (tab === "리뷰") {

      navigate(`${basePath}/${displayPlace.placeNo}/review`);
    } else {
      navigate(`${basePath}/${displayPlace.placeNo}`);

    }
  };

  return (
    <PanelContainer $isOpen={isOpen}>
      <TopHeader>
        <TitleGroup>
          <button className="back-btn" onClick={onClose} aria-label={location.state?.courseBackground ? "보던 음식점 목록으로 돌아가기" : "지도 화면으로 돌아가기"}>
            <FaChevronLeft />
          </button>
          <h2>{displayPlace?.placeName || "이름 없음"}</h2>
        </TitleGroup>

        <ActionIcons>
          <button className="icon-circle">
            <FaShareAlt size={16} />
          </button>
          <button className="icon-circle" onClick={onBookmark}>
            {isBookmarked ? (
              <FaBookmark size={15} color="#C9A227" />
            ) : (
              <FaRegBookmark size={15} />
            )}
          </button>
        </ActionIcons>
      </TopHeader>

      {/* 리뷰 집계가 null이거나 없을 경우 무조건 0으로 표시되도록 수정 */}
      <RatingInfo>
        <span>리뷰 {displayPlace?.reviewCount ?? 0}</span>
        <div className="rating-box">
          <FaStar className="star" />
          <span>{(displayPlace?.avgRating ?? 0).toFixed(1)}</span>
        </div>
      </RatingInfo>

      {/* DB 지도 핀 연동: 장소가 바뀌면 이미지 선택 상태도 첫 항목으로 초기화한다. */}
      <ImageSlider
        key={displayPlace?.placeNo}
        placeImages={displayImages}
        imgIndex={activeImageIndex}
        onImageChange={setActiveImageIndex}
      />

      <TabMenu>
        <div
          className={`tab ${activeTab === "기본정보" ? "active" : ""}`}
          onClick={() => handleTabClick("기본정보")}
        >
          기본정보
        </div>
        <div
          className={`tab ${activeTab === "리뷰" ? "active" : ""}`}
          onClick={() => handleTabClick("리뷰")}
        >
          리뷰
        </div>
      </TabMenu>
      
      {activeTab === "기본정보" && (
        <BasicInfoTab
          place={displayPlace}
          onFindRoute={onFindRoute}
          actionLabel={primaryActionLabel}
        />
      )}
      {activeTab === "리뷰" && <ReviewTab place={displayPlace} />}

      {activeLicense && (
        <ImageLicenseCard aria-label="현재 사진 출처 및 라이선스">
          <div className="source-line">
            <strong>사진 출처</strong>
            {activeLicense.sourcePageUrl ? (
              <a
                href={activeLicense.sourcePageUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {activeLicense.sourceName}
              </a>
            ) : (
              <span>{activeLicense.sourceName}</span>
            )}
            <span aria-hidden="true">·</span>
            {activeLicense.licenseUrl ? (
              <a
                href={activeLicense.licenseUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {activeLicense.licenseCode}
              </a>
            ) : (
              <span>{activeLicense.licenseCode}</span>
            )}
          </div>
          <small>{activeLicense.attributionText}</small>
        </ImageLicenseCard>
      )}
    </PanelContainer>
  );
};

export default DetailPanel;
