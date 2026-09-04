import { isCoursePoint } from "./userCourseStorage";

function endpoint(place, prefix) {
  if (Number.isSafeInteger(place?.placeNo) && place.placeNo > 0) {
    return { [prefix + "PlaceNo"]: place.placeNo };
  }
  if (!isCoursePoint(place)) throw new Error("이 구간의 장소 좌표를 확인할 수 없습니다.");
  return {
    [prefix + "X"]: Number(place.X_AXIS ?? place.xAxis),
    [prefix + "Y"]: Number(place.Y_AXIS ?? place.yAxis),
  };
}

export function buildRestaurantRequest(origin, destination, routeOption = "SHORTEST") {
  return {
    ...endpoint(origin, "start"),
    ...endpoint(destination, "end"),
    transportType: "WALK",
    routeOption,
  };
}

export function readRestaurants(response) {
  if (!Array.isArray(response?.data)) throw new Error("음식점 목록을 확인할 수 없습니다. 다시 시도해주세요.");
  const ids = new Set();
  return response.data.filter((item) => {
    const place = item?.place;
    if (!Number.isSafeInteger(place?.placeNo) || place.placeNo <= 0
      || typeof place.placeName !== "string" || !place.placeName.trim()
      || !Number.isFinite(item.distance) || item.distance < 0 || item.distance > 1000 + 1e-6
      || ids.has(place.placeNo)) return false;
    ids.add(place.placeNo);
    return true;
  });
}
