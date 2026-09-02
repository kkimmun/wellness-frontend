import { useEffect, useRef, useState } from "react";
import {
  FaBicycle,
  FaBus,
  FaCar,
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
  FaLocationArrow,
  FaSearch,
  FaTimes,
  FaWalking,
} from "react-icons/fa";
import { RouteAPI } from "../../../api/route";
import {
  AddWaypointButton,
  EmptyState,
  FindRouteButton,
  IconButton,
  InlineState,
  LocationButton,
  OptionButton,
  OptionGrid,
  PointFields,
  PointInput,
  PointRow,
  RouteBody,
  RouteCard,
  RouteCardButton,
  RouteExpandIcon,
  RouteHeader,
  RoutePanelContainer,
  RouteResultsSection,
  SearchResultButton,
  SearchResults,
  SectionHeader,
  SelectRow,
  Spinner,
  TransportButton,
  TransportTabs,
  WaypointRow,
  WaypointSection,
} from "./RoutePanel.styles";
import TransitRouteDetails from "./TransitRouteDetails";

const TRANSPORTS = [
  { value: "CAR", label: "자동차", icon: FaCar },
  { value: "PUBLIC_TRANSIT", label: "대중교통", icon: FaBus },
  { value: "BICYCLE", label: "자전거", icon: FaBicycle },
  { value: "WALK", label: "도보", icon: FaWalking },
];

const ROUTE_OPTIONS = {
  CAR: [
    { value: "MIN_DISTANCE", label: "최단 거리" },
    { value: "MIN_TIME", label: "최소 시간" },
    { value: "AVOID_TOLL", label: "통행료 회피" },
  ],
  BICYCLE: [
    { value: "MIN_DISTANCE", label: "최단 거리" },
    { value: "MIN_TIME", label: "최소 시간" },
    { value: "ACCESSIBLE", label: "접근성 우선" },
  ],
  WALK: [
    { value: "SHORTEST", label: "최단 거리" },
    { value: "BROAD_FIRST", label: "큰길 우선" },
    { value: "ACCESSIBLE", label: "접근성 우선" },
  ],
};

const DEFAULT_OPTIONS = {
  CAR: "MIN_DISTANCE",
  BICYCLE: "MIN_DISTANCE",
  WALK: "SHORTEST",
};

const getErrorMessage = (error, fallback) =>
  error?.message || error?.data?.message || fallback;

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "시간 정보 없음";
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
};

