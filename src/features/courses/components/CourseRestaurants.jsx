import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiRefreshCw } from "react-icons/fi";
import { CourseAPI } from "../../../api/course";
import { SecondaryButton } from "../../../components/Button/Button.styles";
import { buildRestaurantRequest, readRestaurants } from "../utils/courseRestaurants";
import CoursePhoto from "./CoursePhoto";
import * as S from "./UserCourseDetail.styles";

const initialState = { status: "loading", restaurants: [], error: "" };

export default function CourseRestaurants({ origin, destination, routeOption, id, onRestaurantsChange, onRestaurantSelect }) {
  const resultsRef = useRef(null);
  const [state, setState] = useState(initialState);
  const [attempt, setAttempt] = useState(0);
  // 사진·설명이 나중에 보완되어도 같은 구간의 경로를 다시 조회하지 않는다.
  const requestKey = JSON.stringify({
    origin: { placeNo: origin.placeNo, xAxis: origin.X_AXIS ?? origin.xAxis, yAxis: origin.Y_AXIS ?? origin.yAxis },
    destination: { placeNo: destination.placeNo, xAxis: destination.X_AXIS ?? destination.xAxis, yAxis: destination.Y_AXIS ?? destination.yAxis },
    routeOption,
  });
  const current = state.requestKey === requestKey ? state : initialState;

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return null;
      const segment = JSON.parse(requestKey);
      return CourseAPI.getRestaurants(
        buildRestaurantRequest(segment.origin, segment.destination, segment.routeOption), controller.signal,
      );
    }).then((response) => {
      if (controller.signal.aborted) return;
      setState({ requestKey, status: "ready", restaurants: readRestaurants(response), error: "" });
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setState({ requestKey, status: "error", restaurants: [],
        error: error?.message || "주변 음식점을 불러오지 못했습니다. 다시 시도해주세요." });
    });
    return () => controller.abort();
  }, [requestKey, attempt]);

  useEffect(() => {
    onRestaurantsChange?.(current.restaurants.map(({ place }) => place));
    return () => onRestaurantsChange?.([]);
  }, [current.restaurants, onRestaurantsChange]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => resultsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    }));
    return () => cancelAnimationFrame(frame);
  }, [requestKey, current.status]);

  const retry = () => {
    setState({ ...initialState, requestKey });
    setAttempt((value) => value + 1);
  };

  return (
    <S.RestaurantResults ref={resultsRef} id={id} role="region" aria-label={origin.placeName + " → " + destination.placeName + " 주변 음식점"} aria-busy={current.status === "loading"}>
      {current.status === "loading" && <S.Feedback role="status">구간 경로와 주변 음식점을 불러오는 중입니다.</S.Feedback>}
      {current.status === "error" && <>
        <S.Feedback role="alert">{current.error}</S.Feedback>
        <SecondaryButton type="button" onClick={retry}><FiRefreshCw aria-hidden="true" /> 다시 시도</SecondaryButton>
      </>}
      {current.status === "ready" && <>
        <S.RestaurantSummary role="status">{current.restaurants.length > 0
          ? "주변 음식점 " + current.restaurants.length + "곳 · 가까운 순"
          : "이 구간의 경로 주변 1km 이내에 등록된 음식점이 없습니다."}</S.RestaurantSummary>
        {current.restaurants.length > 0 && <>
          <S.RestaurantDistanceNote>거리는 도보 이동 거리가 아닌 경로와 음식점 사이의 직선거리입니다.</S.RestaurantDistanceNote>
          <S.RestaurantList aria-label="주변 음식점 목록">
            {current.restaurants.map(({ place, distance }) => (
              <li key={place.placeNo}>
              <S.RestaurantCard type="button" onClick={() => onRestaurantSelect?.(place)} aria-label={place.placeName + " 상세정보 보기"}>
                <S.RestaurantPhoto><CoursePhoto src={place.imageUrl} name={place.placeName} /></S.RestaurantPhoto>
                <S.RestaurantInfo>
                  <h4>{place.placeName}</h4>
                  <S.RestaurantDistance>경로에서 약 {Math.round(distance)}m</S.RestaurantDistance>
                  <S.StopAddress><FiMapPin aria-hidden="true" />{place.addr || "주소 정보가 없습니다."}</S.StopAddress>
                <S.RestaurantLink>상세정보 보기 →</S.RestaurantLink>
                </S.RestaurantInfo>
                {place.placeDescription && <S.RestaurantDescription>{place.placeDescription}</S.RestaurantDescription>}
              </S.RestaurantCard>
              </li>
            ))}
          </S.RestaurantList>
        </>}
      </>}
    </S.RestaurantResults>
  );
}
