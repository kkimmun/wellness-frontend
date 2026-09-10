import test from "node:test";
import assert from "node:assert/strict";
import { isVisibleMapPlace, visibleMapPlaces } from "./placeVisibility.js";
test("종합병원 ID 및 병원·의원 분류는 숨긴다", () => {
  for (const place of [{ typeDetailNo: 3 }, { typeDetail: "종합병원" }, { typeDetailContent: "의원" }, { TYPE_DETAIL: "병원 / 의원" }]) {
    assert.equal(isVisibleMapPlace(place), false);
  }
});
test("한의원과 병원 이름이 들어간 다른 장소는 유지한다", () => {
  const places = [{ typeDetailNo: 4, typeDetail: "한의원" }, { typeDetail: "카페", placeName: "병원 앞 카페" }, { type: "의료기관" }];
  assert.deepEqual(visibleMapPlaces(places), places);
});
test("입력 원본을 변경하지 않고 숨김 분류만 제외한다", () => {
  const places = [{ placeNo: 1, typeDetail: "병원" }, { placeNo: 2, typeDetail: "공원" }];
  assert.deepEqual(visibleMapPlaces(places).map(p => p.placeNo), [2]);
  assert.equal(places.length, 2);
});
