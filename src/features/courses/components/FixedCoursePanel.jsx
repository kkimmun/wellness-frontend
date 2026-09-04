import { useEffect, useRef, useState } from "react";
import {
  FiChevronRight,
  FiClock,
  FiMap,
  FiMapPin,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { CourseAPI } from "../../../api/course";
import { getCourseRoute, readUserCourses } from "../utils/userCourseStorage";
import CourseCover from "./CourseCover";
import {
  CloseButton,
  CourseChoiceDialog,
  CourseChoiceActions,
  CourseCard,
  CourseDescription,
  CourseInfo,
  CourseList,
  CourseMeta,
  CourseName,
  EmptyState,
  ErrorState,
  Header,
  HeaderText,
  InfiniteScrollFooter,
  LoadingCard,
  PanelContainer,
  RetryButton,
  RouteInfo,
  UserCourseHint,
  UserCourseList,
} from "./FixedCoursePanel.styles";

const formatEstimatedTime = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return "시간 정보 없음";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}분`;
  if (remainingMinutes === 0) return `${hours}시간`;
  return `${hours}시간 ${remainingMinutes}분`;
};

const FixedCoursePanel = ({ onClose, onCourseSelect, selectedCourseNo, onUserCourseSelect, onCreateCourse, showUserCourses = false }) => {
  const [userCourses, setUserCourses] = useState(readUserCourses);
  const choiceDialogRef = useRef(null);
  const [userCoursesOpen] = useState(showUserCourses);
  const latestOrigin = userCourses[0]?.stops[0];
  const latestDestination = userCourses[0]?.stops.at(-1);
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const listRef = useRef(null);
  const sentinelRef = useRef(null);
  const requestingNextPageRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    CourseAPI.getFixedCourses(page)
      .then((response) => {
        if (isCancelled) return;

        const data = response?.data;
        const nextCourses = Array.isArray(data?.content) ? data.content : [];

        setCourses((currentCourses) => {
          if (page === 1) return nextCourses;

          const existingCourseNumbers = new Set(
            currentCourses.map((course) => String(course.courseNo)),
          );
          return [
            ...currentCourses,
            ...nextCourses.filter(
              (course) => !existingCourseNumbers.has(String(course.courseNo)),
            ),
          ];
        });
        setHasMore(
          (data?.currentPage ?? page) < Math.max(data?.totalPages ?? 1, 1),
        );
        setError("");
      })
      .catch((requestError) => {
        if (isCancelled) return;

        console.error(
          "고정 코스 목록을 불러오는 데 실패했습니다.",
          requestError,
        );
        if (page === 1) setCourses([]);
        setError(
          requestError?.message || "고정 코스 목록을 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!isCancelled) {
          requestingNextPageRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page, retryCount]);

  useEffect(() => {
    const listElement = listRef.current;
    const sentinelElement = sentinelRef.current;

    if (
      !listElement ||
      !sentinelElement ||
      !hasMore ||
      loading ||
      loadingMore ||
      error
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !requestingNextPageRef.current) {
          requestingNextPageRef.current = true;
          setLoadingMore(true);
          setPage((currentPage) => currentPage + 1);
        }
      },
      {
        root: listElement,
        rootMargin: "0px 0px 120px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinelElement);
    return () => observer.disconnect();
  }, [error, hasMore, loading, loadingMore]);

  const handleUserCourseClick = () => {
    const savedCourses = readUserCourses();
    setUserCourses(savedCourses);
    if (savedCourses.length === 0) {
      onCreateCourse();
      return;
    }
    choiceDialogRef.current.showModal();
  };

  const handleViewUserCourses = () => {
    choiceDialogRef.current.close();
    const savedCourse = readUserCourses()[0];
    if (savedCourse) {
      onUserCourseSelect(savedCourse);
    } else {
      onCreateCourse();
    }
  };

  const handleCreateUserCourse = () => {
    choiceDialogRef.current.close();
    onCreateCourse();
  };

  const handleRetry = () => {
    const isInitialRequest = courses.length === 0;
    requestingNextPageRef.current = !isInitialRequest;
    setLoading(isInitialRequest);
    setLoadingMore(!isInitialRequest);
    setError("");
    setRetryCount((value) => value + 1);
  };

  return (
    <PanelContainer aria-label="순례길 목록">
      <Header>
        <HeaderText>
          <h2>
            <FiMap aria-hidden="true" />
            순례길 목록
          </h2>
          <p>
            내가 만든 코스와 김포의 대표 순례길을 만나보세요.
          </p>
        </HeaderText>
        <CloseButton type="button" onClick={onClose} aria-label="순례길 목록 닫기">
          <FiX aria-hidden="true" />
        </CloseButton>
      </Header>

      <CourseList ref={listRef}>
        <li>
          <CourseCard
            type="button"
            $selected={userCoursesOpen}
            aria-haspopup="dialog"
            onClick={handleUserCourseClick}
          >
            <CourseCover src={latestDestination?.imageUrl} name={latestDestination?.placeName} number={0} />
            <CourseInfo>
              <CourseName>내가 만드는 순례자의 길</CourseName>
              <CourseDescription>나만의 순례길을 만들거나 저장된 순례길을 만나보세요.</CourseDescription>
              <CourseMeta>
                <RouteInfo>
                  <FiMapPin aria-hidden="true" />
                  <span>출발: {latestOrigin?.placeName || "미정"} · 도착: {latestDestination?.placeName || "미정"}</span>
                </RouteInfo>
                <span>{userCourses.length > 0 ? "보기 / 제작" : "제작하기"}<FiChevronRight aria-hidden="true" /></span>
              </CourseMeta>
            </CourseInfo>
          </CourseCard>
          <div id="my-pilgrim-courses" hidden={!userCoursesOpen}>
            <UserCourseHint>
              <span>이 브라우저에 저장된 코스입니다.</span>
              <RetryButton type="button" onClick={onCreateCourse}>새 순례자의 길 제작</RetryButton>
            </UserCourseHint>
            {userCourses.length > 0 && (
              <UserCourseList aria-label="내가 만든 코스 목록">
                {userCourses.map((course, index) => {
                  const destination = course.stops.at(-1);
                  const route = getCourseRoute(course.routeData);
                  return (
                    <li key={course.id}>
                      <CourseCard type="button" onClick={() => onUserCourseSelect(course)}>
                        <CourseCover src={destination.imageUrl} name={destination.placeName} number={index + 1} tone={index % 5} />
                        <CourseInfo>
                          <CourseName>{course.courseName}</CourseName>
                          <CourseDescription>{course.description}</CourseDescription>
                          <CourseMeta>
                            <RouteInfo>
                              <FiMapPin aria-hidden="true" />
                              <span>출발: {course.stops[0].placeName} · 도착: {destination.placeName}</span>
                            </RouteInfo>
                            <span><FiClock aria-hidden="true" />{formatEstimatedTime(Number.isFinite(route?.totalTime) ? Math.ceil(route.totalTime / 60) : null)}</span>
                          </CourseMeta>
                        </CourseInfo>
                      </CourseCard>
                    </li>
                  );
                })}
              </UserCourseList>
            )}
          </div>
        </li>

      {loading && (
        <li aria-label="고정 코스 목록 로딩 중" aria-busy="true">
          <UserCourseList>
          {[1, 2, 3, 4].map((item) => (
            <LoadingCard key={item} />
          ))}
          </UserCourseList>
        </li>
      )}

      {!loading && error && courses.length === 0 && (
        <ErrorState as="li" role="alert">
          <strong>목록을 불러오지 못했습니다.</strong>
          <span>{error}</span>
          <RetryButton type="button" onClick={handleRetry}>
            <FiRefreshCw aria-hidden="true" /> 다시 시도
          </RetryButton>
        </ErrorState>
      )}

      {!loading && !error && courses.length === 0 && (
        <EmptyState as="li">
          <FiMap aria-hidden="true" />
          <strong>등록된 고정 코스가 없습니다.</strong>
          <span>새로운 순례 코스가 준비되면 이곳에 표시됩니다.</span>
        </EmptyState>
      )}

      {courses.length > 0 && (
        <>
          {courses.map((course, index) => {
            const isSelected =
              String(course.courseNo) === String(selectedCourseNo);

            return (
              <li key={course.courseNo}>
                <CourseCard
                  type="button"
                  onClick={() => onCourseSelect(course)}
                  $selected={isSelected}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <CourseCover src={course.endPlaceImg || course.endPlace?.imageUrl} name={course.endPlace?.placeName} number={index + 1} tone={index % 5} courseNo={course.courseNo} />
                  <CourseInfo>
                    <CourseName>{course.courseName}</CourseName>
                    <CourseDescription>{course.description}</CourseDescription>
                    <CourseMeta>
                      <RouteInfo>
                        <FiMapPin aria-hidden="true" />
                        <span>
                          출발: {course.startPlace?.placeName || "미정"} · 도착:{" "}
                          {course.endPlace?.placeName || "미정"}
                        </span>
                      </RouteInfo>
                      <span>
                        <FiClock aria-hidden="true" />
                        {formatEstimatedTime(course.estimatedTime)}
                      </span>
                    </CourseMeta>
                  </CourseInfo>
                </CourseCard>
              </li>
            );
          })}

          <InfiniteScrollFooter ref={sentinelRef}>
            {loadingMore && <span>다음 코스를 불러오는 중...</span>}
            {!loadingMore && error && (
              <>
                <span role="alert">다음 코스를 불러오지 못했습니다.</span>
                <RetryButton type="button" onClick={handleRetry}>
                  <FiRefreshCw aria-hidden="true" /> 다시 시도
                </RetryButton>
              </>
            )}
            {!loadingMore && !error && !hasMore && (
              <span>모든 고정 코스를 확인했습니다.</span>
            )}
          </InfiniteScrollFooter>
        </>
      )}
      </CourseList>
      <CourseChoiceDialog ref={choiceDialogRef} aria-labelledby="course-choice-title" aria-describedby="course-choice-description">
        <Header>
          <HeaderText>
            <h2 id="course-choice-title">순례자의 길이 이미 존재합니다.</h2>
          </HeaderText>
          <CloseButton type="button" onClick={() => choiceDialogRef.current.close()} aria-label="선택창 닫기">
            <FiX aria-hidden="true" />
          </CloseButton>
        </Header>
        <p id="course-choice-description">기존 순례자의 길을 보거나 새로운 순례자의 길을 제작해 보세요.</p>
        <CourseChoiceActions>
          <RetryButton type="button" onClick={handleViewUserCourses}>기존 순례자의 길 보기</RetryButton>
          <RetryButton type="button" onClick={handleCreateUserCourse}>새로 제작하기</RetryButton>
        </CourseChoiceActions>
      </CourseChoiceDialog>
    </PanelContainer>
  );
};

export default FixedCoursePanel;
