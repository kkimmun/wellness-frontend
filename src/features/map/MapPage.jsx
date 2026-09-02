import { useState, useEffect, useMemo, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  Map,
  MapMarker,
  Polyline,
  CustomOverlayMap,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useParams, useNavigate } from "react-router-dom";
import { PlaceAPI } from "../../api/place";
import SearchPanel from "./components/SearchPanel";
import DetailPanel from "./components/DetailPanel";
import RoutePanel from "./components/RoutePanel";
import { Modal } from "../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  MapContainer,
  FloatingTags,
  LegendLine,
  RouteLegend,
  TagList,
  TagButton,
  ToggleButton,
  OverlayCard,
  OverlayTitle,
} from "./MapPage.styles";
import {
  getRouteSegmentStyle,
  ROUTE_SEGMENT_COLORS,
  ROUTE_SEGMENT_LEGEND,
} from "./routeSegmentStyles";

const MARKER_SVG = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23FF7043' stroke='white' stroke-width='2'/%3E%3C/svg%3E";

// 길찾기 기능 연동: 기존 지도 장소 객체를 길찾기 패널이 사용하는 DB 장소 형식으로 변환한다.
const toRoutePlace = (place) =>
  place
    ? {
        placeNo: place.placeNo,
        placeName: place.placeName,
        address: place.addr || place.address,
        X_AXIS: place.xAxis,
        Y_AXIS: place.yAxis,
      }
    : null;

