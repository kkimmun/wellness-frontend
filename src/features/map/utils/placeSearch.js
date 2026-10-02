const normalizeSearchText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, "")
    .toLocaleLowerCase("ko-KR");

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
