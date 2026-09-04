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
} from "./DetailPanel.styles";
import ReviewTab from "./ReviewTab";
import ImageSlider from "./ImageSlider";
import BasicInfoTab from "./BasicInfoTab";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlaceAPI } from "../../../api/place";

const DetailPanel = ({
  place,
  isOpen,
  onClose,
  isBookmarked,
  onBookmark,
  // 길찾기 기능 연동: 기본정보 탭의 경로찾기 동작을 MapPage까지 전달
  onFindRoute,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (isOpen && place?.placeNo) {
      PlaceAPI.getPlaceDetail(place.placeNo)
        .then((res) => {
          setDetail(res.data || res);
        })
        .catch((err) => console.error("상세 정보 조회 실패", err));
    } else {
      setDetail(null);
    }
  }, [isOpen, place?.placeNo]);

  const displayPlace = detail ? { ...place, ...detail } : place;
  const activeTab = location.pathname.endsWith("/review") ? "리뷰" : "기본정보";

  const handleTabClick = (tab) => {
    if (!displayPlace?.placeNo) return;
    if (tab === "리뷰") {
      navigate(`/place/${displayPlace.placeNo}/review`, { state: location.state, replace: Boolean(location.state?.courseBackground) });
    } else {
      navigate(`/place/${displayPlace.placeNo}`, { state: location.state, replace: Boolean(location.state?.courseBackground) });
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

      {/* DB 지도 핀 연동: 실제 리뷰 집계가 없는 장소에는 0점이라는 가짜 값을 표시하지 않는다. */}
      {(Number.isFinite(displayPlace?.reviewCount) ||
        Number.isFinite(displayPlace?.avgRating)) && (
        <RatingInfo>
          {Number.isFinite(displayPlace?.reviewCount) && (
            <span>리뷰 {displayPlace.reviewCount}</span>
          )}
          {Number.isFinite(displayPlace?.avgRating) && (
            <div className="rating-box">
              <FaStar className="star" />
              <span>{displayPlace.avgRating.toFixed(1)}</span>
            </div>
          )}
        </RatingInfo>
      )}

      {/* DB 지도 핀 연동: 장소가 바뀌면 이미지 선택 상태도 첫 항목으로 초기화한다. */}
      <ImageSlider key={displayPlace?.placeNo} placeImages={displayPlace?.placeImages || displayPlace?.images} />

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
        <BasicInfoTab place={displayPlace} onFindRoute={onFindRoute} />
      )}
      {activeTab === "리뷰" && <ReviewTab place={displayPlace} />}
    </PanelContainer>
  );
};

export default DetailPanel;
