import { Fragment } from "react";
import { Polygon } from "react-kakao-maps-sdk";
import { GIMPO_BOUNDARY_PATHS } from "../data/gimpoBoundary";

const GimpoBoundary = () => (
  <>
    {GIMPO_BOUNDARY_PATHS.map((path, index) => (
      <Fragment key={`gimpo-boundary-${index}`}>
        <Polygon
          path={path}
          strokeWeight={10}
          strokeColor="#168B91"
          strokeOpacity={0.2}
          strokeStyle="solid"
          fillOpacity={0}
          zIndex={0}
        />
        <Polygon
          path={path}
          strokeWeight={3}
          strokeColor="#168B91"
          strokeOpacity={0.95}
          strokeStyle="solid"
          fillColor="#78C9C8"
          fillOpacity={0.06}
          zIndex={0}
        />
      </Fragment>
    ))}
  </>
);

export default GimpoBoundary;
