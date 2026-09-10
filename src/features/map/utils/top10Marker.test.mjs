import test from "node:test";
import assert from "node:assert/strict";
import { getInitialTop10PinIndex, getTop10IconKeyByName, isTop10Place } from "./top10Marker.js";

test("일반 관광지가 먼저 와도 겹친 그룹의 초기 대표는 TOP 10이다", () => {
  const general = { placeName: "일반 관광지", typeNo: 1 };
  const top10 = { placeName: "김포국제조각공원", typeNo: 1, typeDetail: "김포 TOP 10" };
  const pins = Object.freeze([general, top10]);
  assert.equal(getInitialTop10PinIndex(pins), 1);
  assert.equal(pins[0], general);
  assert.equal(pins[1], top10);
});

test("TOP 10이 여러 개면 고정 아이콘 순서, 없으면 첫 일반 장소를 표시한다", () => {
  assert.equal(getInitialTop10PinIndex([
    { placeName: "일반 관광지", typeNo: 1 },
    { placeName: "대명항", typeNo: 1, typeDetailNo: 18 },
    { placeName: "김포함상공원", typeNo: 1, typeDetailNo: 18 },
  ]), 2);
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
    assert.equal(isTop10Place({ placeName, typeNo: 1, typeDetail: "김포 TOP 10" }), true);
    assert.equal(isTop10Place({ placeName }), true);
    assert.equal(isTop10Place({ placeName, typeNo: 1 }), true);
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

test("관광지 대분류만으로 TOP 10을 판정하지 않는다", () => {
  for (const metadata of [{ typeNo: 1 }, { type: "주요관광지" }, { type: "관광명소" }, { type: "관광지" }, { TYPE_NO: 1 }, { TYPE: "관광지" }]) {
    assert.equal(isTop10Place({ placeName: "대명항 카페", ...metadata }), false);
    assert.equal(isTop10Place({ placeName: "대명항", ...metadata }), true);
  }
});

test("TOP 10 키워드가 있어도 다른 소분류를 이름이나 대분류로 덮어쓰지 않는다", () => {
  for (const metadata of [
    { type: "관광지", typeDetail: "카페" },
    { typeNo: 1, typeDetailNo: 14 },
    { typeDetail: "카페" },
    { typeDetailNo: 14 },
    { TYPE_DETAIL: "카페" },
    { TYPE_DETAIL_NO: 14 },
    { typeDetailContent: "자연명소" },
    { TYPE_DETAIL_CONTENT: "공원" },
    { typeDetail: "카페", typeDetailNo: 18 },
  ]) {
    assert.equal(isTop10Place({ placeName: "대명항 카페", ...metadata }), false);
  }
});

test("소분류가 없으면 관광 대분류 또는 분류 없는 응답에서 정확한 장소명으로 복원한다", () => {
  assert.equal(isTop10Place({ placeName: "김포 아트빌리지", type: null, typeNo: null, typeDetail: null, typeDetailNo: null }), true);
  assert.equal(isTop10Place({ PLACE_NAME: "김포 아트빌리지" }), true);
  assert.equal(isTop10Place({ placeName: "김포 아트빌리지", type: "", typeNo: 1 }), true);
  assert.equal(isTop10Place({ placeName: "김포 아트빌리지", type: "관광지", typeNo: null }), true);
});

test("소분류 번호로도 TOP 10을 인식하고 일반 부가시설보다 대표로 우선 표시한다", () => {
  for (const typeDetailNo of [18, 46, "18", "46"]) {
    assert.equal(isTop10Place({ placeName: "대명항", typeNo: 1, typeDetailNo }), true);
  }
  const pins = [
    { placeName: "대명항 카페", type: "관광지", typeDetail: "카페" },
    { placeName: "대명항", type: "주요관광지", typeDetail: "김포 TOP 10" },
  ];
  assert.equal(getInitialTop10PinIndex(pins), 1);
});

test("소분류 누락 시 실제 TOP 10 이름이어도 명백한 비관광 분류는 제외한다", () => {
  for (const metadata of [
    { type: "음식점" }, { type: "카페" }, { type: "의료기관" }, { type: "종교시설" },
    { typeNo: 6 }, { TYPE_NO: 2 }, { TYPE: "생활체육시설" },
    { type: "관광지", typeNo: 6 }, { type: "카페", typeNo: 1 },
  ]) assert.equal(isTop10Place({ placeName: "대명항", ...metadata }), false);
  assert.equal(isTop10Place({ placeName: "대명항", typeNo: 3 }), true);
});

test("키워드 기반 상호와 부가시설은 분류가 모두 없어도 TOP 10이 아니다", () => {
  for (const placeName of ["대명항 카페", "아트빌리지 식당", "애기봉 주차장", "문수산성 매점", "김포국제조각공원 화장실"]) {
    assert.equal(isTop10Place({ placeName }), false);
    assert.equal(isTop10Place({ placeName, type: "관광지" }), false);
  }
  assert.equal(isTop10Place({ PLACE_NAME: "김포 아라 마리나", TYPE: "관광지" }), true);
  assert.equal(isTop10Place({ placeName: "현대프리미엄아웃렛 김포점", typeNo: 1 }), true);
});

test("명시된 비TOP10 소분류는 정확한 TOP10 장소명보다도 우선한다", () => {
  assert.equal(isTop10Place({ placeName: "대명항", type: "관광지", typeDetail: "카페" }), false);
  assert.equal(isTop10Place({ placeName: "대명항", typeDetailNo: 14 }), false);
});

test("모든 배열 순열과 소분류 누락에서도 동일한 TOP 10을 초기 대표로 선택한다", () => {
  const places = [
    { placeNo: 30, placeName: "대명항", type: "주요관광지", typeDetail: "김포 TOP 10" },
    { placeNo: 20, placeName: "김포국제조각공원", type: "주요관광지", typeDetail: "김포 TOP 10" },
    { placeNo: 10, placeName: "대명항 카페", type: "관광지", typeDetail: "카페" },
  ];
  for (const order of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]) {
    for (const omitDetails of [false, true]) {
      const pins = Object.freeze(order.map(i => omitDetails ? { ...places[i], typeDetail: undefined } : places[i]));
      assert.equal(pins[getInitialTop10PinIndex(pins)].placeNo, 20);
      assert.deepEqual(pins.map(pin=>pin.placeNo), order.map(i=>places[i].placeNo));
    }
  }
});

test("동일한 TOP 10 아이콘도 장소 식별값으로 결정하고 후보가 없으면 첫 핀을 유지한다", () => {
  const a = { placeNo: 10, placeName: "김포국제조각공원", typeNo: 1 };
  const b = { placeNo: 20, placeName: "김포국제조각공원", typeNo: 1 };
  for (const pins of [[a,b],[b,a]]) assert.equal(pins[getInitialTop10PinIndex(pins)].placeNo,10);
  const c = { placeName: "김포국제조각공원", xAxis: 126.5, yAxis: 37.6 };
  const d = { ...c, xAxis: 126.6 };
  for (const pins of [[c,d],[d,c]]) assert.equal(pins[getInitialTop10PinIndex(pins)].xAxis,126.5);
  assert.equal(getInitialTop10PinIndex([{placeName:"일반 관광지"},{placeName:"대명항 카페"}]),0);
});
