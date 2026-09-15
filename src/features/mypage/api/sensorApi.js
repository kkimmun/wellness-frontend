import api from "../../../api/axios";

export const SensorAPI = {
  // 만보기 상세조회: 로그인한 회원의 당일 걸음 수 기록을 시간순으로 반환한다.
  getSensorInfo: async (signal) => {
    const response = await api.get("/sensors", { signal });
    return response.data;
  },
};
