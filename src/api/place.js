import api from "./axios";

export const PlaceAPI = {
  getPins: async () => {
    const response = await api.get("/api/places/pins");
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (placeNo, reviewNo) => {
    const response = await api.delete(`/api/places/${placeNo}/reviews/${reviewNo}`);
    return response.data;
  },

  // 리뷰 수정
  updateReview: async (placeNo, reviewNo, formData) => {
    // URL이 스펙에 따라 2가지(form, reviews)로 혼동될 수 있으므로 RESTful 방식을 따름
    const response = await api.patch(`/api/places/${placeNo}/reviews/${reviewNo}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
