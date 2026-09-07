import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlaceAPI } from "../../api/place";
import SearchPanel from "./components/SearchPanel";
import CourseRouteLine from "./CourseRouteLine";
import DetailPanel from "./components/DetailPanel";
import FixedCoursePanel from "../courses/components/FixedCoursePanel";
import FixedCourseDetail from "../courses/components/FixedCourseDetail";
import UserCourseFlow from "../courses/components/UserCourseFlow";
import SavedUserCourseDetail from "../courses/components/SavedUserCourseDetail";
import { getCourseRoute, isCoursePoint } from "../courses/utils/userCourseStorage";
import RoutePanel from "./components/RoutePanel";
import RoutePolylineLayer from "./components/RoutePolylineLayer";
import Top10Panel from "./components/Top10Panel";
import { Modal } from "../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  MapContainer,
  FloatingTags,
  MapStatus,
  MapPickNotice,
  MapPinToolbar,
  MapPinCreateButton,
  LegendLine,
  RouteLegend,
  RouteReopenButton,
  TagList,
  FilterSelect,
  FilterResetButton,
  ToggleButton,
  OverlayCard,
  OverlayTitle,
} from "./MapPage.styles";
import {
  getRouteSegmentStyle,
  ROUTE_SEGMENT_COLORS,
  ROUTE_SEGMENT_LEGEND,
} from "./routeSegmentStyles";

const EMPTY_RESTAURANTS = [];

const getCourseMarkerImage = (index) => {
  const number = index + 1;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="20" r="14" fill="#163d43" opacity="0.12"/>
    <circle cx="18" cy="18" r="14" fill="white"/>
    <circle cx="18" cy="18" r="12.5" fill="white" stroke="#168b91" stroke-width="1.5"/>
    <text x="18" y="18" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="${number > 99 ? 10 : number > 9 ? 12 : 14}" font-weight="600" fill="#253d43">${number}</text>
  </svg>`;
  return {
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    size: { width: 36, height: 36 },
    options: { offset: { x: 18, y: 18 } },
  };
};

const MARKER_SVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23FF7043' stroke='white' stroke-width='2'/%3E%3C/svg%3E";

const EMPTY_PLACE_FILTERS = {
  typeNo: null,
  typeDetailNo: null,
  tagNo: null,
};

// DB 장소 필터 연동: 백엔드 결과 중 지도에 표시할 수 있는 좌표 데이터만 사용한다.
const toValidPins = (places = []) =>
  (Array.isArray(places) ? places : places?.content || []).filter(
    (place) =>
      Number.isFinite(Number(place.xAxis)) &&
      Number.isFinite(Number(place.yAxis)),
  );

const MARKER_GOLD_SVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='%23C9A227' stroke='white' stroke-width='2'/%3E%3Cpath d='M12 7l1.5 3h3.5l-2.5 2.5 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2.5h3.5z' fill='white'/%3E%3C/svg%3E";


// 길찾기 기능 연동: 기존 지도 장소 객체를 길찾기 패널이 사용하는 DB 장소 형식으로 변환한다.
const toRoutePlace = (place) =>
  place
    ? {
        placeNo: place.placeNo,
        placeName: place.placeName || place.label,
        address: place.addr || place.address,
        X_AXIS: Number(place.X_AXIS ?? place.xAxis),
        Y_AXIS: Number(place.Y_AXIS ?? place.yAxis),
      }
    : null;

const getRoutePointMarkerImage = (label, color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 42 50">
    <path d="M21 2C10.5 2 2 10.5 2 21c0 14.5 19 27 19 27s19-12.5 19-27C40 10.5 31.5 2 21 2z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="21" cy="20" r="10" fill="white"/>
    <text x="21" y="20" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="${color}">${label}</text>
  </svg>`;
  return {
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    size: { width: 42, height: 50 },
    options: { offset: { x: 21, y: 48 } },
  };
};

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

const toRouteMarker = (point, index) => {
  const xAxis = Number(point?.X_AXIS ?? point?.xAxis);
  const yAxis = Number(point?.Y_AXIS ?? point?.yAxis);
  if (!Number.isFinite(xAxis) || !Number.isFinite(yAxis)) return null;

  return {
    ...point,
    xAxis,
    yAxis,
    routeMarkerKey: `${point?.placeNo ?? "coordinate"}-${index}`,
  };
};

