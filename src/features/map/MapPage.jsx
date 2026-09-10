import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { getSavedTrip } from "../mypage/myPageModel";
import { FaChevronRight } from "react-icons/fa";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlaceAPI } from "../../api/place";
import { BookmarkAPI } from "../../api/bookmark";
import { PlanAPI } from "../../api/plan";
import SearchPanel from "./components/SearchPanel";
import CourseRouteLine from "./CourseRouteLine";
import DetailPanel from "./components/DetailPanel";
import FixedCoursePanel from "../courses/components/FixedCoursePanel";
import FixedCourseDetail from "../courses/components/FixedCourseDetail";
import UserCourseFlow from "../courses/components/UserCourseFlow";
import SavedUserCourseDetail from "../courses/components/SavedUserCourseDetail";
import {
  getCourseRoute,
  isCoursePoint,
} from "../courses/utils/userCourseStorage";
import RoutePanel from "./components/RoutePanel";
import RoutePolylineLayer from "./components/RoutePolylineLayer";
import PlanModePanel from "./components/PlanModePanel";
import RecommendationModePanel from "./components/RecommendationModePanel";
import Top10Panel from "./components/Top10Panel";
import {
  Top10Marker,
  GeneralMarker,
  MedicalMarker,
  FoodMarker,
  TouristMarker,
  SportsMarker,
  ReligionMarker,
  EventMarker,
} from "./components/CustomMarkers";
import { getTop10IconByName } from "./components/Top10Icons";
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
  TagFilterPopover,
  TagFilterChip,
  FilterResetButton,
  ToggleButton,
  OverlayCard,
  OverlayTitle,
  OverlapMarkerContainer,
  OverlapCountBadge,
  OverlapNavigation,
} from "./MapPage.styles";
import {
  getRouteSegmentStyle,
  ROUTE_SEGMENT_COLORS,
  ROUTE_SEGMENT_LEGEND,
} from "./routeSegmentStyles";
import {
  MAX_TRAVEL_PLAN_PLACES,
  TRAVEL_PLAN_KIND,
  clearTravelPlanDraft,
  deleteTravelPlan,
  readTravelPlanDraft,
  readTravelPlans,
  saveTravelPlan,
  saveTravelPlanDraft,
} from "./utils/travelPlanStorage";
import {
  getCircularPinIndex,
  groupOverlappingPins,
  groupPinsByScreenDistance,
} from "./utils/overlappingPins";

const EMPTY_RESTAURANTS = [];

const TOP10_TYPE_DETAIL_NOS = new Set(["18", "46"]);
const TOP10_PLACE_NOS = new Set([
  "1",
  "4",
  "5",
  "7",
  "8",
  "9",
  "10",
  "14",
  "178",
  "1043",
]);

const normalizeCategoryName = (value) =>
  String(value ?? "")
    .replace(/\s+/g, "")
    .toUpperCase();

const isMajorTouristPlace = (place) =>
  Number(place?.typeNo ?? place?.TYPE_NO) === 1 ||
  ["주요관광지", "관광명소", "관광지"].includes(
    normalizeCategoryName(place?.type ?? place?.TYPE),
  );

// 핀·계획·추천 API마다 소분류 필드 구성이 달라도 Top10 전용 마커를 유지한다.
const isTop10Place = (place) => {
  const typeDetailName =
    place?.typeDetail ??
    place?.typeDetailContent ??
    place?.TYPE_DETAIL ??
    place?.TYPE_DETAIL_CONTENT;
  const typeDetailNo = place?.typeDetailNo ?? place?.TYPE_DETAIL_NO;
  const placeNo = place?.placeNo ?? place?.PLACE_NO;
  const typeName = normalizeCategoryName(place?.type ?? place?.TYPE);
  const isTouristType = ["주요관광지", "관광명소", "관광지"].includes(typeName);

  return (
    normalizeCategoryName(typeDetailName) === "김포TOP10" ||
    TOP10_TYPE_DETAIL_NOS.has(String(typeDetailNo ?? "")) ||
    TOP10_PLACE_NOS.has(String(placeNo ?? "")) ||
    (isTouristType && Boolean(getTop10IconByName(place?.placeName)))
  );
};

// 계획 모드: 위치 권한을 사용할 수 없을 때 출발지로 사용할 김포시청 좌표다.
const GIMPO_CITY_HALL = {
  placeName: "김포시청",
  address: "경기도 김포시 사우중로 1",
  xAxis: 126.7155,
  yAxis: 37.6153,
  locationSource: "fallback",
};

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

const PlaceCategoryMarker = ({ place, onClick }) => {
  if (isTop10Place(place)) {
    return <Top10Marker placeName={place?.placeName} onClick={onClick} />;
  }

  if (place?.type === "의료기관") return <MedicalMarker onClick={onClick} />;
  if (place?.type === "음식점" || place?.type === "카페") {
    return <FoodMarker onClick={onClick} />;
  }
  if (
    place?.type === "주요관광지" ||
    place?.type === "관광명소" ||
    place?.type === "관광지"
  ) {
    return <TouristMarker onClick={onClick} />;
  }
  if (place?.type === "생활체육시설" || place?.type === "체육시설") {
    return <SportsMarker onClick={onClick} />;
  }
  if (place?.type === "종교시설") {
    return <ReligionMarker onClick={onClick} />;
  }
  if (place?.type === "이벤트" || place?.type === "축제") {
    return <EventMarker onClick={onClick} />;
  }
  return <GeneralMarker onClick={onClick} />;
};

const OverlappingPlaceMarker = ({
  group,
  activeIndex = 0,
  disabled,
  onPlaceClick,
}) => {
  const normalizedIndex = getCircularPinIndex(activeIndex, group.pins.length);
  const activePlace = group.pins[normalizedIndex] ?? group.pins[0];
  const groupContainsTop10 = group.pins.some(isTop10Place);

  const handleClick = () => {
    if (disabled) return;
    onPlaceClick(group, normalizedIndex);
  };

  return (
    <CustomOverlayMap
      position={{
        lat: Number(activePlace?.yAxis ?? activePlace?.Y_AXIS),
        lng: Number(activePlace?.xAxis ?? activePlace?.X_AXIS),
      }}
      yAnchor={1}
      zIndex={groupContainsTop10 ? 10 : 1}
      clickable={!disabled}
    >
      <OverlapMarkerContainer
        title={
          group.pins.length > 1
            ? `겹친 장소 ${group.pins.length}개 · 클릭할 때마다 다음 장소 선택`
            : activePlace?.placeName
        }
      >
        <PlaceCategoryMarker place={activePlace} onClick={handleClick} />
        {group.pins.length > 1 && (
          <OverlapCountBadge
            aria-label={`추가로 겹친 장소 ${group.pins.length - 1}개`}
          >
            +{group.pins.length - 1}
          </OverlapCountBadge>
        )}
      </OverlapMarkerContainer>
    </CustomOverlayMap>
  );
};

const MARKER_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M 32 62 L 14 44 A 25 25 0 1 1 50 44 Z" fill="#8b5cf6" stroke="white" stroke-width="2"/>
  <g transform="translate(16, 10) scale(0.0625)">
    <path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z" fill="white"/>
  </g>
</svg>
`)}`;

const EMPTY_PLACE_FILTERS = {
  typeNo: null,
  typeDetailNo: null,
  tagNo: null,
};

