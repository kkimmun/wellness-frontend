import api from "./axios";

export const CourseAPI = {
  getFixedCourses: async (page = 1) =>
    api.get("/courses", {
      params: { page },
    }),

  getWaypointRecommendations: async (payload, signal) =>
    api.post("/courses/waypoints", payload, { signal }),

  getRecommendedRoute: async (payload, signal) =>
    api.post("/courses/recommendations", payload, { signal }),

  getCustomCourse: async (payload, signal) =>
    api.post("/courses/descriptions", payload, { signal }),
};
