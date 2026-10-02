import api from "../../../api/axios";

export const SensorAPI = {
  getSensorInfo: async (signal) => {
    const response = await api.get("/sensors", { signal });
    return response.data;
  },
};
