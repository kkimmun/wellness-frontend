import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { PlaceAPI } from "../../api/place";
import SearchPanel from "./components/SearchPanel";
import DetailPanel from "./components/DetailPanel";
import { Modal } from "../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  MapContainer,
  FloatingTags,
  TagList,
  TagButton,
  ToggleButton,
  OverlayCard,
  OverlayTitle,
} from "./MapPage.styles";

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]); // 지도에 표시할 핀 목록
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState({}); // { placeNo: boolean } 북마크 상태 공유용
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const mapRef = useRef(null);

  const { status } = useAuth();

  const toggleBookmark = (e, placeNo) => {
    if (e) e.stopPropagation();
    if (status === "unauthenticated") {
      setAlertMessage("로그인 후 이용해주세요.");
      setIsAlertModalOpen(true);
      return;
    }
    setBookmarks(prev => ({
      ...prev,
      [placeNo]: !prev[placeNo]
    }));
  };

  // 카카오 맵 스크립트 로드 (clusterer 라이브러리 추가)
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["clusterer"],
  });

  // 컴포넌트 마운트 시 핀 데이터 호출
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await PlaceAPI.getPins();
        const dataList = response.data?.content || response.data || [];
        setPins(dataList);
        setFilteredPins(dataList);
      } catch (err) {
        console.error("핀 데이터를 불러오는 데 실패했습니다.", err);
        const testData = [
          { placeNo: 1, placeName: "김포 장릉", xAxis: 37.6125, yAxis: 126.7065, type: "A", avgRating: 4.8, reviewCount: 52, addr: "경기도 김포시 장릉로 79", addrDetail: "풍무동 666-3", phone: "031-984-2897" },
          { placeNo: 2, placeName: "장릉 치유의 숲", xAxis: 37.615, yAxis: 126.71, type: "B", avgRating: 4.2, reviewCount: 15, addr: "경기도 김포시 숲길 12", addrDetail: "관리사무소 옆", phone: "031-123-4567" },
          { placeNo: 3, placeName: "라베니체 마치에비뉴", xAxis: 37.643, yAxis: 126.671, type: "C", avgRating: 4.9, reviewCount: 312, addr: "경기도 김포시 김포한강2로23번길", addrDetail: "장기동 2029-2", phone: "031-999-9999" },
          { placeNo: 4, placeName: "김포아트빌리지", xAxis: 37.658, yAxis: 126.685, type: "A", avgRating: 4.5, reviewCount: 89, addr: "경기도 김포시 모담공원로 170", addrDetail: "운양동 1246-1", phone: "031-888-8888" },
          { placeNo: 5, placeName: "아라마리나", xAxis: 37.596, yAxis: 126.79, type: "B", avgRating: 4.1, reviewCount: 42, addr: "경기도 김포시 고촌읍 아라육로 270", addrDetail: "", phone: "031-777-7777" },
          { placeNo: 6, placeName: "현대프리미엄아울렛", xAxis: 37.6015, yAxis: 126.791, type: "C", avgRating: 4.7, reviewCount: 504, addr: "경기도 김포시 고촌읍 아라육로152번길 100", addrDetail: "", phone: "031-666-6666" },
          { placeNo: 7, placeName: "풍무 중앙공원", xAxis: 37.605, yAxis: 126.718, type: "B", avgRating: 3.8, reviewCount: 7, addr: "경기도 김포시 풍무동 123", addrDetail: "공원 매점 앞", phone: "" },
          { placeNo: 8, placeName: "문수산 산림욕장", xAxis: 37.734, yAxis: 126.544, type: "A", avgRating: 4.6, reviewCount: 128, addr: "경기도 김포시 월곶면 성동리 산35-1", addrDetail: "", phone: "031-555-5555" },
        ];
        setPins(testData);
        setFilteredPins(testData);
      }
    };
    fetchPins();
  }, []);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setIsDetailOpen(true); // 검색 결과 클릭 시 슬라이드 패널 열림
    if (mapRef.current) {
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.xAxis, place.yAxis));
    }
  };

  const handleToggleTags = () => {
    setIsTagsOpen((prev) => !prev);
  };

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    // 마커 클릭 시에는 슬라이드 패널을 열지 않음 (말풍선만 표시)
  };

  if (loading) return <div>지도를 불러오는 중입니다...</div>;
  if (error)
    return (
      <div>
        지도를 불러오는 데 실패했습니다. 카카오 앱 키 설정을 확인해주세요.
      </div>
    );

  return (
    <MapContainer>
      <SearchPanel 
        pins={pins} 
        onPlaceSelect={handlePlaceSelect} 
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        isVisible={!isDetailOpen}
        onSearchResults={setFilteredPins}
      />

      <FloatingTags>
        <TagList $isOpen={isTagsOpen}>
          <TagButton onClick={() => alert("#템플스테이 검색")}>
            # 템플스테이
          </TagButton>
          <TagButton onClick={() => alert("#가족동반 검색")}>
            # 가족동반
          </TagButton>
          <TagButton onClick={() => alert("#반려동물 검색")}>
            # 반려동물
          </TagButton>
        </TagList>

        <ToggleButton onClick={handleToggleTags}>
          {isTagsOpen ? (
            <FaChevronRight size={21} style={{ transform: "rotate(180deg)" }} />
          ) : (
            <FaChevronRight size={21} />
          )}
        </ToggleButton>
      </FloatingTags>

      <Map
        center={{ lat: 37.6105, lng: 126.7056 }}
        style={{ width: "100%", height: "100%" }}
        level={5}
        ref={mapRef}
        onClick={() => {
          setSelectedPlace(null);
          setIsDetailOpen(false); // 지도 빈 공간 클릭 시 슬라이드 패널도 닫기
        }}
      >
        <MarkerClusterer averageCenter={true} minLevel={10}>
          {filteredPins.map((pin) => (
            <MapMarker
              key={pin.placeNo}
              position={{ lat: pin.xAxis, lng: pin.yAxis }}
              image={{
                src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23FF7043' stroke='white' stroke-width='2'/%3E%3C/svg%3E",
                size: { width: 24, height: 24 },
              }}
              onClick={() => handleMarkerClick(pin)}
            />
          ))}
        </MarkerClusterer>

        {selectedPlace && (
          <CustomOverlayMap
            position={{ lat: selectedPlace.xAxis, lng: selectedPlace.yAxis }}
            yAnchor={1}
            clickable={true}
          >
            <OverlayCard>
              {/* 상단: 장소명 및 출발/도착 버튼 */}
              <div className="header-row">
                <OverlayTitle>{selectedPlace.placeName}</OverlayTitle>
                <div className="action-buttons">
                  <button
                    className="btn-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("출발지 설정");
                    }}
                  >
                    출발
                  </button>
                  <button
                    className="btn-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("도착지 설정");
                    }}
                  >
                    도착
                  </button>
                </div>
              </div>

              {/* 중단: 리뷰, 평점, 상세보기 */}
              <div className="sub-row">
                <span className="review-count">
                  리뷰 {selectedPlace.reviewCount}
                </span>
                <span className="rating">
                  <span className="star">⭐</span>{" "}
                  {selectedPlace.avgRating.toFixed(1)}
                </span>
                <span
                  className="detail-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailOpen(true);
                  }}
                >
                  상세보기
                </span>
              </div>

              {/* 하단: 주소 정보 */}
              <div className="addr-row">
                <div className="addr-item">
                  <span className="addr-label">도로명</span>
                  <span className="addr-value">{selectedPlace.addr}</span>
                </div>
                {selectedPlace.addrDetail && (
                  <div className="addr-item">
                    <span className="addr-label">지번</span>
                    <span className="addr-value">
                      {selectedPlace.addrDetail}
                    </span>
                  </div>
                )}
              </div>
            </OverlayCard>
          </CustomOverlayMap>
        )}
      </Map>

      <DetailPanel 
        place={selectedPlace} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)}
        isBookmarked={selectedPlace ? bookmarks[selectedPlace.placeNo] : false}
        onBookmark={(e) => selectedPlace && toggleBookmark(e, selectedPlace.placeNo)}
      />

      <Modal
        isOpen={isAlertModalOpen}
        icon={FiAlertCircle}
        iconColor="primary"
        showClose={true}
        message={alertMessage}
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </MapContainer>
  );
};

export default MapPage;
