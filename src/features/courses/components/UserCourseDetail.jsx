import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiChevronDown, FiChevronUp, FiX, FiMapPin, FiCoffee } from "react-icons/fi";
import { SecondaryButton } from "../../../components/Button/Button.styles";
import { BackButton } from "../../../components/Button/BackButton";
import { TagBadge } from "../../../components/Badge/Badge.styles";
import { theme } from "../../../styles/theme";
import ReviewTab from "../../map/components/ReviewTab";
import { getCourseRoute } from "../utils/userCourseStorage";
import * as S from "./UserCourseDetail.styles";
import CoursePhoto from "./CoursePhoto";
import CourseRestaurants from "./CourseRestaurants";


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

export default function UserCourseDetail({ course, places = [], onBack, backLabel = "지도 화면으로", storageWarning, routeLoading = false, routeError = "", onRetryRoute, onRestaurantsChange, onRestaurantSelect }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [restaurantSegment, setRestaurantSegment] = useState(null);
  const [reviewPlace, setReviewPlace] = useState(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const stops = course.stops.map((stop) => {
    const place = Number.isSafeInteger(stop.placeNo)
      ? places.find((item) => item.placeNo === stop.placeNo) : null;
    return {
      ...stop,
      imageUrl: stop.imageUrl || place?.imageUrl,
      placeDescription: stop.placeDescription?.trim() || stop.description?.trim() || place?.placeDescription?.trim(),
      addr: stop.addr || place?.addr,
    };
  });
  const destination = stops.at(-1);

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
        <S.BackRow><BackButton onClick={onBack} aria-label={`${backLabel} 돌아가기`} />{backLabel}</S.BackRow>
        <header>
          <h1>{course.courseName}</h1>
          <S.CourseMetrics>{formatMetrics(getCourseRoute(course.routeData), course.estimatedTime)}</S.CourseMetrics>
        </header>
        <S.DestinationHero aria-label="도착지 사진">
          <S.PlacePhoto><CoursePhoto src={destination.imageUrl} name={destination.placeName} /></S.PlacePhoto>
          <figcaption><span>도착지</span><strong>{destination.placeName}</strong></figcaption>
        </S.DestinationHero>
        <S.Description>{course.description || "코스 설명이 없습니다."}</S.Description>
        {routeLoading && <S.Feedback role="status">코스 경로를 불러오는 중 ...</S.Feedback>}
        {routeError && <>
          <S.Feedback role="alert">{routeError}</S.Feedback>
          {onRetryRoute && <SecondaryButton type="button" onClick={onRetryRoute}>경로 다시 불러오기</SecondaryButton>}
        </>}
        <S.ItineraryHeader>
          <h2>방문 장소와 이동 구간</h2>
          <p>출발지부터 도착지까지 순서대로 살펴보세요.</p>
        </S.ItineraryHeader>
        <S.StopList aria-label="코스 방문 순서">
          {stops.map((stop, index) => {
            const isWaypoint = index > 0 && index < stops.length - 1;
            const nextStop = stops[index + 1];
            return (
              <li key={`${stop.placeNo ?? "origin"}-${index}`}>
                <span className="label">{index === 0 ? "출발" : nextStop ? index : "도착"}</span>
                <S.StopContent>
                  {isWaypoint && <small>중간코스 {index}</small>}
                  <h3>{stop.placeName}</h3>
                  {stop.addr && <S.StopAddress><FiMapPin aria-hidden="true" />{stop.addr}</S.StopAddress>}
                  {isWaypoint && <>
                    <S.PlacePhoto><CoursePhoto src={stop.imageUrl} name={stop.placeName} /></S.PlacePhoto>
                    <S.Description>{stop.waypointDescription?.trim() || stop.placeDescription || "등록된 설명이 없습니다."}</S.Description>
                  </>}
                </S.StopContent>
                {nextStop && (
                  <S.SegmentArea aria-label={`${stop.placeName}에서 ${nextStop.placeName}까지 이동 구간`}>
                    <span className="segment-label">구간 {index + 1} · {stop.placeName} → {nextStop.placeName}</span>
                    <S.SegmentButton
                      type="button"
                      $selected={restaurantSegment === index}
                      aria-expanded={restaurantSegment === index}
                      aria-controls={restaurantSegment === index ? "segment-restaurants-" + index : undefined}
                      onClick={() => setRestaurantSegment((selected) => selected === index ? null : index)}
                    >
                      <FiCoffee aria-hidden="true" />
                      <span>경로 주변 1km 음식점</span>
                      {restaurantSegment === index ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
                    </S.SegmentButton>
                    {restaurantSegment === index && <CourseRestaurants
                      key={index}
                      id={"segment-restaurants-" + index}
                      onRestaurantsChange={onRestaurantsChange}
                      onRestaurantSelect={onRestaurantSelect}
                      origin={stop}
                      destination={nextStop}
                      routeOption={course.routeData?.selectedOption || "SHORTEST"}
                    />}
                  </S.SegmentArea>
                )}
              </li>
            );
          })}
        </S.StopList>
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
