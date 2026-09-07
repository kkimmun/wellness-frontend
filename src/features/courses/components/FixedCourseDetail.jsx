import { useEffect, useMemo, useState } from "react";
import { CourseAPI } from "../../../api/course";
import { BackButton } from "../../../components/Button/BackButton";
import { SecondaryButton } from "../../../components/Button/Button.styles";
import UserCourseDetail from "./UserCourseDetail";
import { buildFixedCourse, fetchFixedCourseRoute, fixedCourseStops } from "../utils/fixedCourse";
import * as S from "./UserCourseDetail.styles";

const initialState = { info: null, routeData: null, status: "loading", error: "", routeError: "" };

export default function FixedCourseDetail({ courseNo, pins, requestKey, onClose, onRouteChange, onRestaurantsChange, onRestaurantSelect }) {
  const [detail, setDetail] = useState(initialState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      let info;
      try {
        if (!/^\d+$/.test(courseNo) || !Number.isSafeInteger(Number(courseNo)) || Number(courseNo) <= 0) {
          throw new Error("올바르지 않은 고정 코스 번호입니다.");
        }
        const response = await CourseAPI.getFixedCourse(courseNo, controller.signal);
        if (controller.signal.aborted) return;
        info = response?.data;
        fixedCourseStops(info);
        setDetail({ ...initialState, info, status: "route-loading" });
      } catch (error) {
        if (controller.signal.aborted) return;
        setDetail({ ...initialState, status: "error", error: error?.message || "고정 코스를 불러오지 못했습니다." });
        return;
      }
      try {
        const routeData = await fetchFixedCourseRoute(info, controller.signal);
        if (controller.signal.aborted) return;
        setDetail({ ...initialState, info, routeData, status: "ready" });
      } catch (error) {
        if (controller.signal.aborted) return;
        setDetail({ ...initialState, info, status: "ready", routeError: error?.message || "고정 코스의 경로를 불러오지 못했습니다." });
      }
    };
    load();
    return () => controller.abort();
  }, [courseNo, attempt]);

  const course = useMemo(() => detail.info
    ? buildFixedCourse(detail.info, pins, detail.routeData) : null,
  [detail.info, detail.routeData, pins]);

  useEffect(() => {
    onRouteChange({ key: requestKey, routeData: course?.routeData || null });
  }, [course, requestKey, onRouteChange]);

  const retry = () => {
    setDetail(initialState);
    setAttempt((value) => value + 1);
  };

  if (course) {
    return <UserCourseDetail onRestaurantsChange={onRestaurantsChange} onRestaurantSelect={onRestaurantSelect}
      course={course}
      onBack={onClose}
      routeLoading={detail.status === "route-loading"}
      routeError={detail.routeError}
      onRetryRoute={retry}
    />;
  }

  return (
    <S.CourseCard aria-label="고정 코스 상세정보" aria-busy={detail.status === "loading"}>
      <S.BackRow><BackButton onClick={onClose} aria-label="지도 화면으로 돌아가기" />지도 화면으로</S.BackRow>
      <h1>고정 코스 상세보기</h1>
      {detail.status === "error" ? (
        <>
          <S.Feedback role="alert">{detail.error}</S.Feedback>
          <SecondaryButton type="button" onClick={retry}>다시 시도</SecondaryButton>
        </>
      ) : <S.Feedback role="status">로딩중 ...</S.Feedback>}
    </S.CourseCard>
  );
}
