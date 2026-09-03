import { useState, useEffect, useMemo, useRef } from "react";
import { FaChevronRight, FaRoute } from "react-icons/fa";
import {
  Map,
  MapMarker,
  Polyline,
  CustomOverlayMap,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlaceAPI } from "../../api/place";
import SearchPanel from "./components/SearchPanel";
import DetailPanel from "./components/DetailPanel";
import FixedCoursePanel from "../courses/components/FixedCoursePanel";
import FixedCourseDetail from "../courses/components/FixedCourseDetail";
import UserCourseFlow from "../courses/components/UserCourseFlow";
import { getCourseRoute, isCoursePoint } from "../courses/utils/userCourseStorage";
import RoutePanel from "./components/RoutePanel";
import Top10Panel from "./components/Top10Panel";
import { Top10Marker, GeneralMarker } from "./components/CustomMarkers";
import { Modal } from "../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  MapContainer,
  FloatingTags,
  MapStatus,
  LegendLine,
  RouteLegend,
  RouteReopenButton,
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

const MARKER_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72">
  <path d="M 32 70 L 20 52 A 28 28 0 1 1 44 52 Z" fill="#8b5cf6" stroke="white" stroke-width="2"/>
  <g transform="translate(16, 12) scale(0.06)">
    <path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z" fill="white"/>
  </g>
</svg>
`)}`;

const MARKER_GOLD_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72">
  <path d="M 32 70 L 20 52 A 28 28 0 1 1 44 52 Z" fill="#f59e0b" stroke="white" stroke-width="3"/>
  <g transform="translate(18, 12) scale(0.07)">
    <path d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z" fill="white"/>
  </g>
</svg>
`)}`;

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

