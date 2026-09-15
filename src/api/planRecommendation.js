import api from "./axios";

export const PlanRecommendationAPI = {
  getNearbyPlaces: async ({
    xAxis,
    yAxis,
    typeNo,
    excludePlaceNos = [],
    signal,
  }) => {
    const params = new URLSearchParams();
    params.set("xAxis", String(xAxis));
    params.set("yAxis", String(yAxis));
    if (typeNo != null) params.set("typeNo", String(typeNo));
    excludePlaceNos.forEach((placeNo) => {
      params.append("excludePlaceNos", String(placeNo));
    });

    const body = await api.get(`/plan-recommendations/nearby?${params}`, {
      signal,
    });
    return body?.data ?? body;
  },
};
