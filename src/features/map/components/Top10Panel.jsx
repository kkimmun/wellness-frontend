import { FaChevronLeft, FaPhoneAlt } from "react-icons/fa";
import {
  PanelContainer,
  Header,
  ListContainer,
  Top10Card,
  ImageWrapper,
  InfoWrapper,
} from "./Top10Panel.styles";

import { useState, useEffect } from "react";
import { PlaceAPI } from "../../../api/place";

const Top10Panel = ({ isOpen, onClose, onPlaceClick }) => {
  const [top10List, setTop10List] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && top10List.length === 0 && !loading) {
      const fetchTop10 = async () => {
        setLoading(true);
        try {
          const res = await PlaceAPI.getGimpoTop10();
          if (res && res.code === 200 && res.data && res.data.content) {
            setTop10List(res.data.content);
          } else if (res && res.data && Array.isArray(res.data)) {
            // In case the API directly returns an array
            setTop10List(res.data);
          } else if (Array.isArray(res)) {
            setTop10List(res);
          } else {
            setTop10List([]);
          }
        } catch (err) {
          console.error("Top10 API 호출 실패:", err);
          setTop10List([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTop10();
    }
  }, [isOpen, top10List.length, loading]);

  const handlePlaceClick = (place) => {
    // onPlaceClick 사용을 위해 addr 파라미터를 API 응답의 address로 맞춰준다 (하위 호환)
    const placeData = {
      ...place,
      addr: place.address || place.addr,
      phone: place.phoneNumber || place.phone,
    };
    if (onPlaceClick) {
      onPlaceClick(placeData);
    }
  };

  const listToRender = top10List;

  return (
    <PanelContainer $isOpen={isOpen}>
      <Header>
        <button className="close-btn" onClick={onClose}>
          <FaChevronLeft size={20} />
        </button>
        <h2>김포 Top 10</h2>
        <div style={{ width: 30 }} /> {/* 균형을 맞추기 위한 빈 공간 */}
      </Header>

      <ListContainer>
        {loading && <div style={{ padding: "20px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>}
        {!loading && listToRender.map((place, index) => (
          <Top10Card key={place.placeNo} onClick={() => handlePlaceClick(place)}>
            <ImageWrapper>
              <img 
                src={place.imageUrl || place.imgUrl || "https://picsum.photos/id/20/500/500"} 
                alt={place.placeName} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://picsum.photos/id/20/500/500";
                }}
              />
              <div className="rank-badge">{index + 1}</div>
            </ImageWrapper>

            <InfoWrapper>
              <div>
                <div className="title">{place.placeName}</div>
                <div className="address">{place.address || place.addr}</div>
                {place.addrDetail && <div className="address">{place.addrDetail}</div>}
                <div className="phone">
                  <FaPhoneAlt size={10} />
                  {place.phoneNumber || place.phone || "번호없음"}
                </div>
              </div>

              <div className="stats">
                {Number.isFinite(place.reviewCount) && (
                  <div className="stat-item">
                    <span className="review-text">리뷰 {place.reviewCount}</span>
                  </div>
                )}
                {Number.isFinite(place.avgRating) && (
                  <div className="stat-item">
                    <span className="rating-text">⭐ {place.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </InfoWrapper>
          </Top10Card>
        ))}
      </ListContainer>
    </PanelContainer>
  );
};

export default Top10Panel;
