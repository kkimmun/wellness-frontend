import api from "../../../../api/axios";

// 공통 인스턴스가 /api, 인증 헤더와 응답 body 변환을 담당한다.
export const AdminCourseAPI = {
  getCourses: async ({ page = 1, keyword = "", active = "" } = {}, signal) => {
    const params = { page };
    if (keyword.trim()) params.keyword = keyword.trim();
    if (active) params.active = active;
    const body = await api.get("/admin/courses", { params, signal });
    if (!Array.isArray(body?.data?.content)) {
      throw new Error("코스 목록 응답을 확인할 수 없습니다.");
    }
    return body.data;
  },
  getCourse: async (courseNo, signal) => {
    const body = await api.get(`/admin/courses/${courseNo}`, { signal });
    return body.data;
  },
  createCourse: (payload) => api.post("/admin/courses", payload),
  updateCourse: (courseNo, payload) => api.put(`/admin/courses/${courseNo}`, payload),
  deleteCourse: (courseNo) => api.delete(`/admin/courses/${courseNo}`),
  updateStatus: (courseNo, active) => api.patch(`/admin/courses/${courseNo}/status`, { active }),
};