// 길찾기 표시 안정화: 전체 path와 단계별 path를 모두 범위 계산에 포함해 일부 구간이 잘리지 않게 한다.
const getRouteMapPoints = (route) => {
  if (!route) return [];

  const fullPath = toMapPath(route.path);
  const stepPaths = (route.mapSteps || route.steps || []).flatMap((step) =>
    toMapPath(step.path),
  );

  return [...fullPath, ...stepPaths];
};

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [pinsState, setPinsState] = useState("loading");
  const [filteredPins, setFilteredPins] = useState([]); // 지도에 표시할 핀 목록
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState({}); // { placeNo: boolean } 북마크 상태 공유용
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // 길찾기 기능 연동: 패널의 출발지·도착지와 지도에 표시할 선택 경로를 관리한다.
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [generalRoute, setSelectedRoute] = useState(null);
  const [customRoute, setCustomRoute] = useState(null);
  const [fixedCourseMap, setFixedCourseMap] = useState(null);
  // 코드 리뷰 반영: placeNo가 없는 좌표 장소도 외부 입력이 바뀔 때 RoutePanel을 새 입력으로 초기화한다.
  const [routeInputRevision, setRouteInputRevision] = useState(0);
  // 길찾기 표시 안정화: 경로가 바뀔 때 Kakao Polyline을 새 인스턴스로 교체하기 위한 번호다.
  const [routeRenderRevision, setRouteRenderRevision] = useState(0);
  const mapRef = useRef(null);
  const [mapLevel, setMapLevel] = useState(5);

  const [top10OverlayState, setTop10Overlay] = useState(null); // { ...place, xAxis, yAxis }
  const [top10OverlayDetail, setTop10OverlayDetail] = useState(null);

  useEffect(() => {
    if (top10OverlayState && !top10OverlayState.isExternal && top10OverlayState.placeNo) {
      PlaceAPI.getPlaceDetail(top10OverlayState.placeNo)
        .then((res) => setTop10OverlayDetail(res.data || res))
        .catch((err) => console.error("Top10 상세 정보 조회 실패", err));
    } else {
      setTop10OverlayDetail(null);
    }
  }, [top10OverlayState?.placeNo, top10OverlayState?.isExternal]);

  const top10Overlay = useMemo(() => {
    return top10OverlayState ? { ...top10OverlayState, ...top10OverlayDetail } : null;
  }, [top10OverlayState, top10OverlayDetail]);
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
    libraries: ["services", "clusterer"],
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
        setPinsState("success");
      } catch (err) {
        console.error("핀 데이터를 불러오는 데 실패했습니다.", err);
        // DB 지도 핀 연동: 조회 실패를 가짜 장소로 숨기지 않고 사용자에게 알린다.
        setPins([]);
        setFilteredPins([]);
        setPinsState("error");
        setAlertMessage(
          "장소 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
        setIsAlertModalOpen(true);
      }
    };
    fetchPins();
  }, []);

  const { placeNo, courseNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isFixedCourseView = location.pathname.startsWith("/pilgrim/fixed");
  const isCustomCourseView = location.pathname === "/pilgrim/create";
  const isFixedCourseDetail = isFixedCourseView && Boolean(courseNo);
  const isCourseMapView = isCustomCourseView || isFixedCourseDetail;
  // 현재 URL의 요청 결과만 사용해 다른 코스를 열 때 이전 경로가 남지 않게 한다.
  const courseRouteData = isFixedCourseDetail
    ? fixedCourseMap?.key === location.key ? fixedCourseMap.routeData : null
    : customRoute;
  const selectedRoute = useMemo(() => {
    if (!isCourseMapView) return generalRoute;
    const route = getCourseRoute(courseRouteData);
    return route ? { ...route, transportType: courseRouteData.transportType } : null;
  }, [isCourseMapView, generalRoute, courseRouteData]);
  const coursePins = isCourseMapView && courseRouteData
    ? [courseRouteData.origin, ...(courseRouteData.waypoints || []), courseRouteData.destination].filter(isCoursePoint)
    : [];

  const baseSelectedPlace = useMemo(
    () =>
      placeNo
        ? pins.find((pin) => String(pin.placeNo) === String(placeNo)) || null
        : null,
    [placeNo, pins],
  );

  const [overlayDetail, setOverlayDetail] = useState(null);

  useEffect(() => {
    if (baseSelectedPlace?.placeNo) {
      PlaceAPI.getPlaceDetail(baseSelectedPlace.placeNo)
        .then((res) => setOverlayDetail(res.data || res))
        .catch((err) => console.error("오버레이 상세 정보 조회 실패", err));
    } else {
      setOverlayDetail(null);
    }
  }, [baseSelectedPlace?.placeNo]);

  const selectedPlace = useMemo(() => {
    return baseSelectedPlace ? { ...baseSelectedPlace, ...overlayDetail } : null;
  }, [baseSelectedPlace, overlayDetail]);

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
        new window.kakao.maps.LatLng(selectedPlace.yAxis, selectedPlace.xAxis),
      );
    }
  }, [placeNo, pins.length, selectedPlace, navigate]);

  const handleTop10PlaceSelect = (place) => {
    // 1. 이미 지도에 있는 핀인지 placeNo로 확실히 확인
    const existingPin = pins.find(p => String(p.placeNo) === String(place.placeNo));
    if (existingPin) {
      setTop10Overlay({ ...existingPin, isExternal: false });
      if (mapRef.current) {
        mapRef.current.panTo(new window.kakao.maps.LatLng(existingPin.yAxis, existingPin.xAxis));
      }
    } else {
      // 2. 핀에 없으면 카카오 주소 검색으로 좌표 가져오기
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(place.addr, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            const geocodedPlace = { ...place, yAxis: lat, xAxis: lng, isExternal: true };
            setTop10Overlay(geocodedPlace);
            if (mapRef.current) {
              mapRef.current.panTo(new window.kakao.maps.LatLng(lat, lng));
            }
          }
        });
      }
    }
  };

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
    setSelectedRoute(null);
    setRouteInputRevision((current) => current + 1);
    setRouteRenderRevision((current) => current + 1);
    setIsRouteOpen(true);
    navigate("/map");
  };

  const openRouteWithDestination = (place) => {
    setRouteDestination(toRoutePlace(place));
    setSelectedRoute(null);
    setRouteInputRevision((current) => current + 1);
    setRouteRenderRevision((current) => current + 1);
    setIsRouteOpen(true);
    navigate("/map");
  };

  // 길찾기 표시 안정화: 새 경로마다 렌더링 번호를 변경해 이전 Polyline을 확실히 제거한다.
  const handleRouteSelect = (route, routeResponse) => {
    // 대중교통 경로 색상: 이동수단 정보를 선택 경로에 보존해 지도 표시 방식을 결정한다.
    setSelectedRoute(
      route ? { ...route, transportType: routeResponse?.transportType } : null,
    );
    setRouteRenderRevision((current) => current + 1);
  };

  // 길찾기 결과 유지: 패널을 닫아도 선택 경로와 패널 내부 검색 결과는 보존한다.
  const closeRoutePanel = () => {
    setIsRouteOpen(false);
  };

  // 길찾기 표시 안정화: 패널 열림 상태에 맞는 여백으로 경로 전체가 보이도록 지도를 조정한다.
  useEffect(() => {
    if (!selectedRoute || !mapRef.current || !window.kakao?.maps)
      return undefined;

    const delay = isRouteOpen ? 0 : 320;
    const timeoutId = window.setTimeout(() => {
      const map = mapRef.current;
      const mapPoints = getRouteMapPoints(selectedRoute);
      if (!map || mapPoints.length === 0) return;

      map.relayout();
      const bounds = new window.kakao.maps.LatLngBounds();
      mapPoints.forEach(({ lat, lng }) => {
        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
      });

      const sidePadding = window.innerWidth <= 768 ? 32 : 60;
      const leftPadding = window.innerWidth > 768
        ? isCourseMapView ? 500 : isRouteOpen ? 600 : sidePadding
        : sidePadding;
      const bottomPadding = isCourseMapView && window.innerWidth <= 768
        ? Math.round(window.innerHeight * 0.6) : 60;
      map.setBounds(bounds, 60, sidePadding, bottomPadding, leftPadding);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [isRouteOpen, selectedRoute, isCourseMapView, loading]);

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

  return (
    <MapContainer>
      {/* 길찾기 기능 연동: 검색 목록의 출발/도착 버튼을 실제 패널과 연결한다. */}
      <SearchPanel
        pins={pins}
        onPlaceSelect={handlePlaceSelect}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        isVisible={!isDetailOpen && !isRouteOpen && !isCourseMapView}
        onSearchResults={setFilteredPins}
        onSetOrigin={openRouteWithOrigin}
        onSetDestination={openRouteWithDestination}
      />

      {isFixedCourseView && !isFixedCourseDetail && (
        <FixedCoursePanel
          selectedCourseNo={courseNo}
          onClose={() => navigate("/map")}
          onCourseSelect={(course) =>
            navigate(`/pilgrim/fixed/${course.courseNo}`)
          }
        />
      )}

      {isFixedCourseDetail && (
        <FixedCourseDetail
          key={location.key}
          courseNo={courseNo}
          pins={pins}
          requestKey={location.key}
          onClose={() => navigate("/map")}
          onRouteChange={setFixedCourseMap}
        />
      )}

      {isCustomCourseView && (
        <UserCourseFlow
          key={location.key}
          pins={pins}
          pinsState={pinsState}
          onClose={() => navigate("/map")}
          onRouteChange={setCustomRoute}
        />
      )}

      {/* 길찾기 기능 연동: 지도 위 독립 패널에서 입력·검색·결과 선택을 처리한다. */}
      <RoutePanel
        key={`route-input-${routeInputRevision}`}
        isOpen={isRouteOpen && !isCourseMapView}
        initialOrigin={routeOrigin}
        initialDestination={routeDestination}
        onClose={closeRoutePanel}
        onRouteSelect={handleRouteSelect}
      />

      {/* 길찾기 결과 유지: 닫은 패널을 기존 결과와 입력값 그대로 다시 열 수 있다. */}
      {!isCourseMapView && !isRouteOpen && selectedRoute && (
        <RouteReopenButton
          type="button"
          onClick={() => setIsRouteOpen(true)}
          aria-label="길찾기 결과 다시 열기"
        >
          <FaRoute />
          길찾기 결과
        </RouteReopenButton>
      )}

      {!isFixedCourseView && !isCustomCourseView && location.pathname !== "/gimpoTop10" && (
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
              <FaChevronRight
                size={21}
                style={{ transform: "rotate(180deg)" }}
              />
            ) : (
              <FaChevronRight size={21} />
            )}
          </ToggleButton>
        </FloatingTags>
      )}

      {loading || error ? (
        <MapStatus role="status">
          <strong>
            {loading
              ? "지도를 불러오는 중입니다."
              : "지도를 불러오는 데 실패했습니다."}
          </strong>
          {error && <span>카카오 앱 키 설정을 확인해주세요.</span>}
        </MapStatus>
      ) : (
        <Map
          mapTypeId="ROADMAP"
          center={{ lat: 37.6105, lng: 126.7056 }}
          style={{ width: "100%", height: "100%" }}
          level={5}
          onCreate={(map) => {
            // 길찾기 기능 연동: 경로 범위 조정을 위해 실제 Kakao Map 인스턴스를 보관한다.
            mapRef.current = map;
            // 길찾기 표시 안정화: 장거리 경로도 한 화면에 담을 수 있도록 최대 축소 레벨을 허용한다.
            map.setMaxLevel(14);
            map.setMinLevel(2); // 과도한 확대 방지
          }}
          onZoomChanged={(map) => setMapLevel(map.getLevel())}
          onClick={() => {
            setTop10Overlay(null);
            if (isCourseMapView) return;
            navigate(isFixedCourseView ? "/pilgrim/fixed" : "/map");
          }}
        >
          {mapLevel >= 7 ? (
            <MarkerClusterer
              averageCenter={true}
              minLevel={7} // 줌아웃 시 마커가 클러스터링되는 레벨
            >
              {(isCourseMapView ? coursePins : filteredPins).map((pin, index) => {
                const TOP10_PLACE_NOS = ["1", "4", "5", "7", "8", "9", "10", "14", "178", "1043"];
                const isTop10 = String(pin.typeDetailNo) === "18" || TOP10_PLACE_NOS.includes(String(pin.placeNo));
                
                return (
                  <MapMarker
                    key={`cluster-${pin.placeNo || index}`}
                    position={{ lat: pin.yAxis, lng: pin.xAxis }}
                    image={{
                      src: isTop10 ? MARKER_GOLD_SVG : MARKER_SVG,
                      size: isTop10 ? { width: 28, height: 28 } : { width: 24, height: 24 },
                    }}
                    onClick={() => handleMarkerClick(pin)}
                  />
                );
              })}
            </MarkerClusterer>
          ) : (
            (isCourseMapView ? coursePins : filteredPins).map((pin, index) => {
              const TOP10_PLACE_NOS = ["1", "4", "5", "7", "8", "9", "10", "14", "178", "1043"];
              const isTop10 = String(pin.typeDetailNo) === "18" || TOP10_PLACE_NOS.includes(String(pin.placeNo));
              
              return (
                <CustomOverlayMap
                  key={`custom-${pin.placeNo || index}`}
                  position={{ lat: pin.yAxis, lng: pin.xAxis }}
                  yAnchor={1} // 바닥 중앙이 좌표에 맞도록
                  zIndex={isTop10 ? 10 : 1}
                >
                  {isTop10 ? (
                    <Top10Marker onClick={() => handleMarkerClick(pin)} />
                  ) : (
                    <GeneralMarker onClick={() => handleMarkerClick(pin)} />
                  )}
                </CustomOverlayMap>
              );
            })
          )}

          {top10Overlay && top10Overlay.isExternal && !selectedPlace && (
            <CustomOverlayMap
              position={{ lat: top10Overlay.yAxis, lng: top10Overlay.xAxis }}
              yAnchor={1}
              zIndex={15}
            >
              <Top10Marker onClick={() => {}} />
            </CustomOverlayMap>
          )}

          {/* 대중교통 경로 색상: 대중교통은 이동 단계별 색상과 도보 점선으로 표시한다. */}
          {selectedMapSegments.map((segment) => (
            <Polyline
              key={`${routeRenderRevision}-${segment.key}`}
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
              key={`route-${isCourseMapView ? location.key : routeRenderRevision}`}
              path={selectedMapPath}
              strokeWeight={7}
              strokeColor={
                isCourseMapView ? "#34C759" : isWalkingRoute
                  ? ROUTE_SEGMENT_COLORS.WALKING
                  : ROUTE_SEGMENT_COLORS.GENERAL_BUS
              }
              strokeOpacity={0.9}
              strokeStyle={!isCourseMapView && isWalkingRoute ? "shortdash" : "solid"}
            />
          )}

          {selectedPlace && (
            <CustomOverlayMap
              position={{ lat: selectedPlace.yAxis, lng: selectedPlace.xAxis }}
              yAnchor={1}
              clickable={true}
              zIndex={20}
            >
              <div style={{ marginBottom: "28px" }}>
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
              </div>
            </CustomOverlayMap>
          )}

          {top10Overlay && !selectedPlace && (
            <CustomOverlayMap
              position={{ lat: top10Overlay.yAxis, lng: top10Overlay.xAxis }}
              yAnchor={1}
              clickable={true}
              zIndex={20}
            >
              <div style={{ marginBottom: "28px" }}>
                <OverlayCard>
                <div className="header-row">
                  <OverlayTitle>{top10Overlay.placeName}</OverlayTitle>
                  <div className="action-buttons">
                    <button
                      className="btn-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRouteWithOrigin(top10Overlay);
                      }}
                    >
                      출발
                    </button>
                    <button
                      className="btn-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRouteWithDestination(top10Overlay);
                      }}
                    >
                      도착
                    </button>
                  </div>
                </div>

                <div className="sub-row">
                  {!top10Overlay.isExternal && Number.isFinite(top10Overlay.reviewCount) && (
                    <span className="review-count">리뷰 {top10Overlay.reviewCount}</span>
                  )}
                  {!top10Overlay.isExternal && Number.isFinite(top10Overlay.avgRating) && (
                    <span className="rating">
                      <span className="star">⭐</span> {top10Overlay.avgRating.toFixed(1)}
                    </span>
                  )}
                  <span
                    className="detail-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 더미 데이터의 placeNo가 카카오나 DB와 어떻게 연결될지에 따라 다름
                      // 일단 DB 핀인 경우에만 정상 동작하도록 placeNo 사용
                      navigate(`/place/${top10Overlay.placeNo}`);
                    }}
                  >
                    상세보기
                  </span>
                </div>

                <div className="addr-row">
                  <div className="addr-item">
                    <span className="addr-label">도로명</span>
                    <span className="addr-value">{top10Overlay.addr}</span>
                  </div>
                  {top10Overlay.addrDetail && (
                    <div className="addr-item">
                      <span className="addr-label">지번</span>
                      <span className="addr-value">{top10Overlay.addrDetail}</span>
                    </div>
                  )}
                </div>
              </OverlayCard>
              </div>
            </CustomOverlayMap>
          )}
        </Map>
      )}

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

      <Top10Panel 
        isOpen={location.pathname === "/gimpoTop10"}
        onClose={() => {
          setTop10Overlay(null);
          navigate("/map");
        }}
        onPlaceClick={handleTop10PlaceSelect}
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
