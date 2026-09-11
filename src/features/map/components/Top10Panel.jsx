import { visibleMapPlaces } from "../utils/placeVisibility";
import useIncrementalPlaces from "../hooks/useIncrementalPlaces";
import PlaceImage from "../../../components/PlaceImage";
import { FaChevronLeft } from "react-icons/fa";
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

const Top10Panel = ({
  isOpen,
  onClose,
  onPlaceClick,
  onPlacesLoaded,
  places,
  placesLoading = false,
  title = "TOP 10",
}) => {
  const [top10List, setTop10List] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasProvidedPlaces = Array.isArray(places);

  useEffect(() => {
    let cancelled = false;
    if (isOpen && !hasProvidedPlaces) {
      const fetchTop10 = async () => {
        setLoading(true);
        try {
          const res = await PlaceAPI.getGimpoTop10();
          if (cancelled) return;
          let places = [];
          if (res && res.code === 200 && res.data && res.data.content) {
            places = res.data.content;
          } else if (res && res.data && Array.isArray(res.data)) {
            // In case the API directly returns an array
            places = res.data;
          } else if (Array.isArray(res)) {
            places = res;
          }
          places = visibleMapPlaces(places);
          setTop10List(places);
          onPlacesLoaded?.(places);
        } catch (err) {
          if (cancelled) return;
          console.error("Top10 API 호출 실패:", err);
          setTop10List([]);
          onPlacesLoaded?.([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      fetchTop10();
    }
    return () => { cancelled = true; };
  }, [isOpen, onPlacesLoaded, hasProvidedPlaces]);

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

  const listToRender = hasProvidedPlaces ? places : top10List;
  const { listRef, onScroll, visiblePlaces, hasMore } = useIncrementalPlaces(listToRender, isOpen);
  const isLoading = hasProvidedPlaces ? placesLoading : loading;

  return (
    <PanelContainer
      $isOpen={isOpen}
      aria-hidden={!isOpen}
      inert={!isOpen ? "" : undefined}
    >
      <Header>
        <button className="close-btn" onClick={onClose}>
          <FaChevronLeft size={20} />
        </button>
        <h2>{title}</h2>
        <div style={{ width: 30 }} /> {/* 균형을 맞추기 위한 빈 공간 */}
      </Header>

      <ListContainer ref={listRef} onScroll={onScroll} role="region" aria-label="장소 목록" tabIndex={0}>
        {isLoading && <div style={{ padding: "20px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>}
        {!isLoading && listToRender.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center" }}>표시할 장소가 없습니다.</div>
        )}
        {!isLoading && visiblePlaces.map((place) => (
          <Top10Card key={place.placeNo} onClick={() => handlePlaceClick(place)}>
            <ImageWrapper>
              <PlaceImage src={place.imageUrl || place.imgUrl} place={place} alt={place.placeName} />
            </ImageWrapper>

            <InfoWrapper>
              <div>
                <div className="title">{place.placeName}</div>
                <div className="address">{place.address || place.addr}</div>
                {place.addrDetail && <div className="address">{place.addrDetail}</div>}
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
        {!isLoading && hasMore && <div style={{ padding: 20, textAlign: "center", color: "#777" }}>스크롤을 내려 더보기</div>}
      </ListContainer>
    </PanelContainer>
  );
};

export default Top10Panel;
