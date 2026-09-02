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

  const activeTab = location.pathname.endsWith("/review") ? "리뷰" : "기본정보";

  const handleTabClick = (tab) => {
    if (!place?.placeNo) return;
    if (tab === "리뷰") {
      navigate(`/place/${place.placeNo}/review`);
    } else {
      navigate(`/place/${place.placeNo}`);
    }
  };

  return (
    <PanelContainer $isOpen={isOpen}>
      <TopHeader>
        <TitleGroup>
          <button className="back-btn" onClick={onClose}>
            <FaChevronLeft />
          </button>
          <h2>{place?.placeName || "이름 없음"}</h2>
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
      {(Number.isFinite(place?.reviewCount) ||
        Number.isFinite(place?.avgRating)) && (
        <RatingInfo>
          {Number.isFinite(place?.reviewCount) && (
            <span>리뷰 {place.reviewCount}</span>
          )}
          {Number.isFinite(place?.avgRating) && (
            <div className="rating-box">
              <FaStar className="star" />
              <span>{place.avgRating.toFixed(1)}</span>
            </div>
          )}
        </RatingInfo>
      )}

      {/* DB 지도 핀 연동: 장소가 바뀌면 이미지 선택 상태도 첫 항목으로 초기화한다. */}
      <ImageSlider key={place?.placeNo} placeImages={place?.images} />

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
        <BasicInfoTab place={place} onFindRoute={onFindRoute} />
      )}
      {activeTab === "리뷰" && <ReviewTab place={place} />}
    </PanelContainer>
  );
};

export default DetailPanel;
