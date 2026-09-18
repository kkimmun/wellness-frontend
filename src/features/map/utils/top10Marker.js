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

const TOP10_PLACE_NAMES = new Set([
  "김포 아트빌리지", "아트빌리지",
  "김포국제조각공원", "국제조각공원",
  "김포함상공원", "함상공원",
  "김포 장릉", "장릉", "김포 장릉(원종·인헌왕후)", "김포 장릉(원종·인헌왕후) [유네스코 세계유산]",
  "라베니체", "김포 라베니체", "라베니체 마치에비뉴", "김포 라베니체 마치에비뉴",
  "김포 아라마리나", "아라마리나",
  "대명항", "김포 대명항",
  "김포 현대 아울렛", "현대프리미엄아울렛 김포점", "김포 현대 프리미엄 아울렛", "현대 프리미엄 아울렛",
  "문수산성", "김포 문수산성",
  "애기봉평화생태공원", "김포 애기봉평화생태공원",
].map(normalize));

const hasNonTouristType = (type, typeNo) => {
  if (typeNo != null && String(typeNo).trim() && ![1, 3].includes(Number(typeNo))) return true;
  return /음식|카페|식당|의료|병원|한의원|체육|종교|체험농장|전시공연|문화시설|캠핑|야영|복지|지원센터|청소년|공공청사/.test(type);
};

export const getTop10IconKeyByName = (name) => {
  const normalizedName = normalize(name);
  return ICON_NAMES.find(([, names]) => names.some((keyword) => normalizedName.includes(keyword)))?.[0] ?? null;
};

export const isTop10Place = (place) => {
  if (!getTop10IconKeyByName(place?.placeName ?? place?.PLACE_NAME)) return false;
  const detail = normalize(place?.typeDetail ?? place?.typeDetailContent ?? place?.TYPE_DETAIL ?? place?.TYPE_DETAIL_CONTENT);
  const detailNo = String(place?.typeDetailNo ?? place?.TYPE_DETAIL_NO ?? "").trim();
  const type = normalize(place?.type ?? place?.TYPE);
  const typeNo = place?.typeNo ?? place?.TYPE_NO;
  if (detail) return detail === "김포TOP10";
  if (detailNo) return ["18", "46"].includes(detailNo);

  if (hasNonTouristType(type, typeNo)) return false;
  const name = normalize(place?.placeName ?? place?.PLACE_NAME).replaceAll("아웃렛", "아울렛");
  return TOP10_PLACE_NAMES.has(name);
};
export const getInitialTop10PinIndex = (pins = []) => {
  let selectedIndex = 0;
  let selectedRank = Infinity;
  let selectedKey = "";
  pins.forEach((place, index) => {
    if (!isTop10Place(place)) return;
    const name = normalize(place?.placeName ?? place?.PLACE_NAME);
    const icon = getTop10IconKeyByName(name);
    const rank = ICON_NAMES.findIndex(([key]) => key === icon);
    const key = JSON.stringify([
      place?.placeNo ?? place?.PLACE_NO ?? "",
      name,
      place?.xAxis ?? place?.X_AXIS ?? "",
      place?.yAxis ?? place?.Y_AXIS ?? "",
    ].map(String));
    if (rank < selectedRank || (rank === selectedRank && key < selectedKey)) {
      selectedIndex = index;
      selectedRank = rank;
      selectedKey = key;
    }
  });
  return selectedIndex;
};
