import { useEffect, useRef } from "react";
import { useMap } from "react-kakao-maps-sdk";

// 길찾기 표시 안정화: 이동수단 변경 시 이전 Kakao Polyline 객체를 지도에서 직접 제거한다.
const RoutePolylineLayer = ({
  revision,
  segments,
  fallbackPath,
  fallbackColor,
  fallbackStyle,
}) => {
  const map = useMap("RoutePolylineLayer");
  const polylinesRef = useRef([]);

  useEffect(() => {
    const clearPolylines = () => {
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current = [];
    };

    clearPolylines();
    if (!map || !window.kakao?.maps) return clearPolylines;

    const definitions =
      segments.length > 0
        ? segments
        : fallbackPath.length > 1
          ? [
              {
                path: fallbackPath,
                color: fallbackColor,
                strokeStyle: fallbackStyle,
              },
            ]
          : [];

    polylinesRef.current = definitions.map((definition) => {
      const polyline = new window.kakao.maps.Polyline({
        path: definition.path.map(
          ({ lat, lng }) => new window.kakao.maps.LatLng(lat, lng),
        ),
        strokeWeight: 7,
        strokeColor: definition.color,
        strokeOpacity: 0.9,
        strokeStyle: definition.strokeStyle,
      });
      polyline.setMap(map);
      return polyline;
    });

    return clearPolylines;
  }, [
    map,
    revision,
    segments,
    fallbackPath,
    fallbackColor,
    fallbackStyle,
  ]);

  return null;
};

export default RoutePolylineLayer;
