import api from "./axios";

const toPlanRequest = (places) =>
  (Array.isArray(places) ? places : []).map((place, index) => ({
    placeNo: Number(place.placeNo),
    placeOrder: index + 1,
  }));

export const PlanAPI = {
  getSavedPlan: async () => {
    const body = await api.get("/plans");
    const data = body?.data ?? body;
    return Array.isArray(data) ? data : [];
  },

  savePlan: async (places) => {
    const body = await api.put("/plans", toPlanRequest(places));
    return body?.data ?? body;
  },

  deletePlan: async () => {
    const body = await api.delete("/plans");
    return body?.data ?? body;
  },
};
