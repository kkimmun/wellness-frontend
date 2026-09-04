import { useEffect, useRef, useState } from "react";
import {
  FiMap,
  FiMapPin,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { CourseAPI } from "../../../api/course";
import {
  CloseButton,
  CourseCard,
  CourseDescription,
  CourseInfo,
  CourseList,
  CourseMeta,
  CourseName,
  CourseThumbnail,
  EmptyState,
  ErrorState,
  Header,
  HeaderText,
  InfiniteScrollFooter,
  LoadingCard,
  NumberBadge,
  PanelContainer,
  RetryButton,
  RouteInfo,
} from "./FixedCoursePanel.styles";

const FixedCoursePanel = ({ onClose, onCourseSelect, selectedCourseNo }) => {
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

  const handleRetry = () => {
    const isInitialRequest = courses.length === 0;
    requestingNextPageRef.current = !isInitialRequest;
    setLoading(isInitialRequest);
    setLoadingMore(!isInitialRequest);
    setError("");
    setRetryCount((value) => value + 1);
  };

  return (
    <PanelContainer aria-label="순례길 고정 코스 목록">
      <Header>
        <HeaderText>
          <h2>
            <FiMap aria-hidden="true" />
            순례길 고정코스 추천
          </h2>
          <p>
            김포의 역사와 아름다운 자연을 느낄 수 있는 대표적인 순례
            코스입니다.
          </p>
        </HeaderText>
        <CloseButton type="button" onClick={onClose} aria-label="고정 코스 닫기">
          <FiX aria-hidden="true" />
        </CloseButton>
      </Header>

      {loading && (
        <CourseList aria-label="고정 코스 목록 로딩 중" aria-busy="true">
          {[1, 2, 3, 4].map((item) => (
            <LoadingCard key={item} />
          ))}
        </CourseList>
      )}

      {!loading && error && courses.length === 0 && (
        <ErrorState role="alert">
          <strong>목록을 불러오지 못했습니다.</strong>
          <span>{error}</span>
          <RetryButton type="button" onClick={handleRetry}>
            <FiRefreshCw aria-hidden="true" /> 다시 시도
          </RetryButton>
        </ErrorState>
      )}

      {!loading && !error && courses.length === 0 && (
        <EmptyState>
          <FiMap aria-hidden="true" />
          <strong>등록된 고정 코스가 없습니다.</strong>
          <span>새로운 순례 코스가 준비되면 이곳에 표시됩니다.</span>
        </EmptyState>
      )}

      {courses.length > 0 && (
        <CourseList ref={listRef} aria-busy={loadingMore}>
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
                  <CourseThumbnail $tone={index % 5}>
                    <NumberBadge>{index + 1}</NumberBadge>
                    <FiMap aria-hidden="true" />
                  </CourseThumbnail>
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
        </CourseList>
      )}
    </PanelContainer>
  );
};

export default FixedCoursePanel;
