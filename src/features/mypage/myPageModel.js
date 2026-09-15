import { readTravelPlans, TRAVEL_PLAN_KIND } from "../map/utils/travelPlanStorage.js";

// 지도에서 저장할 때 쓰는 소유자 키와 동일한 규칙을 사용한다.
export const getTravelOwnerKey = (user) =>
  user?.memberId || (user?.memberNo != null ? `member:${user.memberNo}` : null);

export function getMyTrips(user, storage) {
  const ownerKey = getTravelOwnerKey(user);
  if (!ownerKey) return [];
  return readTravelPlans(ownerKey, storage).sort((a, b) =>
    (Date.parse(b.updatedAt || b.createdAt) || 0) - (Date.parse(a.updatedAt || a.createdAt) || 0));
}

export function getSavedTrip(ownerKey, id, kind, storage) {
  if (!ownerKey || !id) return null;
  return readTravelPlans(ownerKey, storage, kind).find((plan) => plan.id === id) ?? null;
}

export const getTripMapUrl = (trip) =>
  `/map?${new URLSearchParams({
    mode: trip.kind === TRAVEL_PLAN_KIND.RECOMMENDATION ? "p" : "j",
    savedPlan: trip.id,
  })}`;

export function getProfileImage(user) {
  // 다른 계정에서 남긴 전역 localStorage 프로필 사진은 사용하지 않는다.
  let image = user?.profileImage || user?.imgPath;
  if (typeof image !== "string") return null;
  if (!user?.profileImage && image.endsWith("/") && user?.saveName) {
    image += encodeURIComponent(user.saveName);
  }
  return /^(https?:\/\/|\/(?!\/))/.test(image) ? image : null;
}

export const formatSavedDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "저장일 확인 불가" : date.toLocaleDateString("ko-KR");
};
