import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiX } from "react-icons/fi";
import { SecondaryButton } from "../../../components/Button/Button.styles";
import { BackButton } from "../../../components/Button/BackButton";
import { TagBadge } from "../../../components/Badge/Badge.styles";
import { theme } from "../../../styles/theme";
import ReviewTab from "../../map/components/ReviewTab";
import { getCourseRoute } from "../utils/userCourseStorage";
import * as S from "./UserCourseDetail.styles";

function CoursePhoto({ src, name }) {
  const [failed, setFailed] = useState(false);
  return failed ? <S.PhotoPlaceholder>{name}<br />사진을 불러올 수 없습니다.</S.PhotoPlaceholder>
    : <img src={src} alt={`${name} 풍경`} onError={() => setFailed(true)} />;
}

function formatMetrics(route, estimatedTime) {
  const distance = Number.isFinite(route?.totalDistance)
    ? `약 ${(route.totalDistance / 1000).toFixed(1).replace(/\.0$/, "")}km` : "거리 정보 없음";
  const minutes = Number.isFinite(estimatedTime) && estimatedTime > 0
    ? Math.ceil(estimatedTime)
    : Number.isFinite(route?.totalTime) ? Math.max(1, Math.ceil(route.totalTime / 60)) : null;
  if (minutes === null) return `${distance}, 시간 정보 없음`;
  const hours = Math.floor(minutes / 60);
  return `${distance}, 소요시간 ${hours ? `${hours}시간 ` : ""}${minutes % 60 ? `${minutes % 60}분` : ""}`.trim();
}

export default function UserCourseDetail({ course, onBack, storageWarning, routeLoading = false, routeError = "", onRetryRoute }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewPlace, setReviewPlace] = useState(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const photos = course.stops.filter((stop) => stop.imageUrl).slice(0, 3);

  useEffect(() => {
    if (!reviewOpen) return undefined;
    closeRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setReviewOpen(false);
        setReviewPlace(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [reviewOpen]);

  const closeReviews = () => {
    setReviewOpen(false);
    setReviewPlace(null);
    triggerRef.current?.focus();
  };

  return (
    <>
      <S.CourseCard aria-label={course.courseKind === "FIXED" ? "고정 코스 상세정보" : "사용자 코스 상세정보"}>
        <S.BackRow><BackButton onClick={onBack} aria-label="지도 화면으로 돌아가기" />지도 화면으로</S.BackRow>
        <header>
          <h1>{course.courseName}</h1>
          <S.CourseMetrics>{formatMetrics(getCourseRoute(course.routeData), course.estimatedTime)}</S.CourseMetrics>
        </header>
        <S.Description>{course.description || "코스 설명이 없습니다."}</S.Description>
        {routeLoading && <S.Feedback role="status">코스 경로를 불러오는 중 ...</S.Feedback>}
        {routeError && <>
          <S.Feedback role="alert">{routeError}</S.Feedback>
          {onRetryRoute && <SecondaryButton type="button" onClick={onRetryRoute}>경로 다시 불러오기</SecondaryButton>}
        </>}
        <S.StopList aria-label="코스 방문 순서">
          {course.stops.map((stop, index) => (
            <li key={`${stop.placeNo ?? "origin"}-${index}`}>
              {index === 0 || index === course.stops.length - 1
                ? <span className="label">{index === 0 ? "출발" : "도착"}</span>
                : <span className="waypoint" aria-hidden="true">●</span>}
              <div><strong>{stop.placeName}</strong>{index > 0 && index < course.stops.length - 1 && <small>경유지 {index}</small>}</div>
            </li>
          ))}
        </S.StopList>
        {photos.length > 0 ? (
          <S.Gallery aria-label="코스 장소 사진">
            {photos.map((stop, index) => <CoursePhoto key={`${stop.imageUrl}-${index}`} src={stop.imageUrl} name={stop.placeName} />)}
          </S.Gallery>
        ) : <S.PhotoPlaceholder>등록된 코스 사진이 없습니다.</S.PhotoPlaceholder>}
        <S.TagList>{course.tags.map((tag) => <TagBadge key={tag} theme={theme}>#{tag}</TagBadge>)}</S.TagList>
        {storageWarning && <S.Feedback role="status">{storageWarning}</S.Feedback>}
        <S.ReviewButton ref={triggerRef} type="button" aria-expanded={reviewOpen} aria-controls="course-place-reviews" onClick={() => reviewOpen ? closeReviews() : setReviewOpen(true)}>
          코스 장소별 리뷰 보기 <FiChevronRight aria-hidden="true" />
        </S.ReviewButton>
      </S.CourseCard>

      {reviewOpen && (
        <S.ReviewPanel id="course-place-reviews" role="dialog" aria-modal="false" aria-label="코스 장소별 리뷰" $expanded={Boolean(reviewPlace)}>
          <header>
            <h2>{reviewPlace ? `${reviewPlace.placeName} 리뷰` : "리뷰 보기 장소 선택"}</h2>
            <button ref={closeRef} type="button" onClick={closeReviews} aria-label="코스 리뷰 닫기"><FiX /></button>
          </header>
          {reviewPlace ? (
            <>
              <S.PlaceChoice type="button" onClick={() => setReviewPlace(null)}>← 다른 장소 선택</S.PlaceChoice>
              <S.Feedback role="note">현재 리뷰 화면은 샘플 데이터를 표시합니다.</S.Feedback>
              <ReviewTab key={reviewPlace.placeNo} place={reviewPlace} />
            </>
          ) : course.stops.map((stop, index) => (
            <S.PlaceChoice key={`${stop.placeNo ?? "origin"}-${index}`} type="button" disabled={!Number.isSafeInteger(stop.placeNo) || stop.placeNo <= 0} onClick={() => setReviewPlace(stop)}>
              {stop.placeName}
              {!stop.placeNo && <small>등록된 관광지가 아니어서 리뷰가 없습니다.</small>}
            </S.PlaceChoice>
          ))}
        </S.ReviewPanel>
      )}
    </>
  );
}
