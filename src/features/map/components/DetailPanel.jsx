import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaChevronLeft,
  FaRegClock,
} from "react-icons/fa";
import {
  PanelContainer,
  TopHeader,
  TitleGroup,
  ActionIcons,
  RatingInfo,
  ImageCarousel,
  CarouselItem,
  TabMenu,
  InfoSection,
  InfoRow,
  BottomArea,
} from "./DetailPanel.styles";
import ReviewTab from "./ReviewTab";

import { useNavigate, useLocation } from "react-router-dom";

const DetailPanel = ({ place, isOpen, onClose, isBookmarked, onBookmark }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.endsWith("/review") ? "리뷰" : "기본정보";
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setImgIndex(0);
    }
  }, [isOpen, place]);

  const handleTabClick = (tab) => {
    if (!place?.placeNo) return;
    if (tab === "리뷰") {
      navigate(`/place/${place.placeNo}/review`);
    } else {
      navigate(`/place/${place.placeNo}`);
    }
  };

  const mockImages = [
    { bg: "#FFB300", text: "Image 1" },
    { bg: "#81D4FA", text: "Image 2" },
    { bg: "#FF7043", text: "Image 3" },
    { bg: "#B39DDB", text: "Image 4" },
  ];

  // 실제 데이터가 들어오면 교체되도록 셋팅
  const images = place?.images?.length > 0 ? place.images : mockImages;

  const renderBoxStyle = (item) => {
    if (typeof item === "string") {
      return { backgroundImage: `url(${item})` };
    }
    return {
      backgroundColor: item.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  const renderBoxContent = (item) => {
    if (typeof item !== "string") {
      return (
        <span style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
          {item.text}
        </span>
      );
    }
    return null;
  };

  const getCarouselClass = (idx) => {
    if (idx === imgIndex) return "active";
    if (idx === (imgIndex - 1 + images.length) % images.length) return "prev";
    if (idx === (imgIndex + 1) % images.length) return "next";
    return "hidden";
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

      <RatingInfo>
        <span>리뷰 {place?.reviewCount || 0}</span>
        <div className="rating-box">
          <FaStar className="star" />
          <span>{place?.avgRating?.toFixed(1) || "0.0"}</span>
        </div>
      </RatingInfo>

      <ImageCarousel>
        {images.map((item, idx) => (
          <CarouselItem
            key={idx}
            className={getCarouselClass(idx)}
            style={renderBoxStyle(item)}
            onClick={() => {
              // prev나 next를 클릭했을 때만 해당 인덱스로 이동
              if (getCarouselClass(idx) !== "hidden") {
                setImgIndex(idx);
              }
            }}
          >
            {renderBoxContent(item)}
          </CarouselItem>
        ))}
      </ImageCarousel>

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
        <InfoSection>
          <InfoRow>
            <div className="label-group">
              <FaMapMarkerAlt />
              <span>주소</span>
            </div>
            <div className="value-group">
              <div className="addr-line">
                <span className="type">도로명</span>
                <span>{place?.addr || "-"}</span>
              </div>
              <div className="addr-line">
                <span className="type">지번</span>
                <span>{place?.addrDetail || "-"}</span>
              </div>
            </div>
          </InfoRow>

          <InfoRow>
            <div className="label-group">
              <FaPhoneAlt size={13} />
              <span>전화번호</span>
            </div>
            <div className="value-group">
              <span>{place?.phone || "031-984-2897"}</span>
            </div>
          </InfoRow>

          <InfoRow>
            <div className="label-group">
              <FaRegClock />
              <span>운영시간</span>
            </div>
            <div className="value-group">
              <span>07:00~17:00 (월요일 휴무)</span>
            </div>
          </InfoRow>
        </InfoSection>
      )}

      {activeTab === "리뷰" && <ReviewTab place={place} />}

      {activeTab === "기본정보" && (
        <BottomArea>
          <div className="tags">
            <div className="tag"># 가족동반</div>
            <div className="tag"># 역사문화</div>
          </div>
          <button className="route-btn">경로찾기</button>
        </BottomArea>
      )}
    </PanelContainer>
  );
};

export default DetailPanel;