import { getCourseRoute } from "./userCourseStorage.js";

// One generation session belongs to a fixed selection. Keep its successful route
// when description generation fails; a changed selection must start a new session.
export function createCourseGeneration({ coordinates, endPlaceNo, waypointPlaceNos, tags, getRoute, getDescription, onRoute }) {
  let routeData = null;
  return {
    hasRoute: () => routeData !== null,
    async run(signal) {
      signal.throwIfAborted();
      if (!routeData) {
        const response = await getRoute({ ...coordinates, endPlaceNo,
          transportType: "WALK", routeOption: "SHORTEST", waypointPlaceNos }, signal);
        signal.throwIfAborted();
        if (!getCourseRoute(response?.data)) throw new Error("코스 경로 정보를 확인할 수 없습니다.");
        routeData = response.data;
        onRoute(routeData);
      }
      const response = await getDescription({ ...coordinates, endPlaceNo,
        waypoints: Array.isArray(routeData.waypoints)
          ? routeData.waypoints.map(place => place.placeNo) : waypointPlaceNos,
        tags }, signal);
      signal.throwIfAborted();
      if (!response?.data?.courseName?.trim() || !response?.data?.description?.trim()) {
        throw new Error("코스 설명을 생성하지 못했습니다.");
      }
      return { routeData, info: response.data };
    },
  };
}
