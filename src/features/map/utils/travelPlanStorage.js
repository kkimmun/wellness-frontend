export const TRAVEL_PLAN_STORAGE_KEY = "wellness.travel-plans.v1";
export const TRAVEL_PLAN_DRAFT_KEY = "wellness.travel-plan-drafts.v1";
export const MAX_TRAVEL_PLAN_PLACES = 10;

const isCoordinate = (value, limit) =>
  Number.isFinite(Number(value)) && Math.abs(Number(value)) <= limit;

const normalizePoint = (point) => {
  if (
    !point ||
    !isCoordinate(point.xAxis ?? point.X_AXIS, 180) ||
    !isCoordinate(point.yAxis ?? point.Y_AXIS, 90)
  ) {
    return null;
  }

  return {
    ...point,
    xAxis: Number(point.xAxis ?? point.X_AXIS),
    yAxis: Number(point.yAxis ?? point.Y_AXIS),
  };
};

const normalizePlaces = (places) =>
  (Array.isArray(places) ? places : [])
    .map(normalizePoint)
    .filter(
      (place) =>
        place && Number.isSafeInteger(Number(place.placeNo)) && Number(place.placeNo) > 0,
    )
    .slice(0, MAX_TRAVEL_PLAN_PLACES);

const readCollection = (storage) => {
  try {
    const value = JSON.parse(
      (storage ?? window.localStorage).getItem(TRAVEL_PLAN_STORAGE_KEY),
    );
    return value?.version === 1 && Array.isArray(value.plans)
      ? value.plans
      : [];
  } catch {
    return [];
  }
};

export const readTravelPlans = (ownerKey, storage) =>
  readCollection(storage)
    .filter(
      (plan) =>
        plan?.ownerKey === ownerKey &&
        typeof plan.id === "string" &&
        typeof plan.name === "string" &&
        plan.name.trim() &&
        normalizePoint(plan.origin) &&
        normalizePlaces(plan.places).length > 0,
    )
    .map((plan) => ({
      ...plan,
      origin: normalizePoint(plan.origin),
      places: normalizePlaces(plan.places),
    }));

export const saveTravelPlan = ({ ownerKey, name, origin, places }, storage) => {
  const target = storage ?? window.localStorage;
  const normalizedOrigin = normalizePoint(origin);
  const normalizedPlaces = normalizePlaces(places);
  if (!ownerKey || !name?.trim() || !normalizedOrigin || normalizedPlaces.length === 0) {
    return null;
  }

  const plan = {
    id: crypto.randomUUID(),
    ownerKey,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    origin: normalizedOrigin,
    places: normalizedPlaces,
  };
  const plans = [plan, ...readCollection(target)];
  target.setItem(
    TRAVEL_PLAN_STORAGE_KEY,
    JSON.stringify({ version: 1, plans }),
  );
  return plan;
};

export const deleteTravelPlan = (ownerKey, planId, storage) => {
  const target = storage ?? window.localStorage;
  const plans = readCollection(target).filter(
    (plan) => !(plan?.ownerKey === ownerKey && plan?.id === planId),
  );
  target.setItem(
    TRAVEL_PLAN_STORAGE_KEY,
    JSON.stringify({ version: 1, plans }),
  );
};

export const readTravelPlanDraft = (ownerKey, storage) => {
  try {
    const value = JSON.parse(
      (storage ?? window.localStorage).getItem(TRAVEL_PLAN_DRAFT_KEY),
    );
    const draft = value?.version === 1 ? value.drafts?.[ownerKey] : null;
    const origin = normalizePoint(draft?.origin);
    if (!origin) return null;
    return {
      origin,
      places: normalizePlaces(draft.places),
    };
  } catch {
    return null;
  }
};

export const saveTravelPlanDraft = ({ ownerKey, origin, places }, storage) => {
  const target = storage ?? window.localStorage;
  const normalizedOrigin = normalizePoint(origin);
  if (!ownerKey || !normalizedOrigin) return false;

  let drafts = {};
  try {
    const current = JSON.parse(target.getItem(TRAVEL_PLAN_DRAFT_KEY));
    if (current?.version === 1 && current.drafts) drafts = current.drafts;
  } catch {
    drafts = {};
  }
  target.setItem(
    TRAVEL_PLAN_DRAFT_KEY,
    JSON.stringify({
      version: 1,
      drafts: {
        ...drafts,
        [ownerKey]: {
          origin: normalizedOrigin,
          places: normalizePlaces(places),
        },
      },
    }),
  );
  return true;
};

export const clearTravelPlanDraft = (ownerKey, storage) => {
  const target = storage ?? window.localStorage;
  try {
    const current = JSON.parse(target.getItem(TRAVEL_PLAN_DRAFT_KEY));
    if (current?.version !== 1 || !current.drafts) return;
    const drafts = { ...current.drafts };
    delete drafts[ownerKey];
    target.setItem(
      TRAVEL_PLAN_DRAFT_KEY,
      JSON.stringify({ version: 1, drafts }),
    );
  } catch {
    target.removeItem(TRAVEL_PLAN_DRAFT_KEY);
  }
};
