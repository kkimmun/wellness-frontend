import api from "./axios";

const data = (body) => body?.data ?? body;
export const MemberProfileAPI = {
  get: async (signal) => data(await api.get("/members/profile", { signal })),
  updateName: async (memberName) => data(await api.patch("/members/profile", { memberName })),
  updatePassword: async (currentPassword, newPassword) => data(await api.patch("/members/profile/password", { currentPassword, newPassword })),
  uploadPhoto: async (file) => {
    const form = new FormData(); form.append("imageFile", file);
    return data(await api.post("/members/profile/photo", form, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  removePhoto: async () => data(await api.delete("/members/profile/photo")),
};
