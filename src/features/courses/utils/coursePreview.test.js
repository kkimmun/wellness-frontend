import test from 'node:test';
import assert from 'node:assert/strict';
import { startCoursePreview } from './coursePreview.js';

const origin = { placeName: '출발', xAxis: 126.7, yAxis: 37.6 };
const destination = { placeNo: 2, placeName: '도착', xAxis: 126.8, yAxis: 37.7 };
const waypoint = { placeNo: 3, xAxis: 126.75, yAxis: 37.65 };
const route = { origin, destination, routes: [{ path: [origin, destination], totalDistance: 100 }] };
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
const setup = (overrides = {}) => {
  const routes = [], messages = [], requests = [];
  const controller = startCoursePreview({ origin, destination, places: [waypoint], waypointPlaceNos: [3],
    onRoute: value => routes.push(value), onMessage: value => messages.push(value), delay: 0,
    findRoute: async payload => { requests.push(payload); return {data: route}; }, ...overrides });
  return { controller, routes, messages, requests };
};
test('선택 마커를 즉시 표시하고 선택한 경유지의 실제 도보 경로를 요청한다', async () => {
  const s=setup();assert.equal(s.routes[0].origin,origin);assert.equal(s.routes[0].destination,destination);
  assert.deepEqual(s.routes[0].waypoints,[waypoint]);assert.deepEqual(s.routes[0].routes,[]);
  await tick();assert.equal(s.requests[0].transportType,'WALK');assert.deepEqual(s.requests[0].waypointPlaceNos,[3]);assert.equal(s.routes.at(-1),route);
});
test('출발지만 선택하면 마커만 표시하고 경로를 요청하지 않는다', async () => {
  const s=setup({destination:null});await tick();assert.equal(s.requests.length,0);assert.equal(s.routes[0].origin,origin);
});
test('경유지 해제 시 빈 목록으로 다시 경로를 요청한다', async () => {
  const s=setup({waypointPlaceNos:[]});await tick();assert.deepEqual(s.requests[0].waypointPlaceNos,[]);
});
test('선택 변경 뒤 취소된 응답은 최신 경로를 덮지 않는다', async () => {
  let resolve;const old=setup({findRoute:()=>new Promise(r=>{resolve=r;})});await tick();old.controller.abort();
  const current=setup({waypointPlaceNos:[]});await tick();resolve({data:route});await tick();
  assert.equal(old.routes.length,1);assert.equal(current.routes.at(-1),route);
});
test('빠르게 바꾼 선택의 예약 요청은 취소하고 실패 시 이전 경로를 남기지 않는다', async () => {
  const canceled=setup({delay:100});canceled.controller.abort();await tick();assert.equal(canceled.requests.length,0);
  const failed=setup({findRoute:async()=>{throw new Error('offline');}});await tick();
  assert.equal(failed.routes.length,1);assert.deepEqual(failed.routes[0].routes,[]);assert.match(failed.messages.at(-1),/불러오지 못했습니다/);
});
