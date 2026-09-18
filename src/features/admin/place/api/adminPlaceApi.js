import api from "../../../../api/axios";

export const AdminPlaceAPI = {
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

  getPlace: async (placeNo) => {
    const body = await api.get(`/admin/places/${placeNo}`);
    return body.data;
  },

  createPlace: async (formData) => {
    const body = await api.post("/admin/places", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return body;
  },

  updatePlace: async (placeNo, formData) => {
    const body = await api.patch(`/admin/places/${placeNo}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return body.data;
  },

  updatePlaceImageOrder: async (placeNo, imgNos) => {
    const body = await api.patch(`/admin/places/${placeNo}/images/order`, {
      imgNos,
    });
    return body;
  },

  updatePlaceImageLicenses: async (placeNo, licenses) => {
    const body = await api.put(`/admin/places/${placeNo}/images/licenses`, {
      licenses,
    });
    return body;
  },

  deletePlaceImage: async (placeNo, imgNo) => {
    return api.delete(`/admin/places/${placeNo}/images/${imgNo}`);
  },

  deletePlaces: async (placeNos) => {
    const body = await api.delete("/admin/places", { data: { placeNos } });
    return body;
  },

  restorePlaces: async (placeNos) => {
    const body = await api.patch("/admin/places", { placeNos });
    return body;
  },
};
