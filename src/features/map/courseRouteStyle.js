const ARROW_SPACING = 80;
const END_PADDING = 24;

// Work in screen pixels so arrows keep the same size at every zoom level.
export function getCourseArrowPaths(points, width, height) {
  const arrows = [];
  const totalLength = points.slice(1).reduce((total, point, index) =>
    total + Math.hypot(point.x - points[index].x, point.y - points[index].y), 0);
  let travelled = 0;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (!Number.isFinite(length) || length === 0) continue;
    const segmentStart = travelled;
    travelled += length;

    const ux = dx / length;
    const uy = dy / length;
    let min = Math.max(0, END_PADDING - segmentStart);
    let max = Math.min(length - 1e-8, totalLength - END_PADDING - segmentStart);

    // Clip before sampling, including when zooming far into a long segment.
    for (const [origin, direction, limit] of [[start.x, ux, width], [start.y, uy, height]]) {
      if (Math.abs(direction) < 1e-10) {
        if (origin < -8 || origin > limit + 8) max = -1;
        continue;
      }
      const first = (-8 - origin) / direction;
      const last = (limit + 8 - origin) / direction;
      min = Math.max(min, Math.min(first, last));
      max = Math.min(max, Math.max(first, last));
    }

    const offset = ARROW_SPACING / 2 - segmentStart;
    const firstIndex = Math.max(0, Math.ceil((min - offset) / ARROW_SPACING));
    const lastIndex = Math.floor((max - offset) / ARROW_SPACING);

    for (let arrowIndex = firstIndex; arrowIndex <= lastIndex; arrowIndex += 1) {
      const distance = offset + arrowIndex * ARROW_SPACING;
      const x = start.x + ux * distance;
      const y = start.y + uy * distance;
      arrows.push([
        { x: x - ux * 3 - uy * 3, y: y - uy * 3 + ux * 3 },
        { x: x + ux * 2, y: y + uy * 2 },
        { x: x - ux * 3 + uy * 3, y: y - uy * 3 - ux * 3 },
      ]);
    }
  }

  return arrows;
}

export function drawCourseRoute(mapsApi, map, path, container) {
  const lines = [
    new mapsApi.Polyline({
      map, path, strokeWeight: 12, strokeColor: "#ffffff",
      strokeOpacity: 1, strokeStyle: "solid", zIndex: 0,
    }),
    new mapsApi.Polyline({
      map, path, strokeWeight: 8, strokeColor: "#168b91",
      strokeOpacity: 1, strokeStyle: "solid", zIndex: 1,
    }),
  ];
  let arrows = [];
  let frame = null;

  const redrawArrows = () => {
    frame = null;
    arrows.forEach((arrow) => arrow.setMap(null));
    const projection = map.getProjection();
    const points = path.map((point) => projection.containerPointFromCoords(point));
    arrows = getCourseArrowPaths(points, container.clientWidth, container.clientHeight).map(
      (arrow) => new mapsApi.Polyline({
        map,
        path: arrow.map(({ x, y }) => projection.coordsFromContainerPoint(new mapsApi.Point(x, y))),
        strokeWeight: 2, strokeColor: "#ffffff", strokeOpacity: 1,
        strokeStyle: "solid", zIndex: 2,
      }),
    );
  };
  const scheduleRedraw = () => {
    if (frame === null) frame = requestAnimationFrame(redrawArrows);
  };

  mapsApi.event.addListener(map, "zoom_changed", scheduleRedraw);
  mapsApi.event.addListener(map, "idle", scheduleRedraw);
  const resizeObserver = new ResizeObserver(scheduleRedraw);
  resizeObserver.observe(container);
  scheduleRedraw();

  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    mapsApi.event.removeListener(map, "zoom_changed", scheduleRedraw);
    mapsApi.event.removeListener(map, "idle", scheduleRedraw);
    [...lines, ...arrows].forEach((line) => line.setMap(null));
  };
}
