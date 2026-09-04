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


  getPlaceDetail: async (placeNo) => {
    // 장소 상세 API는 대표 이미지가 아닌 활성 이미지 전체와 설명을 반환한다.
    const response = await api.get(`/places/${placeNo}/detail`);
    return response.data;
  },

  getGimpoTop10: async () => {
    // 백엔드 명세에 따른 요청 URL (axios 인스턴스의 baseURL 설정에 따라 /api 유무가 다를 수 있음)
    // 기존 코드들의 패턴을 따라 /gimpoTop10 으로 호출합니다.
    const response = await api.get("/gimpoTop10");
    return response; // ApiResponse 형식 (code, data, message) 전체 반환
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
