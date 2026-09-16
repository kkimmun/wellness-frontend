import { Polygon } from "react-kakao-maps-sdk";
import { GIMPO_BOUNDARY_PATHS } from "../data/gimpoBoundary";

const GimpoBoundary = () => (
  <>
    {GIMPO_BOUNDARY_PATHS.map((path, index) => (
      <Polygon
        key={`gimpo-boundary-${index}`}
        path={path}
        strokeWeight={2}
        strokeColor="#168B91"
        strokeOpacity={0.5}
        strokeStyle="longdash"
        fillColor="#78C9C8"
        fillOpacity={0.015}
        zIndex={0}
      />
    ))}
  </>
);

export default GimpoBoundary;
