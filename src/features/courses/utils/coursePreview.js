import { isCoursePoint, getCourseRoute } from "./userCourseStorage.js";

// Immediately show selected places, then replace the preview with the actual walking route.
export function startCoursePreview({ origin, destination, waypointPlaceNos, places, findRoute, onRoute, onMessage, delay = 250 }) {
  const controller = new AbortController();
  const validOrigin = isCoursePoint(origin) ? origin : null;
  const validDestination = isCoursePoint(destination) ? destination : null;
  const selectedPlaces = waypointPlaceNos
    .map((id) => places.find((place) => String(place.placeNo) === String(id)))
    .filter(isCoursePoint);
  onRoute({ origin: validOrigin, destination: validDestination, waypoints: selectedPlaces, routes: [], transportType: "WALK" });
  onMessage("");
  if (!validOrigin || !validDestination) return controller;

  onMessage("선택한 장소의 도보 경로를 불러오고 있습니다.");
  const timer = setTimeout(async () => {
    try {
      const response = await findRoute({
        startX: Number(origin.X_AXIS ?? origin.xAxis),
        startY: Number(origin.Y_AXIS ?? origin.yAxis),
        endPlaceNo: Number(destination.placeNo),
        transportType: "WALK",
        routeOption: "SHORTEST",
        waypointPlaceNos,
      }, controller.signal);
      if (controller.signal.aborted) return;
      if (!getCourseRoute(response?.data)) throw new Error("경로 없음");
      onRoute(response.data);
      onMessage("선택한 장소를 잇는 도보 경로입니다. 중간 관광지를 바꾸면 경로도 갱신됩니다.");
    } catch {
      if (controller.signal.aborted) return;
      onMessage("도보 경로를 불러오지 못했습니다. 장소를 다시 선택해주세요.");
    }
  }, delay);
  controller.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
  return controller;
}
