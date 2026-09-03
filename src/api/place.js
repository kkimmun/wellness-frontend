import api from "./axios";

export const PlaceAPI = {
  getByTypeDetail: async (typeDetailNo, signal) => {
    const response = await api.get("/places/" + typeDetailNo, { signal });
    return response.data;
  },

  getPins: async () => {
    const response = await api.get("/places/pins");
    return response.data;
  },

  // DB 장소 필터 연동: TYPE 또는 TYPE_DETAIL의 정확한 이름으로 지도 핀을 조회한다.
  getPinsByType: async (type) => {
    const response = await api.get("/places/types", {
      params: { type },
    });
    return response.data;
  },

  // DB 장소 필터 연동: TAG_CONTENT의 정확한 이름으로 지도 핀을 조회한다.
  getPinsByTag: async (tag) => {
    const response = await api.get("/places/tags", {
      params: { tag },
    });
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
