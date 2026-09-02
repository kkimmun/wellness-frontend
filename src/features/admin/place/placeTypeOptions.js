/**
 * 명소 타입 (TYPE_DETAIL) 목록
 *
 * 테이블 설계상 명소 타입은 typeDetailNo(소분류 번호)로 관리한다.
 * typeNo(대분류) / type(대분류명) / detail(소분류명)은 화면 표시·그룹핑용이다.
 */
export const PLACE_TYPE_DETAILS = [
  { typeDetailNo: 1, typeNo: 1, type: "주요관광지", detail: "역사유적" },
  { typeDetailNo: 2, typeNo: 1, type: "주요관광지", detail: "자연명소" },
  { typeDetailNo: 3, typeNo: 2, type: "의료기관", detail: "종합병원" },
  { typeDetailNo: 4, typeNo: 2, type: "의료기관", detail: "한의원" },
  { typeDetailNo: 5, typeNo: 3, type: "관광지", detail: "체험형" },
  { typeDetailNo: 6, typeNo: 3, type: "관광지", detail: "전시형" },
  { typeDetailNo: 7, typeNo: 4, type: "생활체육시설", detail: "실내체육시설" },
  { typeDetailNo: 8, typeNo: 4, type: "생활체육시설", detail: "야외운동시설" },
  { typeDetailNo: 9, typeNo: 5, type: "종교시설", detail: "사찰" },
  { typeDetailNo: 10, typeNo: 5, type: "종교시설", detail: "성당교회" },
  { typeDetailNo: 11, typeNo: 6, type: "음식점", detail: "뷔페" },
  { typeDetailNo: 12, typeNo: 6, type: "음식점", detail: "생선회" },
  { typeDetailNo: 13, typeNo: 6, type: "음식점", detail: "일식" },
  { typeDetailNo: 14, typeNo: 6, type: "음식점", detail: "술집" },
  { typeDetailNo: 15, typeNo: 6, type: "음식점", detail: "중식" },
  { typeDetailNo: 16, typeNo: 6, type: "음식점", detail: "패스트푸드" },
  { typeDetailNo: 17, typeNo: 6, type: "음식점", detail: "탕류" },
  { typeDetailNo: 18, typeNo: 1, type: "주요관광지", detail: "김포TOP10" },
];

/** 대분류(type)별로 그룹핑한 목록 — <optgroup> 렌더링용 */
export const PLACE_TYPE_GROUPS = PLACE_TYPE_DETAILS.reduce((groups, item) => {
  const group = groups.find((g) => g.type === item.type);
  if (group) group.items.push(item);
  else groups.push({ type: item.type, items: [item] });
  return groups;
}, []);

/** typeDetailNo -> "대분류 > 소분류" 라벨 */
export const getTypeLabel = (typeDetailNo) => {
  const item = PLACE_TYPE_DETAILS.find(
    (t) => String(t.typeDetailNo) === String(typeDetailNo),
  );
  return item ? `${item.type} > ${item.detail}` : "";
};
