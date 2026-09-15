// 공개 지도에서 숨길 분류. 의료기관 전체나 장소명 부분 일치로 제외하지 않는다.
const HIDDEN_DETAIL_IDS = new Set([3]); // 종합병원: 현재 타입 마스터 기준
const HIDDEN_DETAILS = new Set(["종합병원", "병원", "의원", "병원/의원", "의원/병원"]);
export const isVisibleMapPlace = (place) => {
  const id = place?.typeDetailNo ?? place?.TYPE_DETAIL_NO;
  const detail = String(place?.typeDetailContent ?? place?.typeDetail ?? place?.TYPE_DETAIL ?? "").replace(/\s+/g, "");
  return !HIDDEN_DETAIL_IDS.has(Number(id)) && !HIDDEN_DETAILS.has(detail);
};
export const visibleMapPlaces = (places) => (Array.isArray(places) ? places : []).filter(isVisibleMapPlace);
