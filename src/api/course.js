import api from "./axios";

export const CourseAPI = {
  getFixedCourses: async (page = 1) =>
    api.get("/courses", {
      params: { page },
    }),

  getFixedCourse: async (courseNo, signal) =>
    api.get(`/courses/${courseNo}`, { signal }),

  getWaypointRecommendations: async (payload, signal) =>
    api.post("/courses/waypoints", payload, { signal }),

  getRecommendedRoute: async (payload, signal) =>
    api.post("/courses/recommendations", payload, { signal }),

  getRestaurants: async (payload, signal) =>
    api.post("/courses/restaurants", payload, { signal }),

  getCustomCourse: async (payload, signal) =>
    api.post("/courses/descriptions", payload, { signal }),
};
