/**
 * 명소 타입 (TYPE / TYPE_DETAIL) 목록
 *
 * 테이블 설계상 명소 타입은 typeDetailNo(소분류 번호)로 관리한다.
 * typeNo(대분류) / type(대분류명) / detail(소분류명)은 화면 표시·그룹핑용이다.
 *
 * 아래 값은 DB의 TYPE / TYPE_DETAIL 마스터와 번호까지 동일하게 맞춘 것이다.
 * (지도 필터는 /places/type-options 를 직접 조회하므로 이 파일은 어드민 화면 전용)
 *
 * 대분류(TYPE) 참고 — typeNo / type / 추천 거리 제한(m)
 *   1 주요관광지 10000 · 2 의료기관 2000 · 3 관광지 8000 · 4 체육시설 2000
 *   5 종교시설 10000 · 6 음식점 3000 · 7 체험 8000 · 8 문화시설 5000
 *   9 자연/생태 8000 · 10 복지시설 2000 · 11 공공시설 3000
 * ※ 11 공공시설은 아직 등록된 소분류(TYPE_DETAIL)가 없어 목록에서 제외한다.
 */
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