const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return "거리 정보 없음";
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)}km`
    : `${Math.round(meters)}m`;
};

const pointName = (point) => point?.placeName || point?.label || "";

const samePoint = (left, right) => {
  if (!left || !right) return false;
  if (left.placeNo && right.placeNo) return left.placeNo === right.placeNo;
  return left.X_AXIS === right.X_AXIS && left.Y_AXIS === right.Y_AXIS;
};

// 대중교통 상세 안내: 카카오 대중교통 구간과 출발·도착 좌표 사이의 연결 도보를 계산한다.
const toCoordinate = (point) => {
  const X_AXIS = Number(point?.X_AXIS);
  const Y_AXIS = Number(point?.Y_AXIS);
  return Number.isFinite(X_AXIS) && Number.isFinite(Y_AXIS)
    ? { X_AXIS, Y_AXIS }
    : null;
};

const routeEdgeCoordinate = (route, fromStart) => {
  const routePath = Array.isArray(route?.path) ? route.path : [];
  const orderedRoutePath = fromStart ? routePath : [...routePath].reverse();
  const routeCoordinate = orderedRoutePath.map(toCoordinate).find(Boolean);
  if (routeCoordinate) return routeCoordinate;

  const steps = Array.isArray(route?.steps) ? route.steps : [];
  const orderedSteps = fromStart ? steps : [...steps].reverse();
  for (const step of orderedSteps) {
    const stepPath = Array.isArray(step?.path) ? step.path : [];
    const orderedStepPath = fromStart ? stepPath : [...stepPath].reverse();
    const stepCoordinate = orderedStepPath.map(toCoordinate).find(Boolean);
    if (stepCoordinate) return stepCoordinate;
  }

  return null;
};

const distanceBetween = (start, end) => {
  if (!start || !end) return Number.POSITIVE_INFINITY;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadius = 6371000;
  const latitudeDelta = toRadians(end.Y_AXIS - start.Y_AXIS);
  const longitudeDelta = toRadians(end.X_AXIS - start.X_AXIS);
  const startLatitude = toRadians(start.Y_AXIS);
  const endLatitude = toRadians(end.Y_AXIS);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
};

const combinePaths = (...paths) => paths.flatMap((path) => path || []);

const RoutePanel = ({
  isOpen,
  initialOrigin,
  initialDestination,
  onClose,
  onRouteSelect,
}) => {
  const [origin, setOrigin] = useState(initialOrigin || null);
  const [destination, setDestination] = useState(initialDestination || null);
  const [originText, setOriginText] = useState(pointName(initialOrigin));
  const [destinationText, setDestinationText] = useState(
    pointName(initialDestination),
  );
  const [activeTarget, setActiveTarget] = useState("origin");
  const [waypoints, setWaypoints] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchState, setSearchState] = useState("idle");
  const [searchMessage, setSearchMessage] = useState("");
  const [transportType, setTransportType] = useState("CAR");
  const [routeOption, setRouteOption] = useState("MIN_DISTANCE");
  const [transitType, setTransitType] = useState("BUS_AND_SUBWAY");
  const [sortType, setSortType] = useState("MIN_TIME");
  const [routeState, setRouteState] = useState("idle");
  const [routeMessage, setRouteMessage] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  // 대중교통 상세 안내: 선택 경로별 연결 도보 조회 상태와 펼침 상태를 분리해 관리한다.
  const [expandedRouteIndex, setExpandedRouteIndex] = useState(null);
  const [transitDetails, setTransitDetails] = useState({});
  const searchControllerRef = useRef(null);
  const routeControllerRef = useRef(null);
  const transitDetailControllerRef = useRef(null);

  useEffect(
    () => () => {
      searchControllerRef.current?.abort();
      routeControllerRef.current?.abort();
      transitDetailControllerRef.current?.abort();
    },
    [],
  );

  const clearRouteResult = () => {
    setRouteState("idle");
    setRouteMessage("");
    setRouteData(null);
    setSelectedRouteIndex(0);
    setExpandedRouteIndex(null);
    setTransitDetails({});
    transitDetailControllerRef.current?.abort();
    onRouteSelect(null, null);
  };

  const getActiveText = () => {
    if (activeTarget === "origin") return originText;
    if (activeTarget === "destination") return destinationText;
    const waypointIndex = Number(activeTarget.split(":")[1]);
    return waypoints[waypointIndex]?.text || "";
  };

  const performPlaceSearch = async () => {
    const query = getActiveText().trim();
    if (query.length < 2) {
      setSearchState("error");
      setSearchMessage("장소명은 2글자 이상 입력해주세요.");
      setSearchResults([]);
      return;
    }

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;
    setSearchState("loading");
    setSearchMessage("");

    try {
      const results = await RouteAPI.searchPlaces(query, controller.signal);
      const safeResults = Array.isArray(results) ? results : [];
      setSearchResults(safeResults);
      setSearchState(safeResults.length > 0 ? "success" : "empty");
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setSearchResults([]);
      setSearchState("error");
      setSearchMessage(
        getErrorMessage(error, "장소 검색 중 오류가 발생했습니다."),
      );
    }
  };

  const updatePointText = (target, value) => {
    clearRouteResult();
    setActiveTarget(target);
    setSearchState("idle");
    setSearchResults([]);

    if (target === "origin") {
      setOriginText(value);
      setOrigin(null);
      return;
    }

    if (target === "destination") {
      setDestinationText(value);
      setDestination(null);
      return;
    }

    const waypointIndex = Number(target.split(":")[1]);
    setWaypoints((current) =>
      current.map((waypoint, index) =>
        index === waypointIndex
          ? { ...waypoint, text: value, place: null }
          : waypoint,
      ),
    );
  };

  const selectSearchResult = (place) => {
    clearRouteResult();

    if (activeTarget === "origin") {
      setOrigin(place);
      setOriginText(place.placeName);
    } else if (activeTarget === "destination") {
      setDestination(place);
      setDestinationText(place.placeName);
    } else {
      const waypointIndex = Number(activeTarget.split(":")[1]);
      setWaypoints((current) =>
        current.map((waypoint, index) =>
          index === waypointIndex
            ? { text: place.placeName, place }
            : waypoint,
        ),
      );
    }

    setSearchResults([]);
    setSearchState("idle");
  };

  const setCurrentLocation = (target) => {
    if (!navigator.geolocation) {
      setSearchState("error");
      setSearchMessage("현재 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setActiveTarget(target);
    setSearchState("loading");
    setSearchMessage("현재 위치를 확인하고 있습니다.");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const currentLocation = {
          label: "현재 위치",
          X_AXIS: coords.longitude,
          Y_AXIS: coords.latitude,
        };
        clearRouteResult();

        if (target === "origin") {
          setOrigin(currentLocation);
          setOriginText("현재 위치");
        } else {
          setDestination(currentLocation);
          setDestinationText("현재 위치");
        }

        setSearchState("idle");
        setSearchMessage("");
      },
      () => {
        setSearchState("error");
        setSearchMessage(
          "현재 위치를 가져오지 못했습니다. 브라우저 위치 권한을 확인해주세요.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  const addWaypoint = () => {
    if (transportType !== "WALK" || waypoints.length >= 3) return;
    setWaypoints((current) => [...current, { text: "", place: null }]);
    setActiveTarget(`waypoint:${waypoints.length}`);
    clearRouteResult();
  };

  const removeWaypoint = (indexToRemove) => {
    setWaypoints((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );
    setSearchResults([]);
    setSearchState("idle");
    clearRouteResult();
  };

  const changeTransport = (nextTransport) => {
    setTransportType(nextTransport);
    setRouteOption(DEFAULT_OPTIONS[nextTransport] || "");
    if (nextTransport !== "WALK") setWaypoints([]);
    setSearchResults([]);
    setSearchState("idle");
    clearRouteResult();
  };

  const validateRouteRequest = () => {
    if (!origin) return "검색 결과에서 출발지를 선택해주세요.";
    if (!destination) return "검색 결과에서 도착지를 선택해주세요.";
    if (samePoint(origin, destination))
      return "출발지와 도착지는 서로 달라야 합니다.";

    const selectedWaypoints = waypoints.map((waypoint) => waypoint.place);
    if (selectedWaypoints.some((waypoint) => !waypoint))
      return "모든 경유지를 검색 결과에서 선택해주세요.";

    const allPoints = [origin, ...selectedWaypoints, destination];
    for (let index = 0; index < allPoints.length; index += 1) {
      for (let next = index + 1; next < allPoints.length; next += 1) {
        if (samePoint(allPoints[index], allPoints[next]))
          return "출발지·도착지·경유지는 서로 다른 장소여야 합니다.";
      }
    }

    return "";
  };

  const buildRouteParams = () => {
    const params = { transportType };

    if (origin.placeNo) params.startPlaceNo = origin.placeNo;
    else {
      params.startX = origin.X_AXIS;
      params.startY = origin.Y_AXIS;
    }

    if (destination.placeNo) params.endPlaceNo = destination.placeNo;
    else {
      params.endX = destination.X_AXIS;
      params.endY = destination.Y_AXIS;
    }

    if (transportType === "PUBLIC_TRANSIT") {
      params.transitType = transitType;
      params.sortType = sortType;
    } else {
      params.routeOption = routeOption;
    }

    if (transportType === "WALK" && waypoints.length > 0) {
      params.waypointPlaceNos = waypoints.map(
        (waypoint) => waypoint.place.placeNo,
      );
    }

    return params;
  };

  // 대중교통 상세 안내: 대중교통 API가 생략한 첫 승차지 전·마지막 하차지 후 도보를 기존 도보 API로 보완한다.
  const requestConnectionWalk = async ({
    start,
    end,
    startName,
    endName,
    connectionType,
    signal,
  }) => {
    if (!start || !end || distanceBetween(start, end) < 30) return null;

    const walkingResponse = await RouteAPI.findRoutes(
      {
        startX: start.X_AXIS,
        startY: start.Y_AXIS,
        endX: end.X_AXIS,
        endY: end.Y_AXIS,
        transportType: "WALK",
        routeOption: "SHORTEST",
      },
      signal,
    );
    const walkingRoute = walkingResponse?.routes?.[0];
    if (!walkingRoute) throw new Error("연결 도보 경로를 찾지 못했습니다.");

    return {
      type: "WALKING",
      guidance: `${startName}에서 ${endName}까지 도보로 이동`,
      distance: walkingRoute.totalDistance,
      time: walkingRoute.totalTime,
      stopNames: [startName, endName],
      boardingPlace: startName,
      alightingPlace: endName,
      transfer: false,
      connectionType,
      path: walkingRoute.path || [],
      instructions: walkingRoute.steps || [],
    };
  };

  const loadTransitDetails = async (route, index, responseData, force = false) => {
    const cachedDetail = transitDetails[index];
    if (!force && cachedDetail?.state === "success") {
      transitDetailControllerRef.current?.abort();
      onRouteSelect(
        {
          ...route,
          path: combinePaths(
            cachedDetail.accessStep?.path,
            route.path,
            cachedDetail.egressStep?.path,
          ),
          // 대중교통 경로 색상: 연결 도보까지 구간별로 지도에 전달한다.
          mapSteps: [
            cachedDetail.accessStep,
            ...(route.steps || []),
            cachedDetail.egressStep,
          ].filter(Boolean),
        },
        responseData,
      );
      return;
    }

    transitDetailControllerRef.current?.abort();
    const controller = new AbortController();
    transitDetailControllerRef.current = controller;
    setTransitDetails((current) => ({
      ...current,
      [index]: { state: "loading" },
    }));

    const routeSteps = Array.isArray(route.steps) ? route.steps : [];
    const firstStep = routeSteps[0];
    const lastStep = routeSteps[routeSteps.length - 1];
    const firstTransitStep = routeSteps.find((step) =>
      ["BUS", "SUBWAY"].includes(step.type),
    );
    const lastTransitStep = [...routeSteps]
      .reverse()
      .find((step) => ["BUS", "SUBWAY"].includes(step.type));
    const originCoordinate = toCoordinate(responseData?.origin);
    const destinationCoordinate = toCoordinate(responseData?.destination);
    const routeStartCoordinate = routeEdgeCoordinate(route, true);
    const routeEndCoordinate = routeEdgeCoordinate(route, false);
    const firstBoardingPlace =
      firstTransitStep?.boardingPlace ||
      firstTransitStep?.stopNames?.[0] ||
      "첫 승차지";
    const finalAlightingPlace =
      lastTransitStep?.alightingPlace ||
      lastTransitStep?.stopNames?.at(-1) ||
      "마지막 하차지";

    const accessRequest =
      firstStep?.type === "WALKING"
        ? Promise.resolve(null)
        : requestConnectionWalk({
            start: originCoordinate,
            end: routeStartCoordinate,
            startName: pointName(responseData?.origin) || "출발지",
            endName: firstBoardingPlace,
            connectionType: "ACCESS",
            signal: controller.signal,
          });
    const egressRequest =
      lastStep?.type === "WALKING"
        ? Promise.resolve(null)
        : requestConnectionWalk({
            start: routeEndCoordinate,
            end: destinationCoordinate,
            startName: finalAlightingPlace,
            endName: pointName(responseData?.destination) || "목적지",
            connectionType: "EGRESS",
            signal: controller.signal,
          });

    const [accessResult, egressResult] = await Promise.allSettled([
      accessRequest,
      egressRequest,
    ]);
    if (controller.signal.aborted) return;

    const accessStep =
      accessResult.status === "fulfilled" ? accessResult.value : null;
    const egressStep =
      egressResult.status === "fulfilled" ? egressResult.value : null;
    const failedSections = [];
    if (accessResult.status === "rejected") failedSections.push("첫 승차지까지");
    if (egressResult.status === "rejected") failedSections.push("목적지까지");
    const missingCoordinate =
      (!routeStartCoordinate && firstStep?.type !== "WALKING") ||
      (!routeEndCoordinate && lastStep?.type !== "WALKING");
    const warning = failedSections.length
      ? `${failedSections.join("·")} 도보 안내를 불러오지 못했습니다.`
      : missingCoordinate
        ? "대중교통 경로 좌표가 없어 일부 연결 도보를 계산하지 못했습니다."
        : "";
    const detail = { state: "success", accessStep, egressStep, warning };

    setTransitDetails((current) => ({ ...current, [index]: detail }));
    onRouteSelect(
      {
        ...route,
        path: combinePaths(accessStep?.path, route.path, egressStep?.path),
        // 대중교통 경로 색상: 버스·지하철·도보 path를 합치지 않고도 각각 그릴 수 있게 보존한다.
        mapSteps: [accessStep, ...(route.steps || []), egressStep].filter(
          Boolean,
        ),
      },
      responseData,
    );
  };

  const findRoutes = async () => {
    const validationMessage = validateRouteRequest();
    if (validationMessage) {
      setRouteState("error");
      setRouteMessage(validationMessage);
      return;
    }

    routeControllerRef.current?.abort();
    const controller = new AbortController();
    routeControllerRef.current = controller;
    setRouteState("loading");
    setRouteMessage("");
    setRouteData(null);
    setExpandedRouteIndex(null);
    setTransitDetails({});
    transitDetailControllerRef.current?.abort();
    onRouteSelect(null, null);

    try {
      const response = await RouteAPI.findRoutes(
        buildRouteParams(),
        controller.signal,
      );
      const routes = Array.isArray(response?.routes) ? response.routes : [];
      const responseData = { ...response, routes };
      setRouteData(responseData);
      setSelectedRouteIndex(0);
      setRouteState(routes.length > 0 ? "success" : "empty");
      if (routes.length > 0) {
        onRouteSelect(routes[0], responseData);
        if (transportType === "PUBLIC_TRANSIT") {
          setExpandedRouteIndex(0);
          void loadTransitDetails(routes[0], 0, responseData, true);
        }
      }
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setRouteState("error");
      setRouteMessage(
        getErrorMessage(error, "길찾기 요청 중 오류가 발생했습니다."),
      );
    }
  };

  const selectRoute = (route, index) => {
    setSelectedRouteIndex(index);
    onRouteSelect(route, routeData);
    if (transportType !== "PUBLIC_TRANSIT") return;

    if (selectedRouteIndex === index && expandedRouteIndex === index) {
      setExpandedRouteIndex(null);
      transitDetailControllerRef.current?.abort();
      return;
    }

    setExpandedRouteIndex(index);
    void loadTransitDetails(route, index, routeData);
  };

  const handlePointKeyDown = (event) => {
    if (event.key === "Enter") performPlaceSearch();
  };

  return (
    <RoutePanelContainer
      $isOpen={isOpen}
      aria-hidden={!isOpen}
      // 코드 리뷰 반영: 닫힌 패널의 입력창과 버튼이 키보드 Tab 순서에 포함되지 않도록 한다.
      inert={!isOpen}
    >
      <RouteHeader>
        <h2>경로 찾기</h2>
        <IconButton type="button" onClick={onClose} aria-label="길찾기 닫기">
          <FaTimes />
        </IconButton>
      </RouteHeader>

      <RouteBody>
        <PointFields>
          <PointRow $accent="#2196F3">
            <label htmlFor="route-origin">출발지</label>
            <PointInput
              id="route-origin"
              value={originText}
              placeholder="장소명 입력 후 Enter"
              onFocus={() => setActiveTarget("origin")}
              onChange={(event) => updatePointText("origin", event.target.value)}
              onKeyDown={handlePointKeyDown}
            />
            <LocationButton
              type="button"
              title="현재 위치를 출발지로 사용"
              aria-label="현재 위치를 출발지로 사용"
              onClick={() => setCurrentLocation("origin")}
            >
              <FaLocationArrow />
            </LocationButton>
          </PointRow>

          <PointRow $accent="#FF7043" $last>
            <label htmlFor="route-destination">도착지</label>
            <PointInput
              id="route-destination"
              value={destinationText}
              placeholder="장소명 입력 후 Enter"
              onFocus={() => setActiveTarget("destination")}
              onChange={(event) =>
                updatePointText("destination", event.target.value)
              }
              onKeyDown={handlePointKeyDown}
            />
            <LocationButton
              type="button"
              title="현재 위치를 도착지로 사용"
              aria-label="현재 위치를 도착지로 사용"
              onClick={() => setCurrentLocation("destination")}
            >
              <FaLocationArrow />
            </LocationButton>
          </PointRow>
        </PointFields>

        {transportType === "WALK" && (
          <WaypointSection>
            <SectionHeader>
              <strong>경유지</strong>
              <span>입력 순서대로 이동 · 최대 3개</span>
            </SectionHeader>
            {waypoints.map((waypoint, index) => (
              <WaypointRow key={`waypoint-${index}`}>
                <span className="order">{index + 1}</span>
                <input
                  value={waypoint.text}
                  placeholder="DB 장소명 입력 후 Enter"
                  onFocus={() => setActiveTarget(`waypoint:${index}`)}
                  onChange={(event) =>
                    updatePointText(`waypoint:${index}`, event.target.value)
                  }
                  onKeyDown={handlePointKeyDown}
                />
                <IconButton
                  type="button"
                  aria-label={`${index + 1}번 경유지 삭제`}
                  onClick={() => removeWaypoint(index)}
                >
                  <FaTimes />
                </IconButton>
              </WaypointRow>
            ))}
            <AddWaypointButton
              type="button"
              disabled={waypoints.length >= 3}
              onClick={addWaypoint}
            >
              + 경유지 추가 ({waypoints.length}/3)
            </AddWaypointButton>
          </WaypointSection>
        )}

        {searchState !== "idle" && (
          <SearchResults>
            {searchState === "loading" && (
              <InlineState>{searchMessage || "장소를 검색 중입니다..."}</InlineState>
            )}
            {searchState === "error" && (
              <InlineState $error>{searchMessage}</InlineState>
            )}
            {searchState === "empty" && (
              <InlineState>검색 결과가 없습니다.</InlineState>
            )}
            {searchState === "success" &&
              searchResults.map((place) => (
                <SearchResultButton
                  type="button"
                  key={place.placeNo}
                  onClick={() => selectSearchResult(place)}
                >
                  <strong>{place.placeName}</strong>
                  <span>{place.address || "주소 정보 없음"}</span>
                </SearchResultButton>
              ))}
          </SearchResults>
        )}

        <TransportTabs aria-label="이동 수단 선택">
          {TRANSPORTS.map(({ value, label, icon: TransportIcon }) => (
            <TransportButton
              type="button"
              key={value}
              $active={transportType === value}
              onClick={() => changeTransport(value)}
            >
              <TransportIcon size={20} />
              {label}
            </TransportButton>
          ))}
        </TransportTabs>

        {transportType === "PUBLIC_TRANSIT" ? (
          <SelectRow>
            <label>
              교통수단
              <select
                value={transitType}
                onChange={(event) => {
                  setTransitType(event.target.value);
                  clearRouteResult();
                }}
              >
                <option value="BUS_AND_SUBWAY">버스 + 지하철</option>
                <option value="BUS">버스</option>
                <option value="SUBWAY">지하철</option>
              </select>
            </label>
            <label>
              정렬 기준
              <select
                value={sortType}
                onChange={(event) => {
                  setSortType(event.target.value);
                  clearRouteResult();
                }}
              >
                <option value="MIN_TIME">최소 시간</option>
                <option value="MIN_TRANSFER">최소 환승</option>
                <option value="MIN_WALK">최소 도보</option>
              </select>
            </label>
          </SelectRow>
        ) : (
          <OptionGrid>
            {ROUTE_OPTIONS[transportType].map((option) => (
              <OptionButton
                type="button"
                key={option.value}
                $active={routeOption === option.value}
                onClick={() => {
                  setRouteOption(option.value);
                  clearRouteResult();
                }}
              >
                {option.label}
              </OptionButton>
            ))}
          </OptionGrid>
        )}

        <FindRouteButton
          type="button"
          disabled={routeState === "loading"}
          onClick={findRoutes}
        >
          {routeState === "loading" ? (
            <>
              <Spinner /> 경로 탐색 중
            </>
          ) : (
            <>
              <FaSearch /> 경로 찾기
            </>
          )}
        </FindRouteButton>

        {routeState === "error" && (
          <InlineState $error>{routeMessage}</InlineState>
        )}

        {routeState === "empty" && (
          <EmptyState>
            <FaExclamationCircle />
            검색 결과가 없습니다.
          </EmptyState>
        )}

        {routeState === "success" && (
          <RouteResultsSection>
            <h3>추천 경로 {routeData.routes.length}개</h3>
            {routeData.routes.map((route, index) => (
              <RouteCard
                key={`${route.routeType || "route"}-${index}`}
                $selected={selectedRouteIndex === index}
              >
                {/* 대중교통 상세 안내: 카드 선택 시 이동 단계와 연결 도보를 함께 펼친다. */}
                <RouteCardButton
                  type="button"
                  $selected={selectedRouteIndex === index}
                  aria-expanded={
                    transportType === "PUBLIC_TRANSIT"
                      ? expandedRouteIndex === index
                      : undefined
                  }
                  onClick={() => selectRoute(route, index)}
                >
                  <div className="route-card-content">
                    <div className="summary">
                      <span className="time">
                        {formatDuration(route.totalTime)}
                      </span>
                      <span className="distance">
                        {formatDistance(route.totalDistance)}
                      </span>
                    </div>
                    <div className="meta">
                      {route.routeType || "추천 경로"}
                      {Number.isFinite(route.transfers) &&
                        ` · 환승 ${route.transfers}회`}
                      {Number.isFinite(route.walkingDistance) &&
                        ` · 도보 ${formatDistance(route.walkingDistance)}`}
                      {Number.isFinite(route.fare) &&
                        ` · 요금 ${route.fare.toLocaleString()}원`}
                      {Number.isFinite(route.toll) &&
                        ` · 통행료 ${route.toll.toLocaleString()}원`}
                    </div>
                  </div>
                  {transportType === "PUBLIC_TRANSIT" && (
                    <RouteExpandIcon aria-hidden="true">
                      {expandedRouteIndex === index ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </RouteExpandIcon>
                  )}
                </RouteCardButton>
                {transportType === "PUBLIC_TRANSIT" &&
                  expandedRouteIndex === index && (
                    <TransitRouteDetails
                      route={route}
                      detail={transitDetails[index]}
                    />
                  )}
              </RouteCard>
            ))}
          </RouteResultsSection>
        )}
      </RouteBody>
    </RoutePanelContainer>
  );
};

export default RoutePanel;
