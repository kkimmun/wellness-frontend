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

  // 장소 상세 개선: MapPage가 조회해 합친 상세 데이터를 사용해 동일 API의 중복 요청을 막는다.
  const displayPlace = place;
  // S3 장소 이미지 연동: 상세 API가 없거나 실패해도 지도 핀에 포함된 대표 이미지를 표시한다.
  const displayImages =
    displayPlace?.placeImages ||
    displayPlace?.images ||
    (displayPlace?.imageUrl ? [displayPlace.imageUrl] : []);
  const activeTab = location.pathname.endsWith("/review") ? "리뷰" : "기본정보";

  const handleTabClick = (tab) => {
    if (!displayPlace?.placeNo) return;
    if (tab === "리뷰") {
      navigate(`/place/${displayPlace.placeNo}/review`);
    } else {
      navigate(`/place/${displayPlace.placeNo}`);
    }
  };

  return (
    <PanelContainer $isOpen={isOpen}>
      <TopHeader>
        <TitleGroup>
          <button className="back-btn" onClick={onClose}>
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
      <ImageSlider
        key={displayPlace?.placeNo}
        placeImages={displayImages}
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
        <BasicInfoTab place={displayPlace} onFindRoute={onFindRoute} />
      )}
      {activeTab === "리뷰" && <ReviewTab place={displayPlace} />}
    </PanelContainer>
  );
};

export default DetailPanel;
