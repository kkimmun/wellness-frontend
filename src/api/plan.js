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
};
