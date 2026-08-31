import api from "./axios";

export const PlaceAPI = {
  getPins: async () => {
    const response = await api.get("/api/places/pins");
    return response.data;
  },
};
