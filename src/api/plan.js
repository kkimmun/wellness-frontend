import api from "./axios";

const toOrigin = (plan) => ({
  placeName: "저장한 시작 위치",
  address: "저장한 시작 위치",
  xAxis: Number(plan?.xAxis),
  yAxis: Number(plan?.yAxis),
});

const toSavedPlanSummary = (plan) => ({
  id: String(plan.planNo),
  planNo: Number(plan.planNo),
  kind: "plan",
  name: plan.planName,
  origin: toOrigin(plan),
  placeCount: Number(plan.placeCount ?? 0),
  places: [],
  createdAt: plan.createDate,
  updatedAt: plan.createDate,
});

const toSavedPlanDetail = (plan) => ({
  ...toSavedPlanSummary({
    ...plan,
    placeCount: plan?.places?.length ?? 0,
  }),
  places: (Array.isArray(plan?.places) ? plan.places : [])
    .map((place) => ({
      ...place,
      placeNo: Number(place.placeNo),
      placeOrder: Number(place.placeOrder),
      xAxis: Number(place.xAxis),
      yAxis: Number(place.yAxis),
    }))
    .sort((a, b) => a.placeOrder - b.placeOrder),
});

export const PlanAPI = {
  getPlans: async () => {
    const body = await api.get("/plans");
    const data = body?.data ?? body;
    return (Array.isArray(data) ? data : []).map(toSavedPlanSummary);
  },

  getPlan: async (planNo) => {
    const body = await api.get(`/plans/${planNo}`);
    const data = body?.data ?? body;
    return data ? toSavedPlanDetail(data) : null;
  },

  getNearbyPlaces: async (xAxis, yAxis, signal) => {
    const body = await api.get("/plans/nearby", {
      params: { xAxis, yAxis },
      signal,
    });
    const data = body?.data ?? body;
    return Array.isArray(data) ? data : [];
  },

  // PlanCreateRequestDto: { planName, xAxis, yAxis } -> PlanCreateResponseDto: { planNo }
  createPlan: async ({ planName, xAxis, yAxis }) => {
    const body = await api.post("/plans", { planName, xAxis, yAxis });
    const data = body?.data ?? body;
    return data?.planNo ?? null;
  },

  updatePlan: async (planNo, { planName, xAxis, yAxis }) => {
    await api.put(`/plans/${planNo}`, { planName, xAxis, yAxis });
  },

  // List<PlanPlaceRequestDto>: [{ placeNo, placeOrder }]
  addPlaces: async (planNo, places) => {
    await api.post(`/plans/${planNo}/places`, places);
  },

  editPlaces: async (planNo, places) => {
    await api.put(`/plans/${planNo}/places`, places);
  },

  deletePlan: async (planNo) => {
    await api.delete(`/plans/${planNo}`);
  },
};