const MapPage = () => {
  const [pins, setPins] = useState([]);
  const [pinsState, setPinsState] = useState("loading");
  const [filteredPins, setFilteredPins] = useState([]); // 지도에 표시할 핀 목록
  // DB 장소 필터 연동: 선택지와 선택된 PK를 분리해 DB 번호가 바뀌어도 화면 코드가 영향을 받지 않게 한다.
  const [filterPins, setFilterPins] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [placeFilters, setPlaceFilters] = useState(EMPTY_PLACE_FILTERS);
  // 장소 핀 초기 상태: 선택 안 함에서는 빈 지도, 전체 선택을 눌렀을 때만 전체 장소를 표시한다.
  const [isAllPinsVisible, setIsAllPinsVisible] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState({}); // { placeNo: boolean } 북마크 상태 공유용
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // 길찾기 기능 연동: 패널의 출발지·도착지와 지도에 표시할 선택 경로를 관리한다.
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [mapPickMode, setMapPickMode] = useState(null);
  const [generalRoute, setSelectedRoute] = useState(null);
  const [customRoute, setCustomRoute] = useState(null);
  const [fixedCourseMap, setFixedCourseMap] = useState(null);
  const [restaurantMap, setRestaurantMap] = useState(null);
  // 코드 리뷰 반영: placeNo가 없는 좌표 장소도 외부 입력이 바뀔 때 RoutePanel을 새 입력으로 초기화한다.
  const [routeInputRevision, setRouteInputRevision] = useState(0);
  // 길찾기 표시 안정화: 경로가 바뀔 때 Kakao Polyline을 새 인스턴스로 교체하기 위한 번호다.
  const [routeRenderRevision, setRouteRenderRevision] = useState(0);
  const mapRef = useRef(null);
  const filterRequestIdRef = useRef(0);
  const restaurantViewportRef = useRef(null);

  const [top10OverlayState, setTop10Overlay] = useState(null); // { ...place, xAxis, yAxis }
  const [top10OverlayDetail, setTop10OverlayDetail] = useState(null);

  useEffect(() => {
    const targetPlaceNo = top10OverlayState?.placeNo;
    if (!targetPlaceNo || top10OverlayState.isExternal) return undefined;

    let ignore = false;
    PlaceAPI.getPlaceDetail(targetPlaceNo)
      .then((res) => {
        if (!ignore) {
          setTop10OverlayDetail({ placeNo: targetPlaceNo, data: res.data || res });
        }
      })
      .catch((err) => console.error("Top10 상세 정보 조회 실패", err));

    return () => {
      ignore = true;
    };
  }, [top10OverlayState?.placeNo, top10OverlayState?.isExternal]);

  const top10Overlay = useMemo(() => {
    const detail =
      top10OverlayState &&
      top10OverlayDetail?.placeNo === top10OverlayState.placeNo
        ? top10OverlayDetail.data
        : null;
    return top10OverlayState ? { ...top10OverlayState, ...detail } : null;
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
    libraries: ["services"],
  });

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await PlaceAPI.getPins();
        // DB 지도 핀 연동: API가 반환한 PLACE 목록만 사용하고 목업 데이터로 대체하지 않는다.
        const validPins = toValidPins(response);
        setPins(validPins);
        setFilteredPins([]);
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

  useEffect(() => {
    let ignore = false;

    Promise.all([PlaceAPI.getTypeOptions(), PlaceAPI.getTagOptions()])
      .then(([types, tags]) => {
        if (ignore) return;
        setTypeOptions(Array.isArray(types) ? types : []);
        setTagOptions(Array.isArray(tags) ? tags : []);
      })
      .catch((err) => {
        if (ignore) return;
        console.error("장소 타입·태그 선택지를 불러오는 데 실패했습니다.", err);
        setAlertMessage("장소 타입·태그 선택지를 불러오지 못했습니다.");
        setIsAlertModalOpen(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const groupedTypeOptions = useMemo(() => {
    const groups = new window.Map();
    typeOptions.forEach((option) => {
      if (!groups.has(option.typeNo)) {
        groups.set(option.typeNo, {
          typeNo: option.typeNo,
          type: option.type,
          details: [],
        });
      }
      if (option.typeDetailNo != null) {
        groups.get(option.typeNo).details.push(option);
      }
    });
    return [...groups.values()];
  }, [typeOptions]);

  const selectedTypeValue = placeFilters.typeDetailNo
    ? `detail:${placeFilters.typeDetailNo}`
    : placeFilters.typeNo
      ? `type:${placeFilters.typeNo}`
      : "";
  const hasPlaceFilter = Boolean(
    placeFilters.typeNo || placeFilters.typeDetailNo || placeFilters.tagNo,
  );

  const params = useParams();
  const { placeNo } = params;
  const navigate = useNavigate();
  const location = useLocation();
  // 음식점 상세는 순례길 위에 열어 조회 결과와 스크롤을 그대로 보존한다.
  const isCourseRestaurantDetail = Boolean(placeNo && location.state?.courseBackground);
  const courseLocation = isCourseRestaurantDetail ? location.state.courseBackground : location;
  const courseNo = isCourseRestaurantDetail ? courseLocation.courseNo : params.courseNo;
  const userCourseId = isCourseRestaurantDetail ? courseLocation.userCourseId : params.userCourseId;
  const isFixedCourseView = courseLocation.pathname.startsWith("/pilgrim/fixed");
  const isCustomCourseView = courseLocation.pathname === "/pilgrim/create";
  const isFixedCourseDetail = isFixedCourseView && Boolean(courseNo);
  const isUserCourseDetail = isFixedCourseView && Boolean(userCourseId);
  const isCourseMapView = isCustomCourseView || isFixedCourseDetail || isUserCourseDetail;
  const restaurantPins = isCourseMapView && restaurantMap?.key === courseLocation.key
    ? restaurantMap.places : EMPTY_RESTAURANTS;
  const handleRestaurantsChange = useCallback((places) => {
    setRestaurantMap({ key: courseLocation.key, places: places.filter(isCoursePoint) });
  }, [courseLocation.key]);
  const handleRestaurantSelect = (place) => {
    const map = mapRef.current;
    const center = map?.getCenter();
    const background = isCourseRestaurantDetail ? courseLocation : {
      pathname: courseLocation.pathname, key: courseLocation.key, courseNo, userCourseId,
      viewport: center ? { lat: center.getLat(), lng: center.getLng(), level: map.getLevel() } : null,
    };
    restaurantViewportRef.current = { key: background.key, viewport: background.viewport };
    navigate(`/place/${place.placeNo}`, { replace: isCourseRestaurantDetail, state: {
      courseBackground: background,
      restaurantPlace: { ...place, xAxis: Number(place.X_AXIS ?? place.xAxis), yAxis: Number(place.Y_AXIS ?? place.yAxis) },
    } });
  };
  // 현재 URL의 요청 결과만 사용해 다른 코스를 열 때 이전 경로가 남지 않게 한다.
  const courseRouteData = isFixedCourseDetail || isUserCourseDetail
    ? fixedCourseMap?.key === courseLocation.key ? fixedCourseMap.routeData : null
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
        ? pins.find((pin) => String(pin.placeNo) === String(placeNo))
          || (String(location.state?.restaurantPlace?.placeNo) === String(placeNo) ? location.state.restaurantPlace : null)
        : null,
    [placeNo, pins, location.state],
  );

  const [overlayDetail, setOverlayDetail] = useState(null);

  useEffect(() => {
    const targetPlaceNo = baseSelectedPlace?.placeNo;
    if (!targetPlaceNo) return undefined;

    let ignore = false;
    PlaceAPI.getPlaceDetail(targetPlaceNo)
      .then((res) => {
        if (!ignore) {
          setOverlayDetail({ placeNo: targetPlaceNo, data: res.data || res });
        }
      })
      .catch((err) => console.error("오버레이 상세 정보 조회 실패", err));

    return () => {
      ignore = true;
    };
  }, [baseSelectedPlace?.placeNo]);

  const selectedPlace = useMemo(() => {
    const detail =
      baseSelectedPlace &&
      overlayDetail?.placeNo === baseSelectedPlace.placeNo
        ? overlayDetail.data
        : null;
    return baseSelectedPlace ? { ...baseSelectedPlace, ...detail } : null;
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

  // DB 장소 필터 연동: 타입과 태그 선택을 함께 유지하고 PK 조건을 AND로 조회한다.
  const handlePlaceFilter = async (kind, value) => {
    const requestId = filterRequestIdRef.current + 1;
    filterRequestIdRef.current = requestId;

    let nextFilters = { ...placeFilters };
    if (kind === "type") {
      nextFilters = {
        ...nextFilters,
        typeNo: value.startsWith("type:") ? Number(value.split(":")[1]) : null,
        typeDetailNo: value.startsWith("detail:") ? Number(value.split(":")[1]) : null,
      };
    } else if (kind === "tag") {
      nextFilters = {
        ...nextFilters,
        tagNo: value ? Number(value) : null,
      };
    }

    setPlaceFilters(nextFilters);
    setIsAllPinsVisible(false);

    const hasNextFilter = Boolean(
      nextFilters.typeNo || nextFilters.typeDetailNo || nextFilters.tagNo,
    );
    if (!hasNextFilter) {
      setFilterPins([]);
      setFilteredPins([]);
      setIsFilterLoading(false);
      return;
    }

    setIsFilterLoading(true);
    try {
      const response = await PlaceAPI.getPinsByFilters(nextFilters);

      // 연속 선택 시 늦게 도착한 이전 응답이 최신 필터 결과를 덮지 않게 한다.
      if (requestId !== filterRequestIdRef.current) return;

      const validPins = toValidPins(response);
      setFilterPins(validPins);
      setFilteredPins(validPins);

      if (validPins.length === 0) {
        setAlertMessage("선택한 조건에 해당하는 장소가 없습니다.");
        setIsAlertModalOpen(true);
      }
    } catch (err) {
      if (requestId !== filterRequestIdRef.current) return;

      console.error("장소 필터 조회에 실패했습니다.", err);
      setAlertMessage("장소 필터를 적용하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setIsAlertModalOpen(true);
    } finally {
      if (requestId === filterRequestIdRef.current) {
        setIsFilterLoading(false);
      }
    }
  };

  const handleMarkerClick = (place) => {
    // 발표용 지도 동작: 핀 클릭만으로 상세 페이지로 이동하지 않고 지도 위 정보 모달을 연다.
    setTop10Overlay({ ...place, isExternal: false });
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

  const handleRoutePointsChange = useCallback((origin, destination) => {
    setRouteOrigin(origin);
    setRouteDestination(destination);
  }, []);

  const handleRequestMapPick = useCallback((target) => {
    setMapPickMode(target);
    setTop10Overlay(null);
    setIsRouteOpen(true);
    navigate("/map");
  }, [navigate]);

  const handleMapClick = (_map, mouseEvent) => {
    setTop10Overlay(null);

    if (mapPickMode && mouseEvent?.latLng) {
      const isOrigin = mapPickMode === "origin";
      const pickedPoint = {
        label: isOrigin ? "지도에서 선택한 출발지" : "지도에서 선택한 도착지",
        placeName: isOrigin ? "지도에서 선택한 출발지" : "지도에서 선택한 도착지",
        address: "지도에서 선택한 위치",
        X_AXIS: mouseEvent.latLng.getLng(),
        Y_AXIS: mouseEvent.latLng.getLat(),
      };

      if (isOrigin) setRouteOrigin(pickedPoint);
      else setRouteDestination(pickedPoint);
      setSelectedRoute(null);
      setMapPickMode(null);
      setRouteInputRevision((current) => current + 1);
      setRouteRenderRevision((current) => current + 1);
      return;
    }

    if (isCourseMapView) return;
    navigate(isFixedCourseView ? "/pilgrim/fixed" : "/map");
  };

  // 길찾기 표시 안정화: 새 경로마다 렌더링 번호를 변경해 이전 Polyline을 확실히 제거한다.
  const handleRouteSelect = (route, routeResponse) => {
    setMapPickMode(null);
    // 대중교통 경로 색상: 이동수단 정보를 선택 경로에 보존해 지도 표시 방식을 결정한다.
    const routePoints = route
      ? [
          routeResponse?.origin,
          ...(routeResponse?.waypoints || []),
          routeResponse?.destination,
        ]
          .filter(Boolean)
          .map(toRouteMarker)
          .filter(Boolean)
      : [];
    setSelectedRoute(route
      ? {
          ...route,
          transportType: routeResponse?.transportType,
          routePoints,
        }
      : null);
    setRouteRenderRevision((current) => current + 1);
  };

  // 길찾기 종료: X 버튼은 패널만 숨기지 않고 입력·결과·지도 경로를 모두 초기화한다.
  const endRoute = () => {
    setIsRouteOpen(false);
    setRouteOrigin(null);
    setRouteDestination(null);
    setMapPickMode(null);
    setSelectedRoute(null);
    setRouteInputRevision((current) => current + 1);
    setRouteRenderRevision((current) => current + 1);
  };

  const handleAllPinsToggle = () => {
    // 장소 핀 UX 개선: 전체 선택 버튼을 다시 누르면 선택 안 함 상태로 복귀한다.
    if (isAllPinsVisible) {
      setPlaceFilters(EMPTY_PLACE_FILTERS);
      setFilterPins([]);
      setFilteredPins([]);
      setIsAllPinsVisible(false);
      return;
    }

    filterRequestIdRef.current += 1;
    setPlaceFilters(EMPTY_PLACE_FILTERS);
    setFilterPins([]);
    setFilteredPins(pins);
    setIsAllPinsVisible(true);
    setIsFilterLoading(false);
  };

  // 길찾기 표시 안정화: 패널 열림 상태에 맞는 여백으로 경로 전체가 보이도록 지도를 조정한다.
  useEffect(() => {
    if (isCourseRestaurantDetail) {
      restaurantViewportRef.current = { key: courseLocation.key, viewport: courseLocation.viewport };
      return undefined;
    }
    if ((!selectedRoute && restaurantPins.length === 0) || !mapRef.current || !window.kakao?.maps)
      return undefined;

    const delay = isRouteOpen || restaurantViewportRef.current?.key === courseLocation.key ? 0 : 320;
    const timeoutId = window.setTimeout(() => {
      const map = mapRef.current;
      const mapPoints = restaurantPins.length > 0
        ? toMapPath(restaurantPins) : getRouteMapPoints(selectedRoute);
      if (!map || mapPoints.length === 0) return;

      map.relayout();
      const snapshot = restaurantViewportRef.current;
      const viewport = snapshot?.key === courseLocation.key ? snapshot.viewport : null;
      restaurantViewportRef.current = null;
      if (isCourseMapView && viewport) {
        map.setLevel(viewport.level);
        map.setCenter(new window.kakao.maps.LatLng(viewport.lat, viewport.lng));
        return;
      }
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
  }, [isRouteOpen, selectedRoute, isCourseMapView, loading, restaurantPins, isCourseRestaurantDetail, courseLocation.key, courseLocation.viewport]);

  const selectedMapPath = useMemo(
    () => toMapPath(selectedRoute?.path),
    [selectedRoute],
  );
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
  // 길찾기 지도 정리: 결과가 있으면 관계없는 전체 DB 핀을 숨기고 경로 포함 지점만 표시한다.
  const visibleMapPins = isCourseMapView
    ? coursePins
    : selectedRoute
      ? (selectedRoute.routePoints || []).slice(1, -1)
      : filteredPins;
  const hasRouteSession = Boolean(
    isRouteOpen || routeOrigin || routeDestination || selectedRoute,
  );
  const searchablePins = hasPlaceFilter ? filterPins : pins;

  const routeSelectionPins = useMemo(
    () => [
      routeOrigin && { ...toRoutePlace(routeOrigin), markerLabel: "출", markerColor: "#2196F3" },
      routeDestination && { ...toRoutePlace(routeDestination), markerLabel: "도", markerColor: "#FF5A47" },
    ].filter(Boolean),
    [routeOrigin, routeDestination],
  );

  const handleSearchResults = useCallback((results) => {
    // 선택 안 함 상태에서 검색어를 지우면 전체 핀이 자동으로 나타나지 않게 한다.
    if (!hasPlaceFilter && !isAllPinsVisible && results === pins) {
      setFilteredPins([]);
      return;
    }
    setFilteredPins(results);
  }, [hasPlaceFilter, isAllPinsVisible, pins]);

  // DB 장소 필터 연동: 필터 결과의 위치가 현재 화면 밖에 있지 않도록 결과 범위로 지도를 이동한다.
  useEffect(() => {
    if (
      !hasPlaceFilter ||
      filterPins.length === 0 ||
      !mapRef.current ||
      !window.kakao?.maps
    ) {
      return;
    }

    const map = mapRef.current;
    if (filterPins.length === 1) {
      map.panTo(
        new window.kakao.maps.LatLng(
          filterPins[0].yAxis,
          filterPins[0].xAxis,
        ),
      );
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    filterPins.forEach((pin) => {
      bounds.extend(new window.kakao.maps.LatLng(pin.yAxis, pin.xAxis));
    });
    map.setBounds(bounds, 60, 60, 60, 60);
  }, [hasPlaceFilter, filterPins]);

  return (
    <MapContainer>
      {/* 길찾기 기능 연동: 검색 목록의 출발/도착 버튼을 실제 패널과 연결한다. */}
      <SearchPanel
        pins={searchablePins}
        onPlaceSelect={handlePlaceSelect}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        isVisible={!isDetailOpen && !hasRouteSession && !isCourseMapView}
        onSearchResults={handleSearchResults}
        onSetOrigin={openRouteWithOrigin}
        onSetDestination={openRouteWithDestination}
      />

      {isFixedCourseView && !isFixedCourseDetail && !isUserCourseDetail && (
        <FixedCoursePanel
          key={location.key}
          selectedCourseNo={courseNo}
          showUserCourses={Boolean(location.state?.showUserCourses)}
          onCreateCourse={() => navigate("/pilgrim/create")}
          onUserCourseSelect={(course) => navigate(`/pilgrim/fixed/mine/${encodeURIComponent(course.id)}`)}
          onClose={() => navigate("/map")}
          onCourseSelect={(course) =>
            navigate(`/pilgrim/fixed/${course.courseNo}`)
          }
        />
      )}

      <div
        style={{ visibility: isCourseRestaurantDetail ? "hidden" : "visible" }}
        aria-hidden={isCourseRestaurantDetail || undefined}
        inert={isCourseRestaurantDetail || undefined}
      >
      {isFixedCourseDetail && (
        <FixedCourseDetail
          onRestaurantsChange={handleRestaurantsChange}
          onRestaurantSelect={handleRestaurantSelect}
          key={courseLocation.key}
          courseNo={courseNo}
          pins={pins}
          requestKey={courseLocation.key}
          onClose={() => navigate("/map")}
          onRouteChange={setFixedCourseMap}
        />
      )}

      {isUserCourseDetail && (
        <SavedUserCourseDetail
          onRestaurantsChange={handleRestaurantsChange}
          onRestaurantSelect={handleRestaurantSelect}
          key={courseLocation.key}
          courseId={userCourseId}
          places={pins}
          requestKey={courseLocation.key}
          onClose={() => navigate("/pilgrim/fixed", { state: { showUserCourses: true } })}
          onRouteChange={setFixedCourseMap}
        />
      )}

      {isCustomCourseView && (
        <UserCourseFlow
          onRestaurantsChange={handleRestaurantsChange}
          onRestaurantSelect={handleRestaurantSelect}
          key={courseLocation.key}
          pins={pins}
          pinsState={pinsState}
          onClose={() => navigate("/map")}
          onRouteChange={setCustomRoute}
        />
      )}

      </div>

      {/* 길찾기 기능 연동: 지도 위 독립 패널에서 입력·검색·결과 선택을 처리한다. */}
      <RoutePanel
        key={`route-input-${routeInputRevision}`}
        isOpen={isRouteOpen && !isCourseMapView}
        initialOrigin={routeOrigin}
        initialDestination={routeDestination}
        onClose={endRoute}
        onRouteSelect={handleRouteSelect}
        onPointsChange={handleRoutePointsChange}
        onRequestMapPick={handleRequestMapPick}
        mapPickMode={mapPickMode}
      />

      {/* 길찾기 패널 표시 전환: 경로 상태는 유지하고 패널만 접거나 다시 연다. */}
      {!isCourseMapView && hasRouteSession && (
        <RouteReopenButton
          type="button"
          $isOpen={isRouteOpen}
          onClick={() => setIsRouteOpen((current) => !current)}
          aria-label={isRouteOpen ? "길찾기 패널 숨기기" : "길찾기 패널 열기"}
        >
          <FaChevronRight
            size={21}
            style={{ transform: isRouteOpen ? "rotate(180deg)" : "none" }}
          />
        </RouteReopenButton>
      )}

      {!isFixedCourseView && !isCustomCourseView && (
        <FloatingTags>
          <TagList $isOpen={isTagsOpen}>
            {/* DB 장소 필터 연동: 존재하지 않는 임시 태그 버튼을 실제 타입·태그 선택으로 교체한다. */}
            <FilterSelect
              aria-label="장소 타입 선택"
              value={selectedTypeValue}
              $isActive={Boolean(placeFilters.typeNo || placeFilters.typeDetailNo)}
              disabled={isFilterLoading}
              onChange={(event) => handlePlaceFilter("type", event.target.value)}
            >
              <option value="">타입 선택 안 함</option>
              {groupedTypeOptions.map((group) => (
                <optgroup key={group.typeNo} label={group.type}>
                  <option value={`type:${group.typeNo}`}>{group.type} 전체</option>
                  {group.details.map((detail) => (
                    <option key={detail.typeDetailNo} value={`detail:${detail.typeDetailNo}`}>
                      {detail.typeDetailContent}
                    </option>
                  ))}
                </optgroup>
              ))}
            </FilterSelect>

            <FilterSelect
              aria-label="장소 태그 선택"
              value={placeFilters.tagNo || ""}
              $isActive={Boolean(placeFilters.tagNo)}
              disabled={isFilterLoading}
              onChange={(event) => handlePlaceFilter("tag", event.target.value)}
            >
              <option value="">태그 선택 안 함</option>
              {tagOptions.map((tag) => (
                <option key={tag.tagNo} value={tag.tagNo}>
                  # {tag.tagContent}
                </option>
              ))}
            </FilterSelect>

            <FilterResetButton
              type="button"
              $isActive={isAllPinsVisible}
              disabled={isFilterLoading}
              aria-pressed={isAllPinsVisible}
              onClick={handleAllPinsToggle}
            >
              전체 선택
            </FilterResetButton>
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

      {/* 지도 좌표 길찾기: DB 장소를 먼저 고르지 않아도 지도에서 출발·도착 핀을 바로 생성한다. */}
      {!isCourseMapView && !loading && !error && (
        <MapPinToolbar aria-label="지도 길찾기 핀 생성">
          <MapPinCreateButton
            type="button"
            $color="#2196F3"
            $active={mapPickMode === "origin"}
            onClick={() => handleRequestMapPick("origin")}
            aria-pressed={mapPickMode === "origin"}
            title="지도에서 출발지 핀 생성"
          >
            <span><i>출</i></span>
            <small>출발지</small>
          </MapPinCreateButton>
          <MapPinCreateButton
            type="button"
            $color="#FF5A47"
            $active={mapPickMode === "destination"}
            onClick={() => handleRequestMapPick("destination")}
            aria-pressed={mapPickMode === "destination"}
            title="지도에서 도착지 핀 생성"
          >
            <span><i>도</i></span>
            <small>도착지</small>
          </MapPinCreateButton>
        </MapPinToolbar>
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
        <>
        {mapPickMode && (
          <MapPickNotice role="status">
            지도에서 {mapPickMode === "origin" ? "출발지" : "도착지"}로 사용할 위치를 클릭하세요.
            <button type="button" onClick={() => setMapPickMode(null)}>취소</button>
          </MapPickNotice>
        )}
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
          onClick={handleMapClick}
        >
          {visibleMapPins.map((pin, index) => {
            // DB typeDetailNo를 확인하거나, 명세된 placeNo 목록을 기반으로 판별
            const TOP10_PLACE_NOS = ["1", "4", "5", "7", "8", "9", "10", "14", "178", "1043"];
            const isTop10 = String(pin.typeDetailNo) === "18" || TOP10_PLACE_NOS.includes(String(pin.placeNo));

            // DB 지도 핀 연동: X_AXIS는 경도(lng), Y_AXIS는 위도(lat)로 사용한다.
            return (
              <MapMarker
                key={pin.routeMarkerKey || pin.placeNo || index}
                position={{
                  lat: Number(pin.Y_AXIS ?? pin.yAxis),
                  lng: Number(pin.X_AXIS ?? pin.xAxis),
                }}
                title={isCourseMapView
                  ? `${index + 1}. ${pin.placeName || "코스 장소"}${index === 0 ? " · 출발" : index === coursePins.length - 1 ? " · 도착" : ""}`
                  : pin.placeName}
                image={isCourseMapView ? getCourseMarkerImage(index) : {
                  src: isTop10 ? MARKER_GOLD_SVG : MARKER_SVG,
                  size: isTop10 ? { width: 28, height: 28 } : { width: 24, height: 24 },
                }}
                zIndex={isCourseMapView ? 12 : isTop10 ? 10 : 1}
                clickable={!selectedRoute && !isCourseMapView}
                onClick={() => {
                  if (!selectedRoute && !isCourseMapView) handleMarkerClick(pin);
                }}
              />
            );
          })}

          {!isCourseMapView && routeSelectionPins.map((pin) => (
            <MapMarker
              key={`route-selection-${pin.markerLabel}`}
              position={{ lat: pin.Y_AXIS, lng: pin.X_AXIS }}
              title={pin.placeName}
              image={getRoutePointMarkerImage(pin.markerLabel, pin.markerColor)}
              zIndex={40}
              clickable={false}
            />
          ))}

          {restaurantPins.map((place) => (
            <MapMarker
              key={"restaurant-" + place.placeNo}
              position={{ lat: Number(place.Y_AXIS ?? place.yAxis), lng: Number(place.X_AXIS ?? place.xAxis) }}
              title={place.placeName + " · 음식점 상세정보"}
              image={{ src: MARKER_SVG, size: { width: 32, height: 32 } }}
              zIndex={30}
              onClick={() => handleRestaurantSelect(place)}
            />
          ))}

          {top10Overlay && top10Overlay.isExternal && !selectedRoute && (
            <MapMarker
              key={`top10-${top10Overlay.placeNo ?? top10Overlay.placeName}`}
              position={{ lat: top10Overlay.yAxis, lng: top10Overlay.xAxis }}
              title={top10Overlay.placeName}
              image={{
                src: MARKER_GOLD_SVG,
                size: { width: 28, height: 28 },
              }}
              zIndex={15}
              clickable={false}
            />
          )}

          {/* 길찾기 표시 안정화: 새 경로를 그리기 전에 이전 Polyline 객체를 전부 제거한다. */}
          {isCourseMapView && selectedMapPath.length > 1 && (
            <CourseRouteLine path={selectedMapPath} />
          )}
          {!isCourseMapView && (
            <RoutePolylineLayer
              key={`route-layer-${routeRenderRevision}`}
              revision={routeRenderRevision}
              segments={selectedMapSegments}
              fallbackPath={selectedMapPath}
              fallbackColor={isWalkingRoute
                ? ROUTE_SEGMENT_COLORS.WALKING
                : ROUTE_SEGMENT_COLORS.GENERAL_BUS}
              fallbackStyle={isWalkingRoute ? "shortdash" : "solid"}
            />
          )}

          {selectedPlace && !top10Overlay && !selectedRoute && (
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

          {top10Overlay && !selectedRoute && (
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
        </>
      )}

      {/* 대중교통 경로 색상: 지도 선의 의미를 사용자가 바로 확인할 수 있는 범례다. */}
      {!isCourseMapView && selectedRoute?.transportType === "PUBLIC_TRANSIT" && (
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
        key={selectedPlace?.placeNo ?? "closed"}
        place={selectedPlace}
        isOpen={isDetailOpen && !isRouteOpen}
        onClose={() => {
          if (isCourseRestaurantDetail) navigate(-1);
          else navigate(location.state?.courseReturnTo || "/map");
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
