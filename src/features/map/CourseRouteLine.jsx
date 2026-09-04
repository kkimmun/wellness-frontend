import { useEffect } from "react";
import { useMap } from "react-kakao-maps-sdk";
import { drawCourseRoute } from "./courseRouteStyle";

export default function CourseRouteLine({ path }) {
  const map = useMap("CourseRouteLine");

  useEffect(() => {
    if (path.length < 2) return undefined;
    const maps = window.kakao.maps;
    return drawCourseRoute(maps, map,
      path.map(({ lat, lng }) => new maps.LatLng(lat, lng)), map.getNode());
  }, [map, path]);

  return null;
}
