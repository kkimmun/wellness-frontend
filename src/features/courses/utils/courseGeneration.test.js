import test from "node:test";
import assert from "node:assert/strict";
import { createCourseGeneration } from "./courseGeneration.js";

const origin = { xAxis: 126.7, yAxis: 37.6 };
const destination = { xAxis: 126.8, yAxis: 37.7 };
const route = { origin, destination, waypoints: [{ placeNo: 7 }, { placeNo: 3 }],
  routes: [{ path: [origin, destination] }] };
const info = { courseName: "산책", description: "코스 설명" };
const setup = (overrides = {}) => {
  const calls = { route: 0, descriptions: [], displayed: [] };
  const session = createCourseGeneration({ coordinates: { startX: 126.7, startY: 37.6 },
    endPlaceNo: 2, waypointPlaceNos: [3, 7], tags: ["산책"],
    getRoute: async () => { calls.route++; return { data: route }; },
    getDescription: async payload => {
      calls.descriptions.push(payload);
      if (calls.descriptions.length === 1) throw new Error("AI unavailable");
      return { data: info };
    }, onRoute: value => calls.displayed.push(value), ...overrides });
  return { session, calls };
};

test("설명 실패 후에는 경로와 최적화된 경유 순서를 유지하고 설명만 재요청한다", async () => {
  const { session, calls } = setup();
  await assert.rejects(session.run(new AbortController().signal), /AI unavailable/);
  assert.equal(session.hasRoute(), true);
  assert.deepEqual(calls.displayed, [route]);
  const result = await session.run(new AbortController().signal);
  assert.equal(calls.route, 1);
  assert.equal(calls.descriptions.length, 2);
  assert.deepEqual(calls.descriptions[1], calls.descriptions[0]);
  assert.deepEqual(calls.descriptions[1].waypoints, [7, 3]);
  assert.equal(result.routeData, route);
  assert.equal(result.info, info);
});

test("경로 실패는 저장하지 않고 다음 시도에서 경로부터 재요청한다", async () => {
  let attempts = 0;
  const { session, calls } = setup({ getRoute: async () => {
    if (++attempts === 1) throw new Error("route unavailable");
    return { data: route };
  }, getDescription: async () => ({ data: info }) });
  await assert.rejects(session.run(new AbortController().signal), /route unavailable/);
  assert.equal(session.hasRoute(), false);
  assert.deepEqual(calls.displayed, []);
  await session.run(new AbortController().signal);
  assert.equal(attempts, 2);
});

test("조건 변경이나 닫기로 취소된 경로 응답은 표시하거나 설명 요청을 시작하지 않는다", async () => {
  let resolve;
  const { session, calls } = setup({ getRoute: () => new Promise(r => { resolve = r; }) });
  const controller = new AbortController();
  const pending = session.run(controller.signal);
  controller.abort();
  resolve({ data: route });
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(session.hasRoute(), false);
  assert.deepEqual(calls.displayed, []);
  assert.deepEqual(calls.descriptions, []);
});

test("취소 후 도착한 설명은 코스 완성 결과로 반환하지 않는다", async () => {
  const controller = new AbortController();
  const { session } = setup({ getDescription: async () => {
    controller.abort(); return { data: info };
  } });
  await assert.rejects(session.run(controller.signal), { name: "AbortError" });
});

test("빈 설명 응답도 실패로 처리하며 재시도 때 경로를 재조회하지 않는다", async () => {
  let attempts = 0;
  const { session, calls } = setup({ getDescription: async () => ({ data: ++attempts === 1
    ? { courseName: "산책", description: " " } : info }) });
  await assert.rejects(session.run(new AbortController().signal), /설명/);
  await session.run(new AbortController().signal);
  assert.equal(calls.route, 1);
});
