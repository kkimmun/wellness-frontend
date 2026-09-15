import api from "./axios";

export const PlanAPI = {
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