// DB 장소 필터 연동: 백엔드 결과 중 지도에 표시할 수 있는 좌표 데이터만 사용한다.
const toValidPins = (places = []) => {
  const seenPlaceKeys = new Set();
  const seenLocationKeys = new Set();
  return (Array.isArray(places) ? places : places?.content || []).filter(
    (place) => {
      if (
        !Number.isFinite(Number(place?.xAxis)) ||
        !Number.isFinite(Number(place?.yAxis))
      ) {
        return false;
      }

      const placeKey = place?.placeNo != null
        ? `place:${place.placeNo}`
        : `coordinate:${place.placeName || ""}:${place.xAxis}:${place.yAxis}`;
      const locationKey = [
        normalizeCategoryName(place?.placeName),
        Number(place.xAxis).toFixed(6),
        Number(place.yAxis).toFixed(6),
      ].join(":");
      if (seenPlaceKeys.has(placeKey) || seenLocationKeys.has(locationKey)) {
        return false;
      }
      seenPlaceKeys.add(placeKey);
      seenLocationKeys.add(locationKey);
      return true;
    },
  );
};

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
  // 장소 핀 초기 상태: 선택 안 함에서는 빈 지도, 모든 장소를 선택하면 전체 장소를 표시한다.
  const [isAllPinsVisible, setIsAllPinsVisible] = useState(false);
  const [isAllTypesSelected, setIsAllTypesSelected] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
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

  // 계획 모드 상태는 기존 길찾기 상태와 분리해 두 기능의 핀과 경로가 섞이지 않게 한다.
  const [planOrigin, setPlanOrigin] = useState(null);
  const [planOriginStatus, setPlanOriginStatus] = useState("idle");
  const [isPlanOriginPickMode, setIsPlanOriginPickMode] = useState(false);
  const [isPlanPanelOpen, setIsPlanPanelOpen] = useState(true);
  const [planRecommendationPins, setPlanRecommendationPins] = useState([]);
  const [planPlaces, setPlanPlaces] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [savedRecommendationPlans, setSavedRecommendationPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [planDetailPlace, setPlanDetailPlace] = useState(null);
  const planLocationRequestRef = useRef(0);
  // 추천 모드는 계획 저장 상태와 분리하고, 현재 세션에서 생성한 코스만 지도에 표시한다.
  const [isRecommendationPanelOpen, setIsRecommendationPanelOpen] = useState(true);
  const [recommendationCourse, setRecommendationCourse] = useState(null);
  const [recommendationNearbyPlaces, setRecommendationNearbyPlaces] = useState([]);
  const [recommendationNearbyState, setRecommendationNearbyState] = useState("idle");

  const [top10OverlayState, setTop10Overlay] = useState(null); // { ...place, xAxis, yAxis }
  const [dismissedTop10Entry, setDismissedTop10Entry] = useState(null);
  const [top10Places, setTop10Places] = useState([]);
  const top10PlaceNos = useMemo(
    () => new Set(top10Places.map((place) => String(place.placeNo))),
    [top10Places],
  );
  const [top10OverlayDetail, setTop10OverlayDetail] = useState(null);
  const [overlapSelection, setOverlapSelection] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapLevel, setMapLevel] = useState(null);

  useEffect(() => {
    const targetPlaceNo = top10OverlayState?.placeNo;
    if (!targetPlaceNo || top10OverlayState.isExternal) return undefined;

    let ignore = false;
    PlaceAPI.getPlaceDetail(targetPlaceNo)
      .then((res) => {
        if (!ignore) {
          setTop10OverlayDetail({
            placeNo: targetPlaceNo,
            data: res.data || res,
          });
        }
      })
      .catch((err) => console.error("Top10 상세 정보 조회 실패", err));

    return () => {
      ignore = true;
    };
  }, [top10OverlayState?.placeNo, top10OverlayState?.isExternal]);

  const resolvedTop10Overlay = useMemo(() => {
    const detail =
      top10OverlayState &&
      top10OverlayDetail?.placeNo === top10OverlayState.placeNo
        ? top10OverlayDetail.data
        : null;
    return top10OverlayState ? { ...top10OverlayState, ...detail } : null;
  }, [top10OverlayState, top10OverlayDetail]);
  const { status, user } = useAuth();

  const toggleBookmark = async (e, placeNo) => {
    if (e) e.stopPropagation();
    if (placeNo == null) return;
    if (status === "unauthenticated") {
      setAlertMessage("로그인 후 이용해주세요.");
      setIsAlertModalOpen(true);
      return;
    }

    // 서버 응답을 기다리는 동안 아이콘이 즉시 반응하도록 낙관적으로 먼저 토글한다.
    const previous = Boolean(bookmarks[placeNo]);
    setBookmarks((prev) => ({ ...prev, [placeNo]: !previous }));

    try {
      const result = await BookmarkAPI.toggle(placeNo);
      setBookmarks((prev) => ({
        ...prev,
        [placeNo]: result?.bookmarked ?? !previous,
      }));
    } catch (err) {
      console.error("북마크 처리에 실패했습니다.", err);
      setBookmarks((prev) => ({ ...prev, [placeNo]: previous }));
      setAlertMessage("북마크 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsAlertModalOpen(true);
    }
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
      const typeKey = String(option.type || "").trim();
      if (!typeKey) return;

      if (!groups.has(typeKey)) {
        groups.set(typeKey, {
          typeNo: option.typeNo,
          type: option.type,
          details: [],
          detailNames: new Set(),
        });
      }

      const group = groups.get(typeKey);
      const detailKey = String(option.typeDetailContent || "").trim();
      if (option.typeDetailNo != null && !group.detailNames.has(detailKey)) {
        group.detailNames.add(detailKey);
        group.details.push(option);
      }
    });
    // 중복 적재된 타입 마스터가 있어도 동일한 대·소분류는 한 번만 표시한다.
    return [...groups.values()].map((group) => ({
      typeNo: group.typeNo,
      type: group.type,
      details: group.details,
    }));
  }, [typeOptions]);

  const selectedTypeGroup = groupedTypeOptions.find(
    (group) => String(group.typeNo) === String(placeFilters.typeNo),
  );
  const selectedTag = tagOptions.find((tag) => String(tag.tagNo) === String(placeFilters.tagNo));
  const hasPlaceFilter = Boolean(
    placeFilters.typeNo || placeFilters.typeDetailNo || placeFilters.tagNo,
  );

  const params = useParams();
  const { placeNo } = params;
  const navigate = useNavigate();
  const location = useLocation();
  // 음식점 상세는 순례길 위에 열어 조회 결과와 스크롤을 그대로 보존한다.
  const isCourseRestaurantDetail = Boolean(
    placeNo && location.state?.courseBackground,
  );
  const courseLocation = isCourseRestaurantDetail
    ? location.state.courseBackground
    : location;
  const courseNo = isCourseRestaurantDetail
    ? courseLocation.courseNo
    : params.courseNo;
  const userCourseId = isCourseRestaurantDetail
    ? courseLocation.userCourseId
    : params.userCourseId;
  const mapMode = new URLSearchParams(location.search).get("mode");
  const requestedSavedPlanId = new URLSearchParams(location.search).get("savedPlan");
  const isPlanModeRequested = location.pathname === "/map" && mapMode === "j";
  const isRecommendationModeRequested =
    location.pathname === "/map" && mapMode === "p";
  const isPlanMode = isPlanModeRequested && status === "authenticated";
  const isRecommendationMode =
    isRecommendationModeRequested && status === "authenticated";
  const isTravelMode = isPlanMode || isRecommendationMode;
  const planOwnerKey =
    user?.memberId ||
    (user?.memberNo != null ? `member:${user.memberNo}` : null);
  const isFixedCourseView =
    courseLocation.pathname.startsWith("/pilgrim/fixed");
  const isCustomCourseView = courseLocation.pathname === "/pilgrim/create";
  const isCourseView = isFixedCourseView || isCustomCourseView;
  const isFixedCourseDetail = isFixedCourseView && Boolean(courseNo);
  const isUserCourseDetail = isFixedCourseView && Boolean(userCourseId);
  const isCourseMapView =
    isCustomCourseView || isFixedCourseDetail || isUserCourseDetail;
  const isTop10Route = /^\/gimpoTop10(?:\/|$)/.test(location.pathname);
  const isInitialMapTop10 =
    location.pathname === "/map" &&
    !mapMode &&
    !location.state?.hideInitialTop10 &&
    dismissedTop10Entry !== location.key &&
    !isRouteOpen &&
    !routeOrigin &&
    !routeDestination &&
    !generalRoute;
  const isTop10Screen = isTop10Route || isInitialMapTop10;
  const top10Overlay =
    isTop10Route &&
    !top10PlaceNos.has(String(resolvedTop10Overlay?.placeNo))
      ? null
      : resolvedTop10Overlay;

  useEffect(() => {
    if (
      (isPlanModeRequested || isRecommendationModeRequested) &&
      status === "unauthenticated"
    ) {
      navigate("/login", { replace: true });
    }
  }, [isPlanModeRequested, isRecommendationModeRequested, navigate, status]);

  const moveMapToPlanPoint = useCallback((point) => {
    if (!point || !mapRef.current || !window.kakao?.maps) return;
    mapRef.current.panTo(
      new window.kakao.maps.LatLng(point.yAxis, point.xAxis),
    );
  }, []);

  // 지도 생성 시에는 인스턴스와 확대 범위만 설정한다.
  // 출발지 이동을 여기서 수행하면 상태 변경 때마다 onCreate가 다시 실행되어
  // 사용자가 클릭한 계획·추천 장소 대신 출발지로 포커스가 돌아간다.
  const handleMapCreate = useCallback((map) => {
    mapRef.current = map;
    setMapInstance(map);
    map.setMaxLevel(14);
    map.setMinLevel(2);
    setMapLevel(map.getLevel());
  }, []);

  const handleMapZoomChanged = useCallback((map) => {
    setMapLevel(map.getLevel());
  }, []);

  const applyGimpoCityHallFallback = useCallback(() => {
    setPlanOrigin(GIMPO_CITY_HALL);
    setPlanOriginStatus("fallback");
    moveMapToPlanPoint(GIMPO_CITY_HALL);
  }, [moveMapToPlanPoint]);

  // 계획 모드: 브라우저 위치를 우선 사용하고 실패하면 사용자가 이동 가능한 김포시청 핀을 제공한다.
  const requestCurrentPlanLocation = useCallback(() => {
    const requestId = planLocationRequestRef.current + 1;
    planLocationRequestRef.current = requestId;
    // 브라우저 위치 확인이 지연되거나 권한 선택을 기다리는 동안에도 시작 핀이 보이도록
    // 김포시청을 즉시 임시 위치로 표시하고, 성공 응답이 오면 실제 위치로 교체한다.
    setPlanOrigin(GIMPO_CITY_HALL);
    setPlanOriginStatus("loading");
    moveMapToPlanPoint(GIMPO_CITY_HALL);

    if (!navigator.geolocation) {
      applyGimpoCityHallFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (requestId !== planLocationRequestRef.current) return;
        const currentLocation = {
          placeName: "현재 위치",
          address: "브라우저에서 확인한 현재 위치",
          xAxis: coords.longitude,
          yAxis: coords.latitude,
          locationSource: "geolocation",
        };
        setPlanOrigin(currentLocation);
        setPlanOriginStatus("success");
        moveMapToPlanPoint(currentLocation);
      },
      () => {
        if (requestId !== planLocationRequestRef.current) return;
        applyGimpoCityHallFallback();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }, [applyGimpoCityHallFallback, moveMapToPlanPoint]);

  useEffect(() => {
    if (!isPlanMode || !planOwnerKey) return undefined;

    const initializationTimer = window.setTimeout(() => {
      // 계획 모드 진입 시 이전 길찾기 결과가 계획 직선과 겹치지 않도록 길찾기 화면 상태만 비운다.
      setIsRouteOpen(false);
      setRouteOrigin(null);
      setRouteDestination(null);
      setMapPickMode(null);
      setSelectedRoute(null);
      setIsPlanPanelOpen(true);
      const saved = getSavedTrip(planOwnerKey, requestedSavedPlanId, TRAVEL_PLAN_KIND.PLAN);
      if (saved) {
        planLocationRequestRef.current += 1;
        setPlanOrigin(saved.origin);
        setPlanPlaces(saved.places);
        setActivePlanId(saved.id);
        setPlanOriginStatus("restored");
        setPlanRecommendationPins([]);
        setPlanDetailPlace(null);
        setTop10Overlay(null);
        moveMapToPlanPoint(saved.origin);
        return;
      }
      if (requestedSavedPlanId) {
        setAlertMessage("저장된 여행을 찾을 수 없습니다. 현재 계정과 브라우저의 저장 목록을 확인해주세요.");
        setIsAlertModalOpen(true);
      }
      const draft = readTravelPlanDraft(planOwnerKey);
      if (draft) {
        setPlanOrigin(draft.origin);
        setPlanPlaces(draft.places);
        setPlanOriginStatus("restored");
        moveMapToPlanPoint(draft.places.at(-1) || draft.origin);
      } else {
        setPlanPlaces([]);
        requestCurrentPlanLocation();
      }
    }, 0);

    return () => {
      window.clearTimeout(initializationTimer);
      planLocationRequestRef.current += 1;
    };
  }, [
    isPlanMode,
    moveMapToPlanPoint,
    planOwnerKey,
    requestCurrentPlanLocation,
    requestedSavedPlanId,
  ]);

  useEffect(() => {
    if (!isTravelMode || !planOwnerKey) return undefined;

    const restoreTimer = window.setTimeout(() => {
      setSavedPlans(
        readTravelPlans(planOwnerKey, undefined, TRAVEL_PLAN_KIND.PLAN),
      );
      setSavedRecommendationPlans(
        readTravelPlans(
          planOwnerKey,
          undefined,
          TRAVEL_PLAN_KIND.RECOMMENDATION,
        ),
      );
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, [isTravelMode, planOwnerKey]);

  useEffect(() => {
    if (!isRecommendationMode || !planOwnerKey) return undefined;

    const initializationTimer = window.setTimeout(() => {
      setIsRouteOpen(false);
      setRouteOrigin(null);
      setRouteDestination(null);
      setMapPickMode(null);
      setSelectedRoute(null);
      setRecommendationCourse(null);
      setPlanDetailPlace(null);
      setIsRecommendationPanelOpen(true);
      const saved = getSavedTrip(planOwnerKey, requestedSavedPlanId, TRAVEL_PLAN_KIND.RECOMMENDATION);
      if (saved) {
        planLocationRequestRef.current += 1;
        setPlanOrigin(saved.origin);
        setPlanOriginStatus("restored");
        setActivePlanId(saved.id);
        setRecommendationCourse({
          courseSignature: `saved-${saved.places.map((place) => place.placeNo).join("-")}`,
          placeCount: saved.places.length,
          totalDistanceMeters: null,
          places: saved.places.map((place) => ({ ...place, distanceFromPreviousMeters: null })),
          isSaved: true,
        });
        setTop10Overlay(null);
        moveMapToPlanPoint(saved.origin);
        return;
      }
      if (requestedSavedPlanId) {
        setAlertMessage("저장된 여행을 찾을 수 없습니다. 현재 계정과 브라우저의 저장 목록을 확인해주세요.");
        setIsAlertModalOpen(true);
      }
      requestCurrentPlanLocation();
    }, 0);

    return () => {
      window.clearTimeout(initializationTimer);
      planLocationRequestRef.current += 1;
    };
  }, [isRecommendationMode, planOwnerKey, requestedSavedPlanId, moveMapToPlanPoint, requestCurrentPlanLocation]);

  useEffect(() => {
    if (!isRecommendationMode || !planOrigin) return undefined;

    const controller = new AbortController();
    const requestTimer = window.setTimeout(() => {
      setRecommendationNearbyPlaces([]);
      setRecommendationNearbyState("loading");

      PlanAPI.getNearbyPlaces(planOrigin.xAxis, planOrigin.yAxis, controller.signal)
        .then((places) => {
          if (controller.signal.aborted) return;
          setRecommendationNearbyPlaces(
          toValidPins(places).filter(
            (place) => ![2, 10].includes(Number(place.typeNo)),
          ),
          );
          setRecommendationNearbyState("success");
        })
        .catch((nearbyError) => {
          if (nearbyError?.name === "CanceledError" || controller.signal.aborted) return;
          console.error("추천 시작 위치 주변의 장소를 불러오지 못했습니다.", nearbyError);
          setRecommendationNearbyPlaces([]);
          setRecommendationNearbyState("error");
        });
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, [isRecommendationMode, planOrigin]);

  const handleRecommendationCourseChange = useCallback((course) => {
    setRecommendationCourse(course);
    setTop10Overlay(null);
    setPlanDetailPlace(null);
  }, []);

  useEffect(() => {
    if (!isPlanMode || !planOwnerKey || !planOrigin) return;
    saveTravelPlanDraft({
      ownerKey: planOwnerKey,
      origin: planOrigin,
      places: planPlaces,
    });
  }, [isPlanMode, planOrigin, planOwnerKey, planPlaces]);

  const handlePlanRecommendationsChange = useCallback((places) => {
    setPlanRecommendationPins(toValidPins(places));
    setTop10Overlay(null);
    setPlanDetailPlace(null);
  }, []);

  const handlePlanPlacePreview = useCallback((place) => {
    setTop10Overlay({ ...place, isExternal: false });
    setPlanDetailPlace(null);
    moveMapToPlanPoint(place);
  }, [moveMapToPlanPoint]);

  const handlePlanAddPlace = useCallback(
    (place) => {
      if (!place?.placeNo) return false;
      if (planPlaces.some((item) => String(item.placeNo) === String(place.placeNo))) {
        setAlertMessage("이미 계획에 추가한 장소입니다.");
        setIsAlertModalOpen(true);
        return false;
      }
      if (planPlaces.length >= MAX_TRAVEL_PLAN_PLACES) {
        setAlertMessage("계획에는 장소를 최대 10개까지 추가할 수 있습니다.");
        setIsAlertModalOpen(true);
        return false;
      }

      const nextPlace = {
        ...place,
        xAxis: Number(place.xAxis ?? place.X_AXIS),
        yAxis: Number(place.yAxis ?? place.Y_AXIS),
      };
      setPlanPlaces((current) => [...current, nextPlace]);
      setPlanRecommendationPins([]);
      setTop10Overlay(null);
      setPlanDetailPlace(null);
      setIsPlanPanelOpen(true);
      moveMapToPlanPoint(nextPlace);
      return true;
    },
    [moveMapToPlanPoint, planPlaces],
  );

  const handlePlanRemovePlace = useCallback((index) => {
    setPlanPlaces((current) => current.slice(0, index));
    setPlanRecommendationPins([]);
    setTop10Overlay(null);
    setPlanDetailPlace(null);
  }, []);

  const handleSaveTravelPlan = useCallback(
    (name) => {
      const saved = saveTravelPlan({
        id: activePlanId,
        ownerKey: planOwnerKey,
        kind: TRAVEL_PLAN_KIND.PLAN,
        name,
        origin: planOrigin,
        places: planPlaces,
      });
      if (!saved) {
        setAlertMessage("계획 이름과 한 개 이상의 장소를 확인해주세요.");
        setIsAlertModalOpen(true);
        return null;
      }
      clearTravelPlanDraft(planOwnerKey);
      setSavedPlans(
        readTravelPlans(planOwnerKey, undefined, TRAVEL_PLAN_KIND.PLAN),
      );
      setActivePlanId(saved.id);
      return saved;
    },
    [activePlanId, planOrigin, planOwnerKey, planPlaces],
  );

  const handleOpenSavedPlan = useCallback(
    (plan) => {
      planLocationRequestRef.current += 1;
      setPlanOrigin(plan.origin);
      setPlanPlaces(plan.places);
      setPlanOriginStatus("restored");
      setPlanRecommendationPins([]);
      setTop10Overlay(null);
      setPlanDetailPlace(null);
      setActivePlanId(plan.id);
      setIsPlanPanelOpen(true);
      moveMapToPlanPoint(plan.origin);
    },
    [moveMapToPlanPoint],
  );

  const handleDeleteSavedPlan = useCallback(
    (planId) => {
      deleteTravelPlan(planOwnerKey, planId);
      setSavedPlans(
        readTravelPlans(planOwnerKey, undefined, TRAVEL_PLAN_KIND.PLAN),
      );
      if (activePlanId === planId) setActivePlanId(null);
    },
    [activePlanId, planOwnerKey],
  );

  const handleSaveRecommendationPlan = useCallback(() => {
    const places = toValidPins(recommendationCourse?.places || []);
    if (places.length === 0) return false;

    const savedAt = new Date();
    const saved = saveTravelPlan({
      ownerKey: planOwnerKey,
      kind: TRAVEL_PLAN_KIND.RECOMMENDATION,
      name: `추천 코스 ${savedAt.toLocaleDateString("ko-KR")} ${savedAt.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      origin: planOrigin,
      places,
    });
    if (!saved) return false;

    setSavedRecommendationPlans(
      readTravelPlans(
        planOwnerKey,
        undefined,
        TRAVEL_PLAN_KIND.RECOMMENDATION,
      ),
    );
    setActivePlanId(saved.id);
    return true;
  }, [planOrigin, planOwnerKey, recommendationCourse]);

  const handleDeleteSavedRecommendationPlan = useCallback(
    (planId) => {
      deleteTravelPlan(planOwnerKey, planId);
      setSavedRecommendationPlans(
        readTravelPlans(
          planOwnerKey,
          undefined,
          TRAVEL_PLAN_KIND.RECOMMENDATION,
        ),
      );
      if (activePlanId === planId) setActivePlanId(null);
    },
    [activePlanId, planOwnerKey],
  );

  const handleOpenSavedRecommendation = useCallback(
    (plan) => {
      planLocationRequestRef.current += 1;
      const places = toValidPins(plan?.places || []);
      if (!plan?.origin || places.length === 0) return;

      setPlanOrigin(plan.origin);
      setPlanOriginStatus("restored");
      setActivePlanId(plan.id);
      setRecommendationCourse({
        courseSignature: `saved-${places.map((place) => place.placeNo).join("-")}`,
        placeCount: places.length,
        totalDistanceMeters: null,
        places: places.map((place) => ({
          ...place,
          distanceFromPreviousMeters: null,
        })),
        isSaved: true,
      });
      setTop10Overlay(null);
      setPlanDetailPlace(null);
      setIsRecommendationPanelOpen(true);
      moveMapToPlanPoint(plan.origin);
    },
    [moveMapToPlanPoint],
  );

  const handleStartNewPlan = useCallback(() => {
    clearTravelPlanDraft(planOwnerKey);
    setPlanPlaces([]);
    setPlanRecommendationPins([]);
    setTop10Overlay(null);
    setPlanDetailPlace(null);
    setActivePlanId(null);
    requestCurrentPlanLocation();
  }, [planOwnerKey, requestCurrentPlanLocation]);

  const openPlanPlaceDetail = useCallback(async (place) => {
    if (!place?.placeNo) return;
    setPlanDetailPlace(place);
    try {
      const response = await PlaceAPI.getPlaceDetail(place.placeNo);
      const detail = response?.data ?? response;
      setPlanDetailPlace((current) =>
        String(current?.placeNo) === String(place.placeNo)
          ? { ...place, ...detail }
          : current,
      );
    } catch (detailError) {
      console.error("계획 장소 상세 정보를 불러오지 못했습니다.", detailError);
    }
  }, []);

  const handleRecommendationPlacePreview = useCallback(
    (place) => {
      moveMapToPlanPoint(place);
      openPlanPlaceDetail(place);
    },
    [moveMapToPlanPoint, openPlanPlaceDetail],
  );
  const restaurantPins =
    isCourseMapView && restaurantMap?.key === courseLocation.key
      ? restaurantMap.places
      : EMPTY_RESTAURANTS;
  const handleRestaurantsChange = useCallback(
    (places) => {
      setRestaurantMap({
        key: courseLocation.key,
        places: places.filter(isCoursePoint),
      });
    },
    [courseLocation.key],
  );
  const handleRestaurantSelect = (place) => {
    const map = mapRef.current;
    const center = map?.getCenter();
    const background = isCourseRestaurantDetail
      ? courseLocation
      : {
          pathname: courseLocation.pathname,
          key: courseLocation.key,
          courseNo,
          userCourseId,
          viewport: center
            ? {
                lat: center.getLat(),
                lng: center.getLng(),
                level: map.getLevel(),
              }
            : null,
        };
    restaurantViewportRef.current = {
      key: background.key,
      viewport: background.viewport,
    };
    navigate(`/place/${place.placeNo}`, {
      replace: isCourseRestaurantDetail,
      state: {
        courseBackground: background,
        restaurantPlace: {
          ...place,
          xAxis: Number(place.X_AXIS ?? place.xAxis),
          yAxis: Number(place.Y_AXIS ?? place.yAxis),
        },
      },
    });
  };
  // 현재 URL의 요청 결과만 사용해 다른 코스를 열 때 이전 경로가 남지 않게 한다.
  const courseRouteData =
    isFixedCourseDetail || isUserCourseDetail
      ? fixedCourseMap?.key === courseLocation.key
        ? fixedCourseMap.routeData
        : null
      : customRoute;
  const selectedRoute = useMemo(() => {
    if (!isCourseMapView) return isCourseView ? null : generalRoute;
    const route = getCourseRoute(courseRouteData);
    return route
      ? { ...route, transportType: courseRouteData.transportType }
      : null;
  }, [isCourseMapView, isCourseView, generalRoute, courseRouteData]);
  const coursePins = useMemo(
    () =>
      isCourseMapView && courseRouteData
        ? [
            courseRouteData.origin,
            ...(courseRouteData.waypoints || []),
            courseRouteData.destination,
          ].filter(isCoursePoint)
        : [],
    [courseRouteData, isCourseMapView],
  );

  const baseSelectedPlace = useMemo(
    () =>
      placeNo
        ? pins.find((pin) => String(pin.placeNo) === String(placeNo)) ||
          (String(location.state?.restaurantPlace?.placeNo) === String(placeNo)
            ? location.state.restaurantPlace
            : null)
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
      baseSelectedPlace && overlayDetail?.placeNo === baseSelectedPlace.placeNo
        ? overlayDetail.data
        : null;
    return baseSelectedPlace ? { ...baseSelectedPlace, ...detail } : null;
  }, [baseSelectedPlace, overlayDetail]);

  const isDetailOpen = Boolean(placeNo && selectedPlace);
  const mapDetailPlace = isTravelMode ? planDetailPlace : selectedPlace;

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
    const existingPin = pins.find(
      (p) => String(p.placeNo) === String(place.placeNo),
    );
    if (existingPin) {
      setTop10Overlay({ ...existingPin, isExternal: false });
      if (mapRef.current) {
        mapRef.current.panTo(
          new window.kakao.maps.LatLng(existingPin.yAxis, existingPin.xAxis),
        );
      }
    } else {
      // 2. 핀에 없으면 카카오 주소 검색으로 좌표 가져오기
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(place.addr, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            const geocodedPlace = {
              ...place,
              yAxis: lat,
              xAxis: lng,
              isExternal: true,
            };
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
    setIsTagFilterOpen(false);
  };

  // DB 장소 필터 연동: 타입과 태그 선택을 함께 유지하고 PK 조건을 AND로 조회한다.
  const handlePlaceFilter = async (kind, value) => {
    // 필터가 바뀌면 기존 장소 요약 오버레이를 닫고 일반 지도 주소로 복귀한다.
    setTop10Overlay(null);
    if (placeNo) {
      navigate(isPlanMode ? "/map?mode=j" : "/map", {
        state: { hideInitialTop10: true },
      });
    }

    const requestId = filterRequestIdRef.current + 1;
    filterRequestIdRef.current = requestId;

    let nextFilters = { ...placeFilters };
    const showAllTypes = kind === "type" ? value === "all" : isAllTypesSelected;
    if (kind === "type") {
      setIsAllTypesSelected(showAllTypes);
      nextFilters = {
        ...nextFilters,
        typeNo: value && value !== "all" ? Number(value) : null,
        typeDetailNo: null,
      };
    } else if (kind === "detail") {
      nextFilters = { ...nextFilters, typeDetailNo: value ? Number(value) : null };
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
      setFilteredPins(showAllTypes ? pins : []);
      setIsAllPinsVisible(showAllTypes);
      setIsFilterLoading(false);
      return;
    }

    setIsFilterLoading(true);
    setFilterPins([]);
    setFilteredPins([]);
    try {
      const response = await PlaceAPI.getPinsByFilters({
        ...nextFilters,
        typeNo: nextFilters.typeDetailNo ? null : nextFilters.typeNo,
      });

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
      setAlertMessage(
        "장소 필터를 적용하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
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

  const handleRequestMapPick = useCallback(
    (target) => {
      setMapPickMode(target);
      setTop10Overlay(null);
      setIsRouteOpen(true);
      navigate("/map");
    },
    [navigate],
  );

  const handleMapClick = (_map, mouseEvent) => {
    setTop10Overlay(null);

    // 계획·추천 모드: 기존 출발지 선택 방식처럼 다음 지도 클릭 좌표로 시작 핀만 이동한다.
    if (isTravelMode) {
      if (isPlanOriginPickMode && mouseEvent?.latLng) {
        const pickedOrigin = {
          placeName: "지도에서 선택한 시작 위치",
          address: "지도에서 선택한 위치",
          xAxis: mouseEvent.latLng.getLng(),
          yAxis: mouseEvent.latLng.getLat(),
          locationSource: "map",
        };
        setPlanOrigin(pickedOrigin);
        setPlanOriginStatus("picked");
        setPlanRecommendationPins([]);
        setRecommendationCourse(null);
        setPlanDetailPlace(null);
        setIsPlanOriginPickMode(false);
        if (isPlanMode) setIsPlanPanelOpen(true);
        if (isRecommendationMode) setIsRecommendationPanelOpen(true);
      }
      return;
    }

    if (!isCourseView && mapPickMode && mouseEvent?.latLng) {
      const isOrigin = mapPickMode === "origin";
      const pickedPoint = {
        label: isOrigin ? "지도에서 선택한 출발지" : "지도에서 선택한 도착지",
        placeName: isOrigin
          ? "지도에서 선택한 출발지"
          : "지도에서 선택한 도착지",
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

    // 빈 지도 클릭은 현재 목록·검색 상태를 유지하고 말풍선만 닫는다.
    if (isCourseMapView || location.pathname === "/map" || isTop10Route) return;
    if (isFixedCourseView) {
      navigate("/pilgrim/fixed");
      return;
    }
    navigate("/map", { state: { hideInitialTop10: true } });
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
    setSelectedRoute(
      route
        ? {
            ...route,
            transportType: routeResponse?.transportType,
            routePoints,
          }
        : null,
    );
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

  // 길찾기 표시 안정화: 패널 열림 상태에 맞는 여백으로 경로 전체가 보이도록 지도를 조정한다.
  useEffect(() => {
    if (isCourseRestaurantDetail) {
      restaurantViewportRef.current = {
        key: courseLocation.key,
        viewport: courseLocation.viewport,
      };
      return undefined;
    }
    if (
      (!selectedRoute && restaurantPins.length === 0 && coursePins.length === 0) ||
      !mapRef.current ||
      !window.kakao?.maps
    )
      return undefined;

    const delay =
      isRouteOpen || restaurantViewportRef.current?.key === courseLocation.key
        ? 0
        : 320;
    const timeoutId = window.setTimeout(() => {
      const map = mapRef.current;
      const mapPoints =
        restaurantPins.length > 0
          ? toMapPath(restaurantPins)
          : selectedRoute ? getRouteMapPoints(selectedRoute) : toMapPath(coursePins);
      if (!map || mapPoints.length === 0) return;

      map.relayout();
      const snapshot = restaurantViewportRef.current;
      const viewport =
        snapshot?.key === courseLocation.key ? snapshot.viewport : null;
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
      const leftPadding =
        window.innerWidth > 768
          ? isCourseMapView
            ? 500
            : isRouteOpen
              ? 600
              : sidePadding
          : sidePadding;
      const bottomPadding =
        isCourseMapView && window.innerWidth <= 768
          ? Math.round(window.innerHeight * 0.6)
          : 60;
      map.setBounds(bounds, 60, sidePadding, bottomPadding, leftPadding);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [
    isRouteOpen,
    selectedRoute,
    coursePins,
    isCourseMapView,
    loading,
    restaurantPins,
    isCourseRestaurantDetail,
    courseLocation.key,
    courseLocation.viewport,
  ]);

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
  const planMapPoints = useMemo(
    () => [planOrigin, ...planPlaces].filter(Boolean),
    [planOrigin, planPlaces],
  );
  const planMapPath = useMemo(
    () =>
      planMapPoints.map((point) => ({
        lat: Number(point.yAxis ?? point.Y_AXIS),
        lng: Number(point.xAxis ?? point.X_AXIS),
      })),
    [planMapPoints],
  );
  const recommendationPlaces = useMemo(
    () => toValidPins(recommendationCourse?.places || []),
    [recommendationCourse],
  );
  const recommendationMapPoints = useMemo(
    () => [planOrigin, ...recommendationPlaces].filter(Boolean),
    [planOrigin, recommendationPlaces],
  );
  const recommendationMapPath = useMemo(
    () =>
      recommendationMapPoints.map((point) => ({
        lat: Number(point.yAxis ?? point.Y_AXIS),
        lng: Number(point.xAxis ?? point.X_AXIS),
      })),
    [recommendationMapPoints],
  );
  // 길찾기 지도 정리: 결과가 있으면 관계없는 전체 DB 핀을 숨기고 경로 포함 지점만 표시한다.
  const visibleMapPins = useMemo(
    () =>
      isRecommendationMode
        ? []
        : isPlanMode
          ? planRecommendationPins.filter(
              (pin) =>
                !planPlaces.some(
                  (place) => String(place.placeNo) === String(pin.placeNo),
                ),
            )
          : isCourseMapView
            ? coursePins
            : selectedRoute
              ? (selectedRoute.routePoints || []).slice(1, -1)
              : isTop10Route
                ? pins.filter((pin) => top10PlaceNos.has(String(pin.placeNo)))
                : isInitialMapTop10
                  ? pins.filter(isMajorTouristPlace)
                  : filteredPins,
    [
      coursePins,
      filteredPins,
      isCourseMapView,
      isPlanMode,
      isRecommendationMode,
      isTop10Route,
      isInitialMapTop10,
      top10PlaceNos,
      pins,
      planPlaces,
      planRecommendationPins,
      selectedRoute,
    ],
  );
  const recommendationPlaceOptions = useMemo(() => {
    const pinsByPlaceNo = new globalThis.Map(
      pins.map((place) => [String(place.placeNo), place]),
    );
    return recommendationNearbyPlaces.map((place) => ({
      ...pinsByPlaceNo.get(String(place.placeNo)),
      ...place,
      distanceMeters: Number(place.distanceMeters ?? place.distance),
    }));
  }, [pins, recommendationNearbyPlaces]);
  const visiblePinGroups = useMemo(() => {
    const mapsApi = globalThis.kakao?.maps;
    const projection = mapInstance?.getProjection?.();

    if (!Number.isFinite(mapLevel) || !mapsApi?.LatLng || !projection) {
      return groupOverlappingPins(visibleMapPins);
    }

    return groupPinsByScreenDistance(visibleMapPins, (place) => {
      const lat = Number(place?.yAxis ?? place?.Y_AXIS);
      const lng = Number(place?.xAxis ?? place?.X_AXIS);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const point = projection.containerPointFromCoords(
        new mapsApi.LatLng(lat, lng),
      );
      return { x: Number(point?.x), y: Number(point?.y) };
    });
  }, [mapInstance, mapLevel, visibleMapPins]);
  const activeOverlapGroup = overlapSelection
    ? visiblePinGroups.find(
        (group) => group.key === overlapSelection.groupKey,
      ) || null
    : null;
  const activeOverlapIndex = activeOverlapGroup
    ? getCircularPinIndex(
        overlapSelection.index,
        activeOverlapGroup.pins.length,
      )
    : 0;
  const activeOverlapPlace = activeOverlapGroup?.pins[activeOverlapIndex];
  const showOverlapNavigation = Boolean(
    activeOverlapGroup?.pins.length > 1 &&
      String(activeOverlapPlace?.placeNo) === String(top10Overlay?.placeNo),
  );

  const selectOverlappingPlace = (group, index) => {
    const nextIndex = getCircularPinIndex(index, group.pins.length);
    const place = group.pins[nextIndex];
    if (!place) return;

    setOverlapSelection({ groupKey: group.key, index: nextIndex });
    if (isPlanMode) handlePlanPlacePreview(place);
    else handleMarkerClick(place);
  };

  const moveOverlapSelection = (offset) => {
    if (!activeOverlapGroup) return;
    selectOverlappingPlace(activeOverlapGroup, activeOverlapIndex + offset);
  };
  const hasRouteSession = Boolean(
    isRouteOpen || routeOrigin || routeDestination || selectedRoute,
  );
  const searchablePins = hasPlaceFilter ? filterPins : pins;

  const routeSelectionPins = useMemo(
    () =>
      [
        routeOrigin && {
          ...toRoutePlace(routeOrigin),
          markerLabel: "출",
          markerColor: "#2196F3",
        },
        routeDestination && {
          ...toRoutePlace(routeDestination),
          markerLabel: "도",
          markerColor: "#FF5A47",
        },
      ].filter(Boolean),
    [routeOrigin, routeDestination],
  );

  const handleSearchResults = useCallback(
    (results) => {
      // 선택 안 함 상태에서 검색어를 지우면 전체 핀이 자동으로 나타나지 않게 한다.
      if (!hasPlaceFilter && !isAllPinsVisible && results === pins) {
        setFilteredPins([]);
        return;
      }
      setFilteredPins(results);
    },
    [hasPlaceFilter, isAllPinsVisible, pins],
  );

  // 계획 모드: 계획 또는 추천 목록이 바뀌면 관련 장소가 지도 화면 안에 들어오도록 조정한다.
  useEffect(() => {
    if (!isPlanMode || !mapRef.current || !window.kakao?.maps) return;
    const points =
      planRecommendationPins.length > 0
        ? [planPlaces.at(-1) || planOrigin, ...planRecommendationPins]
        : planMapPoints;
    const validPoints = points.filter(
      (point) =>
        Number.isFinite(Number(point?.xAxis ?? point?.X_AXIS)) &&
        Number.isFinite(Number(point?.yAxis ?? point?.Y_AXIS)),
    );
    if (validPoints.length === 0) return;
    if (validPoints.length === 1) {
      moveMapToPlanPoint(validPoints[0]);
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    validPoints.forEach((point) => {
      bounds.extend(
        new window.kakao.maps.LatLng(
          Number(point.yAxis ?? point.Y_AXIS),
          Number(point.xAxis ?? point.X_AXIS),
        ),
      );
    });
    mapRef.current.setBounds(bounds, 80, isPlanPanelOpen ? 440 : 80, 80, 80);
  }, [
    isPlanMode,
    isPlanPanelOpen,
    moveMapToPlanPoint,
    planMapPoints,
    planOrigin,
    planPlaces,
    planRecommendationPins,
  ]);

  // 추천 코스가 바뀌면 시작 위치와 전체 추천 장소가 지도 안에 들어오도록 조정한다.
  useEffect(() => {
    if (!isRecommendationMode || !mapRef.current || !window.kakao?.maps) return;
    const validPoints = recommendationMapPoints.filter(
      (point) =>
        Number.isFinite(Number(point?.xAxis ?? point?.X_AXIS)) &&
        Number.isFinite(Number(point?.yAxis ?? point?.Y_AXIS)),
    );
    if (validPoints.length === 0) return;
    if (validPoints.length === 1) {
      moveMapToPlanPoint(validPoints[0]);
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    validPoints.forEach((point) => {
      bounds.extend(
        new window.kakao.maps.LatLng(
          Number(point.yAxis ?? point.Y_AXIS),
          Number(point.xAxis ?? point.X_AXIS),
        ),
      );
    });
    mapRef.current.setBounds(
      bounds,
      80,
      isRecommendationPanelOpen ? 450 : 80,
      80,
      80,
    );
  }, [
    isRecommendationMode,
    isRecommendationPanelOpen,
    moveMapToPlanPoint,
    recommendationMapPoints,
  ]);

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
        new window.kakao.maps.LatLng(filterPins[0].yAxis, filterPins[0].xAxis),
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
      {!isTop10Screen && <SearchPanel
        pins={searchablePins}
        onPlaceSelect={hasPlaceFilter || isAllPinsVisible ? handleTop10PlaceSelect : handlePlaceSelect}
        showFilteredResults={hasPlaceFilter || isAllPinsVisible}
        filtersLoading={isFilterLoading}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        isVisible={
          !isTravelMode && !isDetailOpen && !hasRouteSession && !isCourseView
        }
        onSearchResults={handleSearchResults}
        onSetOrigin={openRouteWithOrigin}
        onSetDestination={openRouteWithDestination}
      />}

      {/* 계획 모드: 기존 지도 기능은 유지하고 추천·계획 상태만 독립 패널에서 관리한다. */}
      {isPlanMode && (
        <PlanModePanel
          key={`plan-mode-${location.key}`}
          isOpen={isPlanPanelOpen && !planDetailPlace}
          initialView={requestedSavedPlanId ? "plan" : location.state?.planView === "saved" ? "saved" : "category"}
          initialPlanName={getSavedTrip(planOwnerKey, requestedSavedPlanId, TRAVEL_PLAN_KIND.PLAN)?.name || ""}
          origin={planOrigin}
          originStatus={planOriginStatus}
          typeOptions={typeOptions}
          places={planPlaces}
          savedPlans={savedPlans}
          activePlanId={activePlanId}
          onClose={() => setIsPlanPanelOpen(false)}
          onOpen={() => setIsPlanPanelOpen(true)}
          onRequestCurrentLocation={requestCurrentPlanLocation}
          onRequestOriginPick={() => {
            setIsPlanOriginPickMode(true);
            setTop10Overlay(null);
            setPlanDetailPlace(null);
            setIsPlanPanelOpen(false);
          }}
          onRecommendationsChange={handlePlanRecommendationsChange}
          onPreviewPlace={handlePlanPlacePreview}
          onAddPlace={handlePlanAddPlace}
          onRemovePlace={handlePlanRemovePlace}
          onSavePlan={handleSaveTravelPlan}
          onOpenSavedPlan={handleOpenSavedPlan}
          onDeleteSavedPlan={handleDeleteSavedPlan}
          onStartNewPlan={handleStartNewPlan}
        />
      )}

      {isRecommendationMode && (
        <RecommendationModePanel
          key={`recommendation-mode-${location.key}`}
          initialView={location.state?.recommendationView === "saved" ? "saved" : "recommend"}
          isOpen={isRecommendationPanelOpen && !planDetailPlace}
          origin={planOrigin}
          originStatus={planOriginStatus}
          placeOptions={recommendationPlaceOptions}
          placeOptionsStatus={recommendationNearbyState}
          tagOptions={tagOptions}
          course={recommendationCourse}
          savedCourses={savedRecommendationPlans}
          activePlanId={activePlanId}
          onClose={() => setIsRecommendationPanelOpen(false)}
          onOpen={() => setIsRecommendationPanelOpen(true)}
          onRequestCurrentLocation={() => {
            setRecommendationCourse(null);
            requestCurrentPlanLocation();
          }}
          onRequestOriginPick={() => {
            setIsPlanOriginPickMode(true);
            setRecommendationCourse(null);
            setTop10Overlay(null);
            setPlanDetailPlace(null);
            setIsRecommendationPanelOpen(false);
          }}
          onCourseChange={handleRecommendationCourseChange}
          onPreviewPlace={handleRecommendationPlacePreview}
          onSaveCourse={handleSaveRecommendationPlan}
          onOpenSavedCourse={handleOpenSavedRecommendation}
          onDeleteSavedCourse={handleDeleteSavedRecommendationPlan}
        />
      )}

      {isFixedCourseView && !isFixedCourseDetail && !isUserCourseDetail && (
        <FixedCoursePanel
          key={location.key}
          selectedCourseNo={courseNo}
          showUserCourses={Boolean(location.state?.showUserCourses)}
          onCreateCourse={() => navigate("/pilgrim/create")}
          onUserCourseSelect={(course) =>
            navigate(`/pilgrim/fixed/mine/${encodeURIComponent(course.id)}`)
          }
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
            onClose={() => navigate("/pilgrim/fixed")}
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
            onClose={() =>
              navigate("/pilgrim/fixed", { state: { showUserCourses: true } })
            }
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
        isOpen={isRouteOpen && !isCourseView && !isTravelMode}
        initialOrigin={routeOrigin}
        initialDestination={routeDestination}
        onClose={endRoute}
        onRouteSelect={handleRouteSelect}
        onPointsChange={handleRoutePointsChange}
        onRequestMapPick={handleRequestMapPick}
        mapPickMode={mapPickMode}
      />

      {/* 길찾기 패널 표시 전환: 경로 상태는 유지하고 패널만 접거나 다시 연다. */}
      {!isTravelMode && !isCourseView && hasRouteSession && (
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

      {!isTop10Screen && !isTravelMode && !isFixedCourseView && !isCustomCourseView && (
        <FloatingTags>
          <TagList $isOpen={isTagsOpen}>
            <FilterSelect
              aria-label="장소 종류 선택"
              value={placeFilters.typeNo || (isAllTypesSelected ? "all" : "")}
              $isActive={Boolean(placeFilters.typeNo) || isAllTypesSelected}
              disabled={isFilterLoading}
              onChange={(event) => handlePlaceFilter("type", event.target.value)}
            >
              <option value="">장소 종류 선택</option>
              <option value="all">모든 장소</option>
              {groupedTypeOptions.map((group) => (
                <option key={group.typeNo} value={group.typeNo}>{group.type}</option>
              ))}
            </FilterSelect>
            {selectedTypeGroup && (
              <FilterSelect
                aria-label="세부 종류 선택"
                value={placeFilters.typeDetailNo || ""}
                $isActive={Boolean(placeFilters.typeDetailNo)}
                disabled={isFilterLoading}
                onChange={(event) => handlePlaceFilter("detail", event.target.value)}
              >
                <option value="">{selectedTypeGroup.type} 전체</option>
                {selectedTypeGroup.details.map((detail) => (
                  <option key={detail.typeDetailNo} value={detail.typeDetailNo}>
                    {detail.typeDetailContent}
                  </option>
                ))}
              </FilterSelect>
            )}
            <FilterResetButton
              type="button"
              $isActive={Boolean(placeFilters.tagNo)}
              aria-expanded={isTagFilterOpen}
              aria-controls="map-tag-filter"
              onClick={() => setIsTagFilterOpen((open) => !open)}
            >
              {selectedTag ? '# ' + selectedTag.tagContent : '태그 필터'}
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
          {isTagsOpen && isTagFilterOpen && (
            <TagFilterPopover id="map-tag-filter" aria-label="태그 필터"
              onKeyDown={(event) => { if (event.key === "Escape") setIsTagFilterOpen(false); }}>
              <header><strong>태그 선택</strong><button type="button" onClick={() => setIsTagFilterOpen(false)} aria-label="태그 필터 닫기">닫기</button></header>
              <div className="tag-options">
                <TagFilterChip type="button" $active={!placeFilters.tagNo}
                  aria-pressed={!placeFilters.tagNo} disabled={isFilterLoading}
                  onClick={() => handlePlaceFilter("tag", "")}>전체</TagFilterChip>
                {tagOptions.map((tag) => {
                  const active = String(placeFilters.tagNo) === String(tag.tagNo);
                  return <TagFilterChip key={tag.tagNo} type="button" $active={active}
                    aria-pressed={active} disabled={isFilterLoading}
                    onClick={() => handlePlaceFilter("tag", active ? "" : String(tag.tagNo))}>
                    # {tag.tagContent}
                  </TagFilterChip>;
                })}
              </div>
            </TagFilterPopover>
          )}
        </FloatingTags>
      )}

      {/* 지도 좌표 길찾기: DB 장소를 먼저 고르지 않아도 지도에서 출발·도착 핀을 바로 생성한다. */}
      {!isTop10Screen && !isTravelMode && !isCourseView && !loading && !error && (
        <MapPinToolbar aria-label="지도 길찾기 핀 생성">
          <MapPinCreateButton
            type="button"
            $color="#2196F3"
            $active={mapPickMode === "origin"}
            onClick={() => handleRequestMapPick("origin")}
            aria-pressed={mapPickMode === "origin"}
            title="지도에서 출발지 핀 생성"
          >
            <span>
              <i>출</i>
            </span>
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
            <span>
              <i>도</i>
            </span>
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
          {(!isCourseView && (isPlanMode ? isPlanOriginPickMode : mapPickMode)) && (
            <MapPickNotice role="status">
              지도에서 {isPlanOriginPickMode ? (isRecommendationMode ? "추천 시작 위치" : "계획 시작 위치") : mapPickMode === "origin" ? "출발지" : "도착지"}로 사용할 위치를 클릭하세요.
              <button
                type="button"
                onClick={() => {
                  setMapPickMode(null);
                  setIsPlanOriginPickMode(false);
                  if (isPlanMode) setIsPlanPanelOpen(true);
                  if (isRecommendationMode) setIsRecommendationPanelOpen(true);
                }}
              >
                취소
              </button>
            </MapPickNotice>
          )}
          <Map
            mapTypeId="ROADMAP"
            center={{ lat: 37.665, lng: 126.59 }}
            style={{ width: "100%", height: "100%" }}
            level={8}
            onCreate={handleMapCreate}
            onZoomChanged={handleMapZoomChanged}
            onClick={handleMapClick}
          >
            {isCourseMapView
              ? visibleMapPins.map((pin, index) => {
                  const lat = Number(pin.Y_AXIS ?? pin.yAxis);
                  const lng = Number(pin.X_AXIS ?? pin.xAxis);

                  return (
                    <MapMarker
                      key={pin.routeMarkerKey || pin.placeNo || index}
                      position={{ lat, lng }}
                      title={`${pin.placeName || "코스 장소"}${pin === courseRouteData.origin ? " · 출발" : pin === courseRouteData.destination ? " · 도착" : " · 경유"}`}
                      image={pin === courseRouteData.origin
                        ? getRoutePointMarkerImage("출", "#FF7043")
                        : pin === courseRouteData.destination
                          ? getRoutePointMarkerImage("도", "#475569")
                          : getCourseMarkerImage(index)}
                      zIndex={12}
                      clickable={false}
                    />
                  );
                })
              : visiblePinGroups.map((group) => (
                  <OverlappingPlaceMarker
                    key={group.key}
                    group={group}
                    activeIndex={
                      overlapSelection?.groupKey === group.key
                        ? overlapSelection.index
                        : 0
                    }
                    disabled={Boolean(selectedRoute)}
                    onPlaceClick={selectOverlappingPlace}
                  />
                ))}

            {isPlanMode && planOrigin && (
              <MapMarker
                position={{ lat: planOrigin.yAxis, lng: planOrigin.xAxis }}
                title={planOrigin.placeName}
                image={getRoutePointMarkerImage("출", "#FF7043")}
                zIndex={50}
                clickable={false}
              />
            )}

            {isRecommendationMode && planOrigin && (
              <MapMarker
                position={{ lat: planOrigin.yAxis, lng: planOrigin.xAxis }}
                title={planOrigin.placeName}
                image={getRoutePointMarkerImage("출", "#FF7043")}
                zIndex={50}
                clickable={false}
              />
            )}

            {isPlanMode &&
              planPlaces.map((place) => (
                <CustomOverlayMap
                  key={`plan-place-${place.placeNo}`}
                  position={{ lat: place.yAxis, lng: place.xAxis }}
                  yAnchor={1}
                  zIndex={45}
                  clickable
                >
                  <PlaceCategoryMarker
                    place={place}
                    onClick={() => handlePlanPlacePreview(place)}
                  />
                </CustomOverlayMap>
              ))}

            {/* 숫자 대신 타입 마커를 사용하므로 순례자길과 같은 화살표로 방문 방향을 표시한다. */}
            {isPlanMode && planMapPath.length > 1 && (
              <CourseRouteLine path={planMapPath} />
            )}

            {isRecommendationMode &&
              recommendationPlaces.map((place) => (
                <CustomOverlayMap
                  key={`recommendation-place-${place.placeNo}`}
                  position={{ lat: place.yAxis, lng: place.xAxis }}
                  yAnchor={1}
                  zIndex={45}
                  clickable
                >
                  <PlaceCategoryMarker
                    place={place}
                    onClick={() => handleRecommendationPlacePreview(place)}
                  />
                </CustomOverlayMap>
              ))}

            {/* 추천 순서는 순례자길과 같은 화살표 경로로 구분한다. */}
            {isRecommendationMode && recommendationMapPath.length > 1 && (
              <CourseRouteLine path={recommendationMapPath} />
            )}

            {!isTravelMode && !isCourseView &&
              routeSelectionPins.map((pin) => (
                <MapMarker
                  key={`route-selection-${pin.markerLabel}`}
                  position={{ lat: pin.Y_AXIS, lng: pin.X_AXIS }}
                  title={pin.placeName}
                  image={getRoutePointMarkerImage(
                    pin.markerLabel,
                    pin.markerColor,
                  )}
                  zIndex={40}
                  clickable={false}
                />
              ))}

            {restaurantPins.map((place) => (
              <MapMarker
                key={"restaurant-" + place.placeNo}
                position={{
                  lat: Number(place.Y_AXIS ?? place.yAxis),
                  lng: Number(place.X_AXIS ?? place.xAxis),
                }}
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
            {!isTravelMode && !isCourseView && (
              <RoutePolylineLayer
                key={`route-layer-${routeRenderRevision}`}
                revision={routeRenderRevision}
                segments={selectedMapSegments}
                fallbackPath={selectedMapPath}
                fallbackColor={
                  isWalkingRoute
                    ? ROUTE_SEGMENT_COLORS.WALKING
                    : ROUTE_SEGMENT_COLORS.GENERAL_BUS
                }
                fallbackStyle={isWalkingRoute ? "shortdash" : "solid"}
              />
            )}

            {selectedPlace && !top10Overlay && !selectedRoute && (
              <CustomOverlayMap
                position={{
                  lat: selectedPlace.yAxis,
                  lng: selectedPlace.xAxis,
                }}
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
                        {isPlanMode ? (
                          <button
                            className="btn-plan"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePlanAddPlace(selectedPlace);
                            }}
                          >
                            계획에 추가
                          </button>
                        ) : (
                          <>
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
                          </>
                        )}
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
                          if (isPlanMode) openPlanPlaceDetail(selectedPlace);
                          else navigate(`/place/${selectedPlace.placeNo}`);
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
                    {showOverlapNavigation && (
                      <OverlapNavigation aria-label="겹친 장소 이동">
                        <button
                          type="button"
                          aria-label="이전 장소"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOverlapSelection(-1);
                          }}
                        >
                          ‹
                        </button>
                        <span>
                          {activeOverlapIndex + 1} / {activeOverlapGroup.pins.length}
                        </span>
                        <button
                          type="button"
                          aria-label="다음 장소"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOverlapSelection(1);
                          }}
                        >
                          ›
                        </button>
                      </OverlapNavigation>
                    )}
                    <div className="header-row">
                      <OverlayTitle>{top10Overlay.placeName}</OverlayTitle>
                      <div className="action-buttons">
                        {isPlanMode ? (
                          <button
                            className="btn-plan"
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePlanAddPlace(top10Overlay);
                            }}
                          >
                            계획에 추가
                          </button>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>

                    <div className="sub-row">
                      {!top10Overlay.isExternal &&
                        Number.isFinite(top10Overlay.reviewCount) && (
                          <span className="review-count">
                            리뷰 {top10Overlay.reviewCount}
                          </span>
                        )}
                      {!top10Overlay.isExternal &&
                        Number.isFinite(top10Overlay.avgRating) && (
                          <span className="rating">
                            <span className="star">⭐</span>{" "}
                            {top10Overlay.avgRating.toFixed(1)}
                          </span>
                        )}
                      <span
                        className="detail-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlanMode) openPlanPlaceDetail(top10Overlay);
                          else {
                            // 더미 데이터의 placeNo가 카카오나 DB와 어떻게 연결될지에 따라 다름
                            // 일단 DB 핀인 경우에만 정상 동작하도록 placeNo 사용
                            navigate(`/place/${top10Overlay.placeNo}`);
                          }
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
                          <span className="addr-value">
                            {top10Overlay.addrDetail}
                          </span>
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
      {!isTravelMode && !isCourseView &&
        selectedRoute?.transportType === "PUBLIC_TRANSIT" && (
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
        key={mapDetailPlace?.placeNo ?? "closed"}
        place={mapDetailPlace}
        isOpen={
          isTravelMode
            ? Boolean(planDetailPlace)
            : isDetailOpen && (!isRouteOpen || isCourseView)
        }
        onClose={() => {
          if (isTravelMode) {
            setPlanDetailPlace(null);
            if (isPlanMode) setIsPlanPanelOpen(true);
            if (isRecommendationMode) setIsRecommendationPanelOpen(true);
          } else if (isCourseRestaurantDetail) navigate(-1);
          else navigate(location.state?.courseReturnTo || "/map");
        }}
        isBookmarked={
          mapDetailPlace
            ? (bookmarks[mapDetailPlace.placeNo] ??
              Boolean(mapDetailPlace.bookmarked))
            : false
        }
        onBookmark={(e) =>
          mapDetailPlace && toggleBookmark(e, mapDetailPlace.placeNo)
        }
        onFindRoute={
          isPlanMode
            ? (place) => handlePlanAddPlace(place)
            : isRecommendationMode
              ? () => {
                  setPlanDetailPlace(null);
                  setIsRecommendationPanelOpen(true);
                }
              : openRouteWithDestination
        }
        primaryActionLabel={
          isPlanMode
            ? "계획에 추가"
            : isRecommendationMode
              ? "추천 코스로 돌아가기"
              : "경로찾기"
        }
      />

      <Top10Panel
        isOpen={isTop10Screen}
        title={isInitialMapTop10 ? "주요 관광지" : "TOP 10"}
        places={isInitialMapTop10 ? visibleMapPins : undefined}
        placesLoading={pinsState === "loading"}
        onPlacesLoaded={setTop10Places}
        onClose={() => {
          setTop10Overlay(null);
          setDismissedTop10Entry(location.key);
          if (isTop10Route) {
            navigate("/map", { state: { hideInitialTop10: true } });
          }
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
