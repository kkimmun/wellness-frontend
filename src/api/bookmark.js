import api from "./axios";

export const BookmarkAPI = {
  toggle: async (placeNo) => {
    const response = await api.post(`/places/${placeNo}/bookmarks`);
    return response.data;
  },

  getStatus: async (placeNo) => {
    const response = await api.get(`/places/${placeNo}/bookmarks`);
    return response.data;
  },
};