// 길찾기 기능 연동: 백엔드의 X_AXIS(경도), Y_AXIS(위도)를 카카오 지도 좌표로 변환한다.
const toMapPath = (path = []) =>
  path
    .map((coordinate) => ({
      lat: Number(coordinate.Y_AXIS ?? coordinate.yAxis),
      lng: Number(coordinate.X_AXIS ?? coordinate.xAxis),
    }))
    .filter(
      (coordinate) =>
        Number.isFinite(coordinate.lat) && Number.isFinite(coordinate.lng),
    );

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]); // 지도에 표시할 핀 목록
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState({}); // { placeNo: boolean } 북마크 상태 공유용
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // 길찾기 기능 연동: 패널의 출발지·도착지와 지도에 표시할 선택 경로를 관리한다.
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
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
        // DB 지도 핀 연동: API가 반환한 PLACE 목록만 사용하고 목업 데이터로 대체하지 않는다.
        const dataList = Array.isArray(response)
          ? response
          : response?.content || [];
        const validPins = dataList.filter(
          (place) =>
            Number.isFinite(Number(place.xAxis)) &&
            Number.isFinite(Number(place.yAxis)),
        );
        setPins(validPins);
        setFilteredPins(validPins);
      } catch (err) {
        console.error("핀 데이터를 불러오는 데 실패했습니다.", err);
        // DB 지도 핀 연동: 조회 실패를 가짜 장소로 숨기지 않고 사용자에게 알린다.
        setPins([]);
        setFilteredPins([]);
        setAlertMessage("DB 장소 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        setIsAlertModalOpen(true);
      }
    };
    fetchPins();
  }, []);

  const { placeNo } = useParams();
  const navigate = useNavigate();

  // 기존 코드 개선: URL을 단일 기준으로 사용해 상세 장소 상태의 중복 저장을 제거한다.
  const selectedPlace = useMemo(
    () =>
      placeNo
        ? pins.find((pin) => String(pin.placeNo) === String(placeNo)) || null
        : null,
    [placeNo, pins],
  );
  const isDetailOpen = Boolean(placeNo && selectedPlace);

  // 기존 코드 개선: effect에서는 URL 상태를 다시 저장하지 않고 지도 이동만 수행한다.
  useEffect(() => {
    if (!placeNo || pins.length === 0) return;

    if (!selectedPlace) {
      navigate("/map", { replace: true });
      return;
    }

    if (mapRef.current) {
      mapRef.current.panTo(
        new window.kakao.maps.LatLng(
          selectedPlace.yAxis,
          selectedPlace.xAxis,
        ),
      );
    }
  }, [placeNo, pins.length, selectedPlace, navigate]);

  const handlePlaceSelect = (place) => {
    navigate(`/place/${place.placeNo}`);
  };

  const handleToggleTags = () => {
    setIsTagsOpen((prev) => !prev);
  };

  const handleMarkerClick = (place) => {
    navigate(`/place/${place.placeNo}`);
  };

  // 길찾기 기능 연동: 지도/검색/상세 화면에서 선택한 장소를 패널에 전달한다.
  const openRouteWithOrigin = (place) => {
    setRouteOrigin(toRoutePlace(place));
    setIsRouteOpen(true);
    navigate("/map");
  };

  const openRouteWithDestination = (place) => {
    setRouteDestination(toRoutePlace(place));
    setIsRouteOpen(true);
    navigate("/map");
  };

  // 길찾기 기능 연동: 선택된 경로를 지도에 그린 뒤 경로 전체가 보이도록 범위를 맞춘다.
  const handleRouteSelect = (route, routeResponse) => {
    // 대중교통 경로 색상: 이동수단 정보를 선택 경로에 보존해 지도 표시 방식을 결정한다.
    setSelectedRoute(
      route
        ? { ...route, transportType: routeResponse?.transportType }
        : null,
    );
    const mapPath = toMapPath(route?.path);

    if (!mapRef.current || mapPath.length === 0 || !window.kakao?.maps) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    mapPath.forEach(({ lat, lng }) => {
      bounds.extend(new window.kakao.maps.LatLng(lat, lng));
    });
    mapRef.current.setBounds(bounds, 50, 50, 50, 590);
  };

  const closeRoutePanel = () => {
    setIsRouteOpen(false);
    setSelectedRoute(null);
  };

  const selectedMapPath = toMapPath(selectedRoute?.path);
  // 대중교통 경로 색상: 단계별 path를 유지해 도보·버스·지하철을 각각 다른 선으로 그린다.
  const selectedMapSegments = useMemo(() => {
    if (selectedRoute?.transportType !== "PUBLIC_TRANSIT") return [];

    return (selectedRoute.mapSteps || selectedRoute.steps || [])
      .map((step, index) => ({
        key: `${step.type || "segment"}-${index}`,
        path: toMapPath(step.path),
        ...getRouteSegmentStyle(step),
      }))
      .filter((segment) => segment.path.length > 1);
  }, [selectedRoute]);
  const isWalkingRoute = selectedRoute?.transportType === "WALK";

  if (loading) return <div>지도를 불러오는 중입니다...</div>;
  if (error)
    return (
      <div>
        지도를 불러오는 데 실패했습니다. 카카오 앱 키 설정을 확인해주세요.
      </div>
    );

  return (
    <MapContainer>
      {/* 길찾기 기능 연동: 검색 목록의 출발/도착 버튼을 실제 패널과 연결한다. */}
      <SearchPanel
        pins={pins}
        onPlaceSelect={handlePlaceSelect}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        isVisible={!isDetailOpen && !isRouteOpen}
        onSearchResults={setFilteredPins}
        onSetOrigin={openRouteWithOrigin}
        onSetDestination={openRouteWithDestination}
      />

      {/* 길찾기 기능 연동: 지도 위 독립 패널에서 입력·검색·결과 선택을 처리한다. */}
      <RoutePanel
        key={`route-${routeOrigin?.placeNo || "coordinate"}-${routeDestination?.placeNo || "coordinate"}`}
        isOpen={isRouteOpen}
        initialOrigin={routeOrigin}
        initialDestination={routeDestination}
        onClose={closeRoutePanel}
        onRouteSelect={handleRouteSelect}
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
        onCreate={(map) => {
          // 길찾기 기능 연동: 경로 범위 조정을 위해 실제 Kakao Map 인스턴스를 보관한다.
          mapRef.current = map;
          map.setMaxLevel(10); // 과도한 축소 방지 (여백 방지)
          map.setMinLevel(2); // 과도한 확대 방지
        }}
        onClick={() => {
          navigate("/map");
        }}
      >
        {filteredPins.map((pin) => (
          // DB 지도 핀 연동: X_AXIS는 경도(lng), Y_AXIS는 위도(lat)로 사용한다.
          <MapMarker
            key={pin.placeNo}
            position={{ lat: pin.yAxis, lng: pin.xAxis }}
            image={{
              src: MARKER_SVG,
              size: { width: 24, height: 24 },
            }}
            onClick={() => handleMarkerClick(pin)}
          />
        ))}

        {/* 대중교통 경로 색상: 대중교통은 이동 단계별 색상과 도보 점선으로 표시한다. */}
        {selectedMapSegments.map((segment) => (
          <Polyline
            key={segment.key}
            path={segment.path}
            strokeWeight={7}
            strokeColor={segment.color}
            strokeOpacity={0.9}
            strokeStyle={segment.strokeStyle}
          />
        ))}

        {/* 길찾기 기능 연동: 단일 이동수단 또는 단계 path가 없는 응답은 전체 경로를 표시한다. */}
        {selectedMapSegments.length === 0 && selectedMapPath.length > 1 && (
          <Polyline
            path={selectedMapPath}
            strokeWeight={7}
            strokeColor={
              isWalkingRoute
                ? ROUTE_SEGMENT_COLORS.WALKING
                : ROUTE_SEGMENT_COLORS.GENERAL_BUS
            }
            strokeOpacity={0.9}
            strokeStyle={isWalkingRoute ? "shortdash" : "solid"}
          />
        )}

        {selectedPlace && (
          <CustomOverlayMap
            position={{ lat: selectedPlace.yAxis, lng: selectedPlace.xAxis }}
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
                      // 길찾기 기능 연동: 기존 임시 alert를 출발지 설정으로 교체한다.
                      openRouteWithOrigin(selectedPlace);
                    }}
                  >
                    출발
                  </button>
                  <button
                    className="btn-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 길찾기 기능 연동: 기존 임시 alert를 도착지 설정으로 교체한다.
                      openRouteWithDestination(selectedPlace);
                    }}
                  >
                    도착
                  </button>
                </div>
              </div>

              {/* 중단: 리뷰, 평점, 상세보기 */}
              <div className="sub-row">
                {/* DB 지도 핀 연동: 조회되지 않은 리뷰 값을 임의의 숫자로 표시하지 않는다. */}
                {Number.isFinite(selectedPlace.reviewCount) && (
                  <span className="review-count">
                    리뷰 {selectedPlace.reviewCount}
                  </span>
                )}
                {Number.isFinite(selectedPlace.avgRating) && (
                  <span className="rating">
                    <span className="star">⭐</span>{" "}
                    {selectedPlace.avgRating.toFixed(1)}
                  </span>
                )}
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

      {/* 대중교통 경로 색상: 지도 선의 의미를 사용자가 바로 확인할 수 있는 범례다. */}
      {selectedRoute?.transportType === "PUBLIC_TRANSIT" && (
        <RouteLegend aria-label="대중교통 경로 색상 범례">
          {ROUTE_SEGMENT_LEGEND.map((item) => (
            <span key={item.key}>
              <LegendLine $color={item.color} $dashed={item.dashed} />
              {item.label}
            </span>
          ))}
        </RouteLegend>
      )}

      {/* 길찾기 기능 연동: 상세 패널의 경로찾기는 현재 장소를 도착지로 설정한다. */}
      <DetailPanel
        place={selectedPlace}
        isOpen={isDetailOpen && !isRouteOpen}
        onClose={() => {
          navigate("/map");
        }}
        isBookmarked={selectedPlace ? bookmarks[selectedPlace.placeNo] : false}
        onBookmark={(e) =>
          selectedPlace && toggleBookmark(e, selectedPlace.placeNo)
        }
        onFindRoute={openRouteWithDestination}
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
