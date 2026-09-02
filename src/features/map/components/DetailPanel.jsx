import React, { useEffect } from "react";
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

const DetailPanel = ({ place, isOpen, onClose, isBookmarked, onBookmark }) => {
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

      <RatingInfo>
        <span>리뷰 {place?.reviewCount || 0}</span>
        <div className="rating-box">
          <FaStar className="star" />
          <span>{place?.avgRating?.toFixed(1) || "0.0"}</span>
        </div>
      </RatingInfo>

      <ImageSlider placeImages={place?.images} />

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
      
      {activeTab === "기본정보" && <BasicInfoTab place={place} />}
      {activeTab === "리뷰" && <ReviewTab place={place} />}
    </PanelContainer>
  );
};

export default DetailPanel;