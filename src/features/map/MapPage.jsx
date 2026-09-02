import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useParams, useNavigate } from "react-router-dom";
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
    setBookmarks((prev) => ({
      ...prev,
      [placeNo]: !prev[placeNo],
    }));
  };

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await PlaceAPI.getPins();
        const dataList = response.data?.content || response.data || [];
        setPins(dataList);
        setFilteredPins(dataList);
      } catch (err) {
        console.error("핀 데이터를 불러오는 데 실패했습니다.", err);
        setPins(mapPinsMockData);
        setFilteredPins(mapPinsMockData);
      }
    };
    fetchPins();
  }, []);

  const { placeNo } = useParams();
  const navigate = useNavigate();

  // URL의 placeNo 변경 감지하여 지도 및 상세 패널 동기화
  useEffect(() => {
    if (pins.length > 0) {
      if (placeNo) {
        const found = pins.find((p) => String(p.placeNo) === String(placeNo));
        if (found) {
          setSelectedPlace(found);
          setIsDetailOpen(true);
          if (mapRef.current) {
            mapRef.current.panTo(
              new window.kakao.maps.LatLng(found.xAxis, found.yAxis),
            );
          }
        } else {
          navigate("/map", { replace: true });
        }
      } else {
        setIsDetailOpen(false);
      }
    }
  }, [placeNo, pins, navigate]);

  const handlePlaceSelect = (place) => {
    navigate(`/place/${place.placeNo}`);
  };

  const handleToggleTags = () => {
    setIsTagsOpen((prev) => !prev);
  };

  const handleMarkerClick = (place) => {
    navigate(`/place/${place.placeNo}`);
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
        onCreate={(map) => {
          map.setMaxLevel(10); // 과도한 축소 방지 (여백 방지)
          map.setMinLevel(2); // 과도한 확대 방지
        }}
        onClick={() => {
          setSelectedPlace(null);
          setIsDetailOpen(false);
          navigate("/map");
        }}
      >
        {filteredPins.map((pin) => (
          <MapMarker
            key={pin.placeNo}
            position={{ lat: pin.xAxis, lng: pin.yAxis }}
            image={{
              src: MARKER_SVG,
              size: { width: 24, height: 24 },
            }}
            onClick={() => handleMarkerClick(pin)}
          />
        ))}

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
                    navigate(`/place/${selectedPlace.placeNo}`);
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
        onClose={() => {
          setIsDetailOpen(false);
          navigate("/map");
        }}
        isBookmarked={selectedPlace ? bookmarks[selectedPlace.placeNo] : false}
        onBookmark={(e) =>
          selectedPlace && toggleBookmark(e, selectedPlace.placeNo)
        }
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
