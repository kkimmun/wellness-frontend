import api from "./axios";

export const BookmarkAPI = {
  // 장소 북마크 토글: 등록돼 있으면 취소, 아니면 등록한다.
  // 응답 data 형식: { placeNo, bookmarked }
  toggle: async (placeNo) => {
    const response = await api.post(`/places/${placeNo}/bookmarks`);
    return response.data;
  },
};
