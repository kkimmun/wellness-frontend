export const USER_COURSE_KEY = "wellness.custom-course.v1";

const coordinate = (value) => value !== null && value !== "" && Number.isFinite(Number(value));

export const isCoursePoint = (point) => {
  const x = point?.X_AXIS ?? point?.xAxis;
  const y = point?.Y_AXIS ?? point?.yAxis;
  return coordinate(x) && coordinate(y) && Math.abs(Number(x)) <= 180 && Math.abs(Number(y)) <= 90;
};

export const getCourseRoute = (data) => (Array.isArray(data?.routes) ? data.routes : [])
  .filter((route) => Array.isArray(route?.path) && route.path.length > 1 && route.path.every(isCoursePoint))
  .reduce((best, route) => !best || (Number.isFinite(route.totalDistance)
    && (!Number.isFinite(best.totalDistance) || route.totalDistance < best.totalDistance)) ? route : best, null);

export function createUserCourse({ info, routeData, origin, tags }) {
  if (!info?.courseName || !getCourseRoute(routeData)) {
    throw new Error("코스 설명 또는 경로 정보를 확인할 수 없습니다.");
  }
  const places = Array.isArray(info.places) ? info.places : [];
  const points = [routeData.origin, ...(Array.isArray(routeData.waypoints) ? routeData.waypoints : []), routeData.destination];
  if (!points.every(isCoursePoint)) throw new Error("코스 장소의 좌표 정보가 올바르지 않습니다.");
  const stops = points.map((point, index) => {
    const detail = places.find((place) => place.placeNo === point.placeNo);
    return {
      ...point,
      placeName: index === 0 ? origin?.placeName || point.placeName : point.placeName,
      imageUrl: index === points.length - 1 ? info.endPlaceImg : detail?.imageUrl,
    };
  });
  return { courseName: info.courseName, description: info.description || "", tags, stops, routeData };
}

function isUserCourse(course) {
  return typeof course?.courseName === "string" && course.courseName.trim().length > 0
    && typeof course.description === "string"
    && Array.isArray(course.tags) && course.tags.every((tag) => typeof tag === "string")
    && Array.isArray(course.stops) && course.stops.length >= 2
    && course.stops.every((stop) => isCoursePoint(stop) && typeof stop.placeName === "string"
      && (stop.placeNo == null || (Number.isSafeInteger(stop.placeNo) && stop.placeNo > 0))
      && (stop.imageUrl == null || typeof stop.imageUrl === "string"))
    && Array.isArray(course.routeData?.routes) && Boolean(getCourseRoute(course.routeData))
    && isCoursePoint(course.routeData.origin) && isCoursePoint(course.routeData.destination)
    && (course.routeData.waypoints == null || (Array.isArray(course.routeData.waypoints)
      && course.routeData.waypoints.every(isCoursePoint)));
}

export function readUserCourse(storage) {
  try {
    const saved = JSON.parse((storage ?? window.localStorage).getItem(USER_COURSE_KEY));
    return saved?.version === 1 && isUserCourse(saved.course) ? saved.course : null;
  } catch {
    return null;
  }
}

export function saveUserCourse(course, storage) {
  try {
    if (!isUserCourse(course)) return false;
    (storage ?? window.localStorage).setItem(USER_COURSE_KEY, JSON.stringify({ version: 1, course }));
    return true;
  } catch {
    return false;
  }
}
