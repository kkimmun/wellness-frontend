import { RouteAPI } from "../../../api/route";
import { getCourseRoute, isCoursePoint } from "./userCourseStorage";

const isPlaceNumber = (value) => Number.isSafeInteger(value) && value > 0;

export function fixedCourseStops(info) {
  if (!info || typeof info.courseName !== "string"
    || !isPlaceNumber(info.startPlace) || !isPlaceNumber(info.endPlace)
    || (info.waypoints != null && !Array.isArray(info.waypoints))) {
    throw new Error("고정 코스의 출발지와 도착지 정보를 확인할 수 없습니다.");
  }
  const waypoints = [...(info.waypoints || [])];
  if (!waypoints.every((place) => isPlaceNumber(place?.placeNo))) {
    throw new Error("고정 코스의 경유지 정보를 확인할 수 없습니다.");
  }
  // 백엔드의 등록 순서를 유지한다. 추천 API로 방문 순서를 다시 계산하지 않는다.
  if (waypoints.every((place) => Number.isFinite(place.waypointSequence))) {
    waypoints.sort((left, right) => left.waypointSequence - right.waypointSequence);
  }
  return [
    { placeNo: info.startPlace },
    ...waypoints,
    { placeNo: info.endPlace, imageUrl: info.endPlaceImg },
  ];
}

export function buildFixedCourse(info, pins, routeData) {
  const stops = fixedCourseStops(info);
  const routePlaces = routeData
    ? [routeData.origin, ...(routeData.waypoints || []), routeData.destination]
    : [];
  const detailedPlaces = Array.isArray(info.places) ? info.places : [];
  const namedStops = stops.map((stop, index) => {
    const pin = pins.find((place) => place.placeNo === stop.placeNo);
    const detail = detailedPlaces.find((place) => place.placeNo === stop.placeNo);
    const routed = routePlaces[index];
    return {
      ...pin,
      ...detail,
      ...(routed?.placeNo === stop.placeNo ? routed : {}),
      ...stop,
      placeName: stop.placeName || detail?.placeName || pin?.placeName
        || (routed?.placeNo === stop.placeNo ? routed.placeName : "")
        || (index === 0 ? "출발지 정보 없음" : index === stops.length - 1 ? "도착지 정보 없음" : "경유지 정보 없음"),
      imageUrl: stop.imageUrl || detail?.imageUrl || pin?.imageUrl,
    };
  });
  const tags = [...new Set(namedStops.flatMap((stop) => Array.isArray(stop.tags) ? stop.tags : [])
    .map((tag) => typeof tag === "string" ? tag : tag?.tagName)
    .filter((tag) => typeof tag === "string" && tag.length > 0))];
  return {
    courseKind: "FIXED",
    courseNo: info.courseNo,
    courseName: info.courseName,
    description: typeof info.description === "string" ? info.description : "",
    tags,
    stops: namedStops,
    routeData: {
      transportType: "WALK",
      origin: namedStops[0],
      waypoints: namedStops.slice(1, -1),
      destination: namedStops.at(-1),
      routes: routeData?.routes || [],
    },
  };
}

export async function fetchFixedCourseRoute(info, signal) {
  const stops = fixedCourseStops(info);
  // 구간별 조회는 경유지 수 제한과 무관하게 고정 코스의 순서를 보존한다.
  const segments = await Promise.all(stops.slice(1).map(async (destination, index) => {
    const data = await RouteAPI.findRoutes({
      startPlaceNo: stops[index].placeNo,
      endPlaceNo: destination.placeNo,
      transportType: "WALK",
      routeOption: "SHORTEST",
    }, signal);
    const route = getCourseRoute(data);
    if (!route || !isCoursePoint(data?.origin) || !isCoursePoint(data?.destination)
      || data.origin.placeNo !== stops[index].placeNo || data.destination.placeNo !== destination.placeNo) {
      throw new Error("일부 구간의 도보 경로를 확인할 수 없습니다.");
    }
    return { data, route };
  }));
  const sumMetric = (key) => segments.every(({ route }) => Number.isFinite(route[key]) && route[key] >= 0)
    ? segments.reduce((total, { route }) => total + route[key], 0) : null;
  return {
    transportType: "WALK",
    origin: segments[0].data.origin,
    waypoints: segments.slice(0, -1).map(({ data }) => data.destination),
    destination: segments.at(-1).data.destination,
    routes: [{
      path: segments.flatMap(({ route }) => route.path),
      totalDistance: sumMetric("totalDistance"),
      totalTime: sumMetric("totalTime"),
    }],
  };
}
