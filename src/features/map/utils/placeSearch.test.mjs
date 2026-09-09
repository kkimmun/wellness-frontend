import test from "node:test";
import assert from "node:assert/strict";

import { filterDbPlaces } from "./placeSearch.js";

const places = [
  {
    placeNo: 1,
    placeName: "김포문화원",
    type: "음식점",
    typeDetail: "카페",
    addr: "경기도 김포시 사우중로 1",
  },
  {
    placeNo: 2,
    placeName: "수산공원",
    type: "주요관광지",
    typeDetail: "공원",
    addr: "경기도 김포시 대곶면 대명항1로 52",
  },
  {
    placeNo: 3,
    placeName: "엄마의 봄날",
    type: "음식점",
    typeDetail: "한식",
    addr: "경기도 김포시 모담공원로 178",
  },
  {
    placeNo: "kakao_4",
    placeName: "서울숲공원",
    typeDetail: "공원",
    isExternal: true,
  },
];

test("소분류 키워드로 DB 장소를 검색한다", () => {
  assert.deepEqual(
    filterDbPlaces(places, "카페").map((place) => place.placeNo),
    [1],
  );
});

test("주소에만 키워드가 있는 장소와 외부 장소는 제외한다", () => {
  assert.deepEqual(
    filterDbPlaces(places, "공원").map((place) => place.placeNo),
    [2],
  );
});

test("빈 검색어는 결과를 반환하지 않는다", () => {
  assert.deepEqual(filterDbPlaces(places, "  "), []);
});
