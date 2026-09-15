const normalizeSearchText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, "")
    .toLocaleLowerCase("ko-KR");

// 주소는 검색 대상에서 제외하고 DB 장소명·대분류·소분류만 검색한다.
export const filterDbPlaces = (places, keyword) => {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return [];

  return (Array.isArray(places) ? places : []).filter((place) => {
    if (!place || place.isExternal) return false;

    return [place.placeName, place.type, place.typeDetail].some((value) =>
      normalizeSearchText(value).includes(normalizedKeyword),
    );
  });
};
