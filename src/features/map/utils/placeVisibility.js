const HIDDEN_DETAIL_IDS = new Set([3]);
const HIDDEN_DETAILS = new Set(["종합병원", "병원", "의원", "병원/의원", "의원/병원"]);
export const isVisibleMapPlace = (place) => {
  const id = place?.typeDetailNo ?? place?.TYPE_DETAIL_NO;
  const detail = String(place?.typeDetailContent ?? place?.typeDetail ?? place?.TYPE_DETAIL ?? "").replace(/\s+/g, "");
  return !HIDDEN_DETAIL_IDS.has(Number(id)) && !HIDDEN_DETAILS.has(detail);
};
export const visibleMapPlaces = (places) => (Array.isArray(places) ? places : []).filter(isVisibleMapPlace);
