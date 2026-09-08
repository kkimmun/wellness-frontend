import api from "./axios";

const serializeRouteParams = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.append(key, value);
  });

  return searchParams.toString();
};

export const RouteAPI = {
  searchOriginPlaces: async (query, signal) => {
    // 지도 검색과 동일한 카카오 장소 검색을 사용한다. 외부 ID는 DB 번호가 아니다.
    const externalSearch = new Promise((resolve, reject) => {
      const cancel = () => {
        const error = new Error("검색이 취소되었습니다.");
        error.code = "ERR_CANCELED";
        reject(error);
      };
      if (signal?.aborted) return cancel();
      const services = window.kakao?.maps?.services;
      if (!services) {
        reject(new Error("장소 검색을 준비하지 못했습니다. 잠시 후 다시 검색해주세요."));
        return;
      }
      signal?.addEventListener("abort", cancel, { once: true });
      new services.Places().keywordSearch(query.trim(), (data, status) => {
        signal?.removeEventListener("abort", cancel);
        if (signal?.aborted) return cancel();
        if (status === services.Status.ZERO_RESULT) return resolve([]);
        if (status !== services.Status.OK) {
          reject(new Error("장소 검색에 실패했습니다. 다시 검색해주세요."));
          return;
        }
        resolve(data.map((place) => ({
          kakaoId: place.id,
          placeName: place.place_name,
          address: place.road_address_name || place.address_name,
          X_AXIS: Number(place.x),
          Y_AXIS: Number(place.y),
          isExternal: true,
        })));
      }, { page: 1, size: 15 });
    });
    const [local, external] = await Promise.allSettled([
      RouteAPI.searchPlaces(query, signal), externalSearch,
    ]);
    if (signal?.aborted) {
      const error = new Error("검색이 취소되었습니다.");
      error.code = "ERR_CANCELED";
      throw error;
    }
    // 일반 장소 검색 실패를 관광지 검색 성공으로 숨기지 않는다.
    if (external.status === "rejected") throw external.reason;
    const registered = local.status === "fulfilled" && Array.isArray(local.value)
      ? local.value : [];
    return [...registered, ...external.value];
  },

  searchPlaces: async (query, signal) => {
    const response = await api.get("/routes/origins", {
      params: { query },
      signal,
    });

    return response.data;
  },

  findRoutes: async (params, signal) => {
    const response = await api.get("/routes", {
      params,
      paramsSerializer: serializeRouteParams,
      signal,
    });

    return response.data;
  },
};
