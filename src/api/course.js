import api from "./axios";

export const CourseAPI = {
  getFixedCourses: async (page = 1) =>
    api.get("/courses", {
      params: { page },
    }),
};
