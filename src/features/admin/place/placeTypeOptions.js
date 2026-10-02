export const PLACE_TYPE_DETAILS = [
  { typeDetailNo: 1, typeNo: 1, type: "주요관광지", detail: "역사유적" },
  { typeDetailNo: 2, typeNo: 1, type: "주요관광지", detail: "자연명소" },
  { typeDetailNo: 18, typeNo: 1, type: "주요관광지", detail: "김포 TOP 10" },
  { typeDetailNo: 19, typeNo: 1, type: "주요관광지", detail: "공원" },
  { typeDetailNo: 3, typeNo: 2, type: "의료기관", detail: "종합병원" },
  { typeDetailNo: 4, typeNo: 2, type: "의료기관", detail: "한의원" },
  { typeDetailNo: 5, typeNo: 3, type: "관광지", detail: "체험형" },
  { typeDetailNo: 6, typeNo: 3, type: "관광지", detail: "전시형" },
  { typeDetailNo: 7, typeNo: 4, type: "체육시설", detail: "수영장" },
  { typeDetailNo: 8, typeNo: 4, type: "체육시설", detail: "클라이밍/암벽등반" },
  { typeDetailNo: 9, typeNo: 5, type: "종교시설", detail: "사찰" },
  { typeDetailNo: 10, typeNo: 5, type: "종교시설", detail: "성당교회" },
  { typeDetailNo: 11, typeNo: 6, type: "음식점", detail: "양식" },
  { typeDetailNo: 12, typeNo: 6, type: "음식점", detail: "생선회" },
  { typeDetailNo: 13, typeNo: 6, type: "음식점", detail: "일식" },
  { typeDetailNo: 14, typeNo: 6, type: "음식점", detail: "카페" },
  { typeDetailNo: 15, typeNo: 6, type: "음식점", detail: "중식" },
  { typeDetailNo: 16, typeNo: 6, type: "음식점", detail: "패스트푸드" },
  { typeDetailNo: 17, typeNo: 6, type: "음식점", detail: "한식" },
  { typeDetailNo: 20, typeNo: 7, type: "체험", detail: "체험농장" },
  { typeDetailNo: 21, typeNo: 8, type: "문화시설", detail: "전시 시설" },
  { typeDetailNo: 22, typeNo: 8, type: "문화시설", detail: "공연 시설" },
  { typeDetailNo: 23, typeNo: 8, type: "문화시설", detail: "문화 시설" },
  { typeDetailNo: 24, typeNo: 9, type: "자연/생태", detail: "생태 공원" },
  { typeDetailNo: 27, typeNo: 9, type: "자연/생태", detail: "캠핑" },
  { typeDetailNo: 25, typeNo: 10, type: "복지시설", detail: "외국인지원센터" },
  { typeDetailNo: 26, typeNo: 10, type: "복지시설", detail: "청소년 시설" },
];

export const PLACE_TYPE_GROUPS = PLACE_TYPE_DETAILS.reduce((groups, item) => {
  const group = groups.find((g) => g.type === item.type);
  if (group) group.items.push(item);
  else groups.push({ type: item.type, items: [item] });
  return groups;
}, []);

export const getTypeLabel = (typeDetailNo) => {
  const item = PLACE_TYPE_DETAILS.find(
    (t) => String(t.typeDetailNo) === String(typeDetailNo),
  );
  return item ? `${item.type} > ${item.detail}` : "";
};
