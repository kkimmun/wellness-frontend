const STORAGE_KEY = "wellness.seen-recommendation-courses.v1";
const MAX_SEEN_COURSES = 30;

export const buildRecommendationConditionKey = ({
  startX,
  startY,
  placeCount,
  preferredPlaceNos,
  tagNos,
}) =>
  JSON.stringify({
    startX: Number(startX).toFixed(5),
    startY: Number(startY).toFixed(5),
    placeCount: Number(placeCount),
    preferredPlaceNos: [...preferredPlaceNos].map(Number).sort((a, b) => a - b),
    tagNos: [...tagNos].map(Number).sort((a, b) => a - b),
  });

const readAll = (storage = window.sessionStorage) => {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return parsed?.version === 1 && parsed.conditions ? parsed.conditions : {};
  } catch {
    return {};
  }
};

export const readSeenCourseSignatures = (conditionKey, storage) => {
  const values = readAll(storage)[conditionKey];
  return Array.isArray(values) ? values.filter(Boolean).slice(-MAX_SEEN_COURSES) : [];
};

export const rememberCourseSignature = (conditionKey, signature, storage) => {
  if (!conditionKey || !signature) return;
  const target = storage ?? window.sessionStorage;
  const conditions = readAll(target);
  const previous = Array.isArray(conditions[conditionKey])
    ? conditions[conditionKey]
    : [];
  conditions[conditionKey] = [...new Set([...previous, signature])].slice(
    -MAX_SEEN_COURSES,
  );
  target.setItem(STORAGE_KEY, JSON.stringify({ version: 1, conditions }));
};
