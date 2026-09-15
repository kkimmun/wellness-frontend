import assert from "node:assert/strict";
import test from "node:test";

import {
  getCircularPinIndex,
  groupOverlappingPins,
  groupPinsByScreenDistance,
} from "./overlappingPins.js";

test("같거나 가까운 좌표의 핀을 한 그룹으로 묶는다", () => {
  const pins = [
    { placeNo: 1, placeName: "Top10", xAxis: 126.7155, yAxis: 37.6153 },
    { placeNo: 2, placeName: "일반 장소", xAxis: 126.71552, yAxis: 37.61532 },
  ];

  const groups = groupOverlappingPins(pins);

  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].pins, pins);
});

test("서로 떨어진 핀은 별도 그룹으로 유지한다", () => {
  const pins = [
    { placeNo: 1, xAxis: 126.7155, yAxis: 37.6153 },
    { placeNo: 2, xAxis: 126.72, yAxis: 37.62 },
  ];

  const groups = groupOverlappingPins(pins);

  assert.equal(groups.length, 2);
  assert.equal(groups[0].pins.length, 1);
  assert.equal(groups[1].pins.length, 1);
});

test("API의 대문자 좌표 필드도 그룹화한다", () => {
  const pins = [
    { PLACE_NO: 1, X_AXIS: 126.7155, Y_AXIS: 37.6153 },
    { PLACE_NO: 2, X_AXIS: 126.7155, Y_AXIS: 37.6153 },
  ];

  const [group] = groupOverlappingPins(pins);

  assert.equal(group.pins.length, 2);
});

test("현재 줌에서 마커가 겹치는 화면 좌표를 한 그룹으로 묶는다", () => {
  const pins = [
    { placeNo: 1, xAxis: 126.1, yAxis: 37.1 },
    { placeNo: 2, xAxis: 126.2, yAxis: 37.2 },
    { placeNo: 3, xAxis: 126.3, yAxis: 37.3 },
  ];
  const screenPoints = new Map([
    [1, { x: 100, y: 100 }],
    [2, { x: 155, y: 100 }],
    [3, { x: 260, y: 100 }],
  ]);

  const groups = groupPinsByScreenDistance(
    pins,
    (place) => screenPoints.get(place.placeNo),
    62,
  );

  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].pins, pins.slice(0, 2));
  assert.deepEqual(groups[1].pins, pins.slice(2));
});

test("확대되어 화면 간격이 벌어진 마커는 다시 분리한다", () => {
  const pins = [
    { placeNo: 1, xAxis: 126.1, yAxis: 37.1 },
    { placeNo: 2, xAxis: 126.2, yAxis: 37.2 },
  ];

  const groups = groupPinsByScreenDistance(
    pins,
    (place) => ({ x: place.placeNo * 100, y: 100 }),
    62,
  );

  assert.equal(groups.length, 2);
});

test("겹친 핀의 이전·다음 순번을 순환한다", () => {
  assert.equal(getCircularPinIndex(1, 2), 1);
  assert.equal(getCircularPinIndex(2, 2), 0);
  assert.equal(getCircularPinIndex(-1, 2), 1);
});
