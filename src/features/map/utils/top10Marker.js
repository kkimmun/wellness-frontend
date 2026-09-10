const ICON_NAMES = [
  ["art", ["아트빌리지"]],
  ["park", ["조각공원"]],
  ["ship", ["함상공원"]],
  ["tomb", ["장릉"]],
  ["laveniche", ["라베니체"]],
  ["marina", ["아라마리나"]],
  ["port", ["대명항"]],
  ["outlet", ["아울렛", "아웃렛"]],
  ["fortress", ["문수산성"]],
  ["aegibong", ["애기봉"]],
];

const normalize = (value) => String(value ?? "").replace(/\s+/g, "").toUpperCase();

export const getTop10IconKeyByName = (name) => {
  const normalizedName = normalize(name);
  return ICON_NAMES.find(([, names]) => names.some((keyword) => normalizedName.includes(keyword)))?.[0] ?? null;
};

// DB 환경마다 달라지는 장소 PK로 TOP 10을 판정하지 않는다.
// 전용 아이콘과 분류 판정이 일치해야 하며, 메타데이터가 없는 저장 코스는 장소명으로 복원한다.
export const isTop10Place = (place) => {
  if (!getTop10IconKeyByName(place?.placeName ?? place?.PLACE_NAME)) return false;
  const detail = normalize(place?.typeDetail ?? place?.typeDetailContent ?? place?.TYPE_DETAIL ?? place?.TYPE_DETAIL_CONTENT);
  const detailNo = String(place?.typeDetailNo ?? place?.TYPE_DETAIL_NO ?? "");
  const type = normalize(place?.type ?? place?.TYPE);
  const typeNo = place?.typeNo ?? place?.TYPE_NO;
  return detail === "김포TOP10" || ["18", "46"].includes(detailNo)
    || Number(typeNo) === 1 || ["주요관광지", "관광명소", "관광지"].includes(type)
    || (!type && typeNo == null);
};
// 아직 선택하지 않은 겹친 그룹은 TOP 10 전용 아이콘을 대표로 표시한다.
// 배열 순서를 바꾸지 않아 기존 이전·다음 장소 전환 인덱스를 유지한다.
export const getInitialTop10PinIndex = (pins = []) => {
  const index = pins.findIndex(isTop10Place);
  return index < 0 ? 0 : index;
};
