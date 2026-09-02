import api from "./axios";

const serializeRouteParams = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.append(key, value);
  });

  return searchParams.toString();
};

export const RouteAPI = {
  searchPlaces: async (query, signal) => {
    const response = await api.get("/routes/origins", {
      params: { query },
      signal,
    });

    return response.data;
  },

  findRoutes: async (params, signal) => {
    const response = await api.get("/routes", {
      params,
      paramsSerializer: serializeRouteParams,
      signal,
    });

    return response.data;
  },
};
