import test from "node:test";
import assert from "node:assert/strict";
import { getMyTrips, getSavedTrip, getTravelOwnerKey, getTripMapUrl, getProfileImage, formatSavedDate } from "./myPageModel.js";
import { deleteTravelPlan, saveTravelPlan, TRAVEL_PLAN_KIND, TRAVEL_PLAN_STORAGE_KEY } from "../map/utils/travelPlanStorage.js";

const storage = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
const trip = (ownerKey, kind = TRAVEL_PLAN_KIND.PLAN) => ({ ownerKey, kind, name: "김포 나들이", origin: { xAxis: 126.715, yAxis: 37.615, placeName: "내가 찍은 출발지" }, places: [{ placeNo: 14, placeName: "공원", xAxis: 126.72, yAxis: 37.62 }] });

test("지도와 같은 회원 식별 규칙을 사용한다", () => {
  assert.equal(getTravelOwnerKey({ memberId: "kim", memberNo: 1 }), "kim");
  assert.equal(getTravelOwnerKey({ memberNo: 1 }), "member:1");
  assert.equal(getTravelOwnerKey(null), null);
});
test("회원별 목록을 분리하고 비회원에게 저장 목록을 제공하지 않는다", () => {
  const s = storage(); saveTravelPlan(trip("kim"), s); saveTravelPlan(trip("lee"), s);
  assert.equal(getMyTrips({ memberId: "kim" }, s).length, 1);
  assert.deepEqual(getMyTrips(null, s), []);
});
test("추천과 계획의 저장 종류를 유지한다", () => {
  const s = storage(); saveTravelPlan(trip("kim"), s); saveTravelPlan(trip("kim", "recommendation"), s);
  const plans = getMyTrips({ memberId: "kim" }, s);
  assert.equal(plans.filter((p) => p.kind === "plan").length, 1);
  assert.equal(plans.filter((p) => p.kind === "recommendation").length, 1);
});
test("저장 ID로 출발지와 장소를 그대로 복원한다", () => {
  const s = storage(); const saved = saveTravelPlan(trip("kim"), s);
  const restored = getSavedTrip("kim", saved.id, "plan", s);
  assert.deepEqual(restored.origin, saved.origin); assert.deepEqual(restored.places, saved.places);
});
test("다른 회원·다른 모드·존재하지 않는 ID는 복원하지 않는다", () => {
  const s = storage(); const saved = saveTravelPlan(trip("kim"), s);
  assert.equal(getSavedTrip("lee", saved.id, "plan", s), null);
  assert.equal(getSavedTrip("kim", saved.id, "recommendation", s), null);
  assert.equal(getSavedTrip("kim", "missing", "plan", s), null);
});
test("목록 삭제는 지정한 회원의 계획만 삭제한다", () => {
  const s = storage(); const mine = saveTravelPlan(trip("kim"), s); const other = saveTravelPlan(trip("lee"), s);
  deleteTravelPlan("kim", other.id, s); assert.equal(getMyTrips({ memberId: "lee" }, s).length, 1);
  deleteTravelPlan("kim", mine.id, s); assert.equal(getMyTrips({ memberId: "kim" }, s).length, 0);
});
test("잘못된 저장 데이터와 접근 거부에서 빈 목록을 반환한다", () => {
  const s = storage(); s.setItem(TRAVEL_PLAN_STORAGE_KEY, "broken");
  assert.deepEqual(getMyTrips({ memberId: "kim" }, s), []);
  assert.deepEqual(getMyTrips({ memberId: "kim" }, { getItem: () => { throw Error("denied"); } }), []);
});
test("모드와 저장 ID가 안전하게 인코딩된 지도 링크를 만든다", () => {
  assert.equal(getTripMapUrl({ kind: "plan", id: "a&b" }), "/map?mode=j&savedPlan=a%26b");
  assert.equal(getTripMapUrl({ kind: "recommendation", id: "abc" }), "/map?mode=p&savedPlan=abc");
});
test("현재 회원의 안전한 이미지 URL만 표시하고 잘못된 날짜를 처리한다", () => {
  assert.equal(getProfileImage({ imgPath: "https://example.com/me.png" }), "https://example.com/me.png");
  assert.equal(getProfileImage({ imgPath: "javascript:alert(1)" }), null);
  assert.equal(getProfileImage({}), null);
  assert.equal(formatSavedDate("bad"), "저장일 확인 불가");
});
