import assert from "node:assert/strict";
import test from "node:test";
import {
  createUserCourse,
  readUserCourse,
  readUserCourses,
  saveUserCourse,
  USER_COURSE_KEY,
  USER_COURSES_KEY,
} from "./userCourseStorage.js";

const origin = { placeName: "출발지", X_AXIS: 126.7, Y_AXIS: 37.6 };
const destination = { placeNo: 22, placeName: "도착지", X_AXIS: 126.8, Y_AXIS: 37.7 };
const makeCourse = (name = "내 순례길", imageUrl = "/destination.jpg") => createUserCourse({
  info: { courseName: name, description: "코스 설명", endPlaceImg: imageUrl },
  origin,
  tags: ["산책"],
  routeData: {
    origin,
    destination,
    routes: [{ path: [origin, destination], totalDistance: 1200, totalTime: 900 }],
  },
});
const memoryStorage = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};

test("새 코스를 여러 번 저장해도 기존 코스와 도착지 사진을 보존한다", () => {
  const storage = memoryStorage();
  const first = makeCourse("첫 코스", "/first.jpg");
  const second = makeCourse("둘째 코스", "/second.jpg");
  assert.equal(saveUserCourse(first, storage), true);
  assert.equal(saveUserCourse(second, storage), true);
  assert.deepEqual(readUserCourses(storage).map((course) => course.id), [second.id, first.id]);
  assert.equal(readUserCourses(storage)[1].stops.at(-1).imageUrl, "/first.jpg");
  assert.equal(readUserCourse(storage).stops.at(-1).imageUrl, "/second.jpg");
  assert.deepEqual(readUserCourse(storage).routeData, second.routeData);
});

test("이전 단일 저장 코스를 유지하면서 새 목록으로 이전한다", () => {
  const storage = memoryStorage();
  const legacy = makeCourse("이전 코스");
  delete legacy.id;
  delete legacy.createdAt;
  storage.setItem(USER_COURSE_KEY, JSON.stringify({ version: 1, course: legacy }));
  assert.equal(readUserCourses(storage)[0].id, "legacy");
  assert.equal(saveUserCourse(makeCourse("새 코스"), storage), true);
  assert.deepEqual(readUserCourses(storage).map((course) => course.courseName), ["새 코스", "이전 코스"]);
  assert.equal(readUserCourses(storage)[1].id, "legacy");
});

test("같은 코스를 다시 저장하면 중복 없이 갱신한다", () => {
  const storage = memoryStorage();
  const course = makeCourse();
  saveUserCourse(course, storage);
  saveUserCourse({ ...course, courseName: "변경한 이름" }, storage);
  assert.equal(readUserCourses(storage).length, 1);
  assert.equal(readUserCourse(storage).courseName, "변경한 이름");
});

test("손상된 항목은 건너뛰고 유효한 코스는 읽는다", () => {
  const storage = memoryStorage();
  const course = makeCourse();
  storage.setItem(USER_COURSES_KEY, JSON.stringify({ version: 2, courses: [null, {}, course, course] }));
  assert.deepEqual(readUserCourses(storage), JSON.parse(JSON.stringify([course])));
  storage.setItem(USER_COURSES_KEY, "invalid json");
  assert.deepEqual(readUserCourses(storage), []);
});

test("저장 공간이 부족하거나 데이터가 잘못되면 기존 목록을 보존한다", () => {
  const storage = memoryStorage();
  const course = makeCourse();
  saveUserCourse(course, storage);
  const before = readUserCourses(storage);
  const unavailable = { getItem: storage.getItem, setItem: () => { throw new Error("QuotaExceededError"); } };
  assert.equal(saveUserCourse(makeCourse(), unavailable), false);
  assert.equal(saveUserCourse({ ...course, stops: [] }, storage), false);
  assert.deepEqual(readUserCourses(storage), before);
});

test("대표이미지가 별도로 없어도 도착지의 사진을 보존한다", () => {
  const course = createUserCourse({
    info: { courseName: "도착지 이미지", places: [{ ...destination, imageUrl: "/detail.jpg" }] },
    origin,
    tags: [],
    routeData: { origin, destination, routes: [{ path: [origin, destination] }] },
  });
  assert.equal(course.stops.at(-1).imageUrl, "/detail.jpg");
});
