import api from "./axios";

export const CourseRecommendationAPI = {
  recommendCourse: async (payload, signal) => {
    const body = await api.post("/course-recommendations", payload, { signal });
    return body?.data ?? body;
  },
};
