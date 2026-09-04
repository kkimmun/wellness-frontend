export const USER_COURSE_KEY = "wellness.custom-course.v1";
export const USER_COURSES_KEY = "wellness.custom-courses.v2";

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
      imageUrl: (index === points.length - 1 ? info.endPlaceImg : null)
        || detail?.imageUrl || point.imageUrl,
    };
  });
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    courseName: info.courseName,
    description: info.description || "",
    tags,
    stops,
    routeData,
  };
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

export function readUserCourses(storage) {
  try {
    const target = storage ?? window.localStorage;
    const collection = target.getItem(USER_COURSES_KEY);
    if (collection !== null) {
      const saved = JSON.parse(collection);
      if (saved?.version === 2 && Array.isArray(saved.courses)) {
        const ids = new Set();
        return saved.courses.filter((course) => {
          if (!isUserCourse(course) || typeof course.id !== "string"
            || !course.id.trim() || ids.has(course.id)) return false;
          ids.add(course.id);
          return true;
        });
      }
    }
  } catch {
    // 이전 버전의 코스가 남아 있으면 복원한다.
  }
  try {
    const saved = JSON.parse((storage ?? window.localStorage).getItem(USER_COURSE_KEY));
    return saved?.version === 1 && isUserCourse(saved.course)
      ? [{ ...saved.course, id: "legacy" }] : [];
  } catch {
    return [];
  }
}

export function readUserCourse(storage) {
  return readUserCourses(storage)[0] ?? null;
}

export function saveUserCourse(course, storage) {
  try {
    if (!isUserCourse(course)) return false;
    const target = storage ?? window.localStorage;
    const savedCourse = {
      ...course,
      id: typeof course.id === "string" && course.id.trim() ? course.id : crypto.randomUUID(),
      createdAt: course.createdAt || new Date().toISOString(),
    };
    const courses = [savedCourse, ...readUserCourses(target).filter((item) => item.id !== savedCourse.id)];
    target.setItem(USER_COURSES_KEY, JSON.stringify({ version: 2, courses }));
    return true;
  } catch {
    return false;
  }
}
