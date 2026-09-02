import api from "./axios";

export const PlaceAPI = {
  getPins: async () => {
    const response = await api.get("/places/pins");
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
    // URL이 스펙에 따라 2가지(form, reviews)로 혼동될 수 있으므로 RESTful 방식을 따름
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
