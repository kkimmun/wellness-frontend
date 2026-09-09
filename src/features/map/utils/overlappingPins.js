const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getCoordinate = (place) => ({
  lat: Number(place?.yAxis ?? place?.Y_AXIS),
  lng: Number(place?.xAxis ?? place?.X_AXIS),
});

const getDistanceMeters = (left, right) => {
  const leftCoordinate = getCoordinate(left);
  const rightCoordinate = getCoordinate(right);
  const latitudeDelta = toRadians(
    rightCoordinate.lat - leftCoordinate.lat,
  );
  const longitudeDelta = toRadians(
    rightCoordinate.lng - leftCoordinate.lng,
  );
  const leftLatitude = toRadians(leftCoordinate.lat);
  const rightLatitude = toRadians(rightCoordinate.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(leftLatitude) *
      Math.cos(rightLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

const getPlaceKey = (place, index) => {
  const placeNo = place?.placeNo ?? place?.PLACE_NO;
  if (placeNo != null) return `place-${placeNo}`;

  const { lat, lng } = getCoordinate(place);
  return `${place?.placeName || "place"}-${lat}-${lng}-${index}`;
};

// 지도에서 서로 가려지는 가까운 장소를 하나의 순환 가능한 마커 그룹으로 묶는다.
export const groupOverlappingPins = (places = [], maxDistanceMeters = 30) => {
  const groups = [];

  places.forEach((place, index) => {
    const coordinate = getCoordinate(place);
    if (!Number.isFinite(coordinate.lat) || !Number.isFinite(coordinate.lng)) {
      return;
    }

    const matchingGroup = groups.find(
      (group) =>
        getDistanceMeters(group.pins[0], place) <= maxDistanceMeters,
    );

    if (matchingGroup) {
      matchingGroup.pins.push(place);
      matchingGroup.keys.push(getPlaceKey(place, index));
      matchingGroup.key = [...matchingGroup.keys].sort().join("|");
      return;
    }

    const placeKey = getPlaceKey(place, index);
    groups.push({
      key: placeKey,
      keys: [placeKey],
      pins: [place],
    });
  });

  return groups;
};

export const getCircularPinIndex = (index, length) => {
  if (!Number.isInteger(length) || length <= 0) return 0;
  return ((index % length) + length) % length;
};
