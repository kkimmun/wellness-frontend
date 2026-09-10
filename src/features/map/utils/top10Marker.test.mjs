import test from "node:test";
import assert from "node:assert/strict";
import { getInitialTop10PinIndex, getTop10IconKeyByName, isTop10Place } from "./top10Marker.js";

test("일반 관광지가 먼저 와도 겹친 그룹의 초기 대표는 TOP 10이다", () => {
  const general = { placeName: "일반 관광지", typeNo: 1 };
  const top10 = { placeName: "김포국제조각공원", typeNo: 1 };
  const pins = Object.freeze([general, top10]);
  assert.equal(getInitialTop10PinIndex(pins), 1);
  assert.equal(pins[0], general);
  assert.equal(pins[1], top10);
});

test("TOP 10이 여러 개면 첫 TOP 10, 없으면 첫 일반 장소를 표시한다", () => {
  assert.equal(getInitialTop10PinIndex([
    { placeName: "일반 관광지", typeNo: 1 },
    { placeName: "대명항", typeNo: 1 },
    { placeName: "김포함상공원", typeNo: 1 },
  ]), 1);
  assert.equal(getInitialTop10PinIndex([{ placeName: "일반 관광지", typeNo: 1 }]), 0);
  assert.equal(getInitialTop10PinIndex([{ PLACE_NAME: "김포 아트빌리지", TYPE_NO: 1 }]), 0);
  assert.equal(getInitialTop10PinIndex([]), 0);
});

test("TOP 10 열 곳 모두 각 전용 아이콘으로 연결한다", () => {
  const places = [
    ["김포 아트빌리지", "art"], ["김포국제조각공원", "park"], ["김포함상공원", "ship"],
    ["김포 장릉(원종·인헌왕후)", "tomb"], ["라베니체", "laveniche"], ["김포 아라마리나", "marina"],
    ["대명항", "port"], ["김포 현대 프리미엄 아울렛", "outlet"], ["문수산성", "fortress"], ["애기봉평화생태공원", "aegibong"],
  ];
  for (const [placeName, icon] of places) {
    assert.equal(getTop10IconKeyByName(placeName), icon);
    assert.equal(isTop10Place({ placeName, typeNo: 1 }), true);
    assert.equal(isTop10Place({ placeName }), true);
  }
});
test("이전 장소 PK만 같은 일반 장소를 TOP 10으로 오분류하지 않는다", () => {
  for (const placeNo of [1, 4, 5, 7, 8, 9, 10, 14, 178, 1043]) {
    assert.equal(isTop10Place({ placeNo, placeName: "일반 공원", typeNo: 1 }), false);
  }
});
test("TOP 10 분류라도 전용 아이콘을 찾지 못하면 배지 마커 대상이 아니다", () => {
  assert.equal(isTop10Place({ placeName: "알 수 없는 장소", typeDetailNo: 18 }), false);
  assert.equal(isTop10Place({ placeName: "알 수 없는 장소", typeDetail: "김포 TOP 10" }), false);
});
test("소분류와 대문자 필드, 공백과 아웃렛 표기를 지원한다", () => {
  assert.equal(isTop10Place({ PLACE_NAME: "김포 아라 마리나", TYPE_DETAIL_NO: 18 }), true);
  assert.equal(isTop10Place({ placeName: "김포 아트빌리지", typeDetailContent: "김포 TOP 10" }), true);
  assert.equal(getTop10IconKeyByName("현대 프리미엄 아웃렛"), "outlet");
});
test("근처 음식점 이름만 TOP 10 장소를 포함해도 전용 마커로 바꾸지 않는다", () => {
  assert.equal(isTop10Place({ placeName: "대명항 맛집", type: "음식점", typeNo: 6 }), false);
  assert.equal(isTop10Place(null), false);
  assert.equal(getTop10IconKeyByName(null), null);
});
