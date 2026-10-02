import api from "./axios";

export const PlaceAPI = {
  getByTypeDetail: async (typeDetailNo, signal) => {
    const response = await api.get(`/places/${typeDetailNo}`, { signal });
    return response.data;
  },

  getPins: async (signal) => {
    const response = await api.get("/places/pins", { signal });
    return response.data;
  },

  getPinsByFilters: async (filters, signal) => {
    const response = await api.get("/places/pins", { params: filters, signal });
    return response.data;
  },

  getTypeOptions: async () => {
    const response = await api.get("/places/type-options");
    return response.data;
  },

  getTagOptions: async () => {
    const response = await api.get("/places/tag-options");
    return response.data;
  },

  getPinsByType: async (type) => {
    const response = await api.get("/places/types", {
      params: { type },
    });
    return response.data;
  },

  getPinsByTag: async (tag) => {
    const response = await api.get("/places/tags", {
      params: { tag },
    });
    return response.data;
  },

  getPlaceDetail: async (placeNo) => {
    const response = await api.get(`/places/${placeNo}/detail`);
    return response.data;
  },

  getGimpoTop10: async () => {
    const response = await api.get("/places?typeDetailNo=18");
    return response;
  },

  getReviews: async (placeNo, page = 1, signal) => {
    const response = await api.get(`/places/${placeNo}/reviews`, {
      params: { page },
      signal,
    });
    return response.data;
  },

  getReview: async (placeNo, reviewNo) => {
    const response = await api.get(`/places/${placeNo}/reviews/${reviewNo}`);
    return response.data;
  },

  createReview: async (placeNo, formData) => {
    const response = await api.post(`/places/${placeNo}/reviews`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteReview: async (placeNo, reviewNo) => {
    const response = await api.delete(`/places/${placeNo}/reviews/${reviewNo}`);
    return response.data;
  },

  updateReview: async (placeNo, reviewNo, formData) => {
    const response = await api.patch(
      `/places/${placeNo}/reviews/${reviewNo}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
