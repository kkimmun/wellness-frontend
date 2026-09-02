import api from "../../../../api/axios";

/**
 * 어드민 명소 관리 API
 *
 * - 목록 조회와 검색은 동일 엔드포인트를 사용한다. (keyword 없으면 전체 목록)
 * - 삭제/복구는 단건·다건 모두 placeNos 배열로 전달한다.
 * - baseURL에 이미 /api 가 포함되어 있으므로 경로에 /api 를 붙이지 않는다.
 * - axios 응답 인터셉터가 response.data(=body)를 반환하므로 여기서는 body.data(payload)를 반환한다.
 */
export const AdminPlaceAPI = {
  /**
   * 명소 목록 조회 / 검색
   * @param {{ page?: number, keyword?: string, target?: string }} params
   *  - page: 1부터 시작
   *  - target: all | placeName | placeDetailNo
   * @returns {{ content: [], currentPage, size, totalElements, totalPages }}
   */
  getPlaces: async ({ page = 1, keyword = "", target = "all" } = {}) => {
    const params = { page };
    const trimmed = keyword.trim();
    if (trimmed) {
      params.keyword = trimmed;
      params.target = target;
    }
    const body = await api.get("/admin/places", { params });
    return body.data;
  },

  /**
   * 명소 상세 조회 (수정 화면 최초 진입 시에도 사용)
   * @param {number|string} placeNo
   * @returns {{ createDate, placeName, placeDescrpition, xAxis, yAxis, typeDetailNo, addr, placeImages: [] }}
   */
  getPlace: async (placeNo) => {
    const body = await api.get(`/admin/places/${placeNo}`);
    return body.data;
  },

  /**
   * 명소 추가 (multipart/form-data)
   * form-data 필드: placeName, placeDescription, addr, typeDetailNo, x_axis, y_axis, viewCount, imageFiles
   * @param {FormData} formData
   */
  createPlace: async (formData) => {
    const body = await api.post("/admin/places", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return body;
  },

  /**
   * 명소 수정 (multipart/form-data)
   * form-data 필드: placeName, placeDescription, addr, typeDetailNo, x_axis, y_axis, imageFiles
   * @param {number|string} placeNo
   * @param {FormData} formData
   */
  updatePlace: async (placeNo, formData) => {
    const body = await api.patch(`/admin/places/${placeNo}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return body;
  },

  /**
   * 명소 삭제 (del_yn = Y)
   * @param {number[]} placeNos
   */
  deletePlaces: async (placeNos) => {
    const body = await api.delete("/admin/places", { data: { placeNos } });
    return body;
  },

  /**
   * 명소 복구 (del_yn = N)
   * @param {number[]} placeNos
   */
  restorePlaces: async (placeNos) => {
    const body = await api.patch("/admin/places", { placeNos });
    return body;
  },
};
