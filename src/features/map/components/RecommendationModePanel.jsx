import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaList,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaRedo,
  FaRoute,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { CourseRecommendationAPI } from "../../../api/courseRecommendation";
import {
  buildRecommendationConditionKey,
  readSeenCourseSignatures,
  rememberCourseSignature,
} from "../utils/recommendationSessionStorage";
import * as S from "./RecommendationModePanel.styles";

const VIEW = {
  RECOMMEND: "recommend",
  SAVED: "saved",
};

const RecommendationModePanel = ({
  isOpen,
  initialView = VIEW.RECOMMEND,
  origin,
  originStatus,
  placeOptions,
  placeOptionsStatus,
  tagOptions,
  course,
  savedCourses = [],
  activePlanId,
  onClose,
  onOpen,
  onRequestCurrentLocation,
  onRequestOriginPick,
  onCourseChange,
  onPreviewPlace,
  onSaveCourse,
  onOpenSavedCourse,
  onDeleteSavedCourse,
}) => {
  const [view, setView] = useState(initialView);
  const [placeCount, setPlaceCount] = useState(5);
  const [preferredPlaceNos, setPreferredPlaceNos] = useState(["", ""]);
  const [selectedTagNos, setSelectedTagNos] = useState([]);
  const [requestState, setRequestState] = useState("idle");
  const [saveState, setSaveState] = useState("idle");
  const [message, setMessage] = useState("");
  const requestControllerRef = useRef(null);

  const selectablePlaces = useMemo(
    () =>
      [...placeOptions]
        .filter(
          (place) =>
            place?.placeNo &&
            place?.placeName &&
            !["의료기관", "복지시설"].includes(place.type),
        )
        .sort((a, b) => a.placeName.localeCompare(b.placeName, "ko")),
    [placeOptions],
  );

  const normalizedPreferredPlaceNos = useMemo(() => {
    const selectablePlaceNos = new Set(
      selectablePlaces.map((place) => String(place.placeNo)),
    );
    return preferredPlaceNos
      .filter((placeNo) => placeNo && selectablePlaceNos.has(String(placeNo)))
      .map(Number);
  }, [preferredPlaceNos, selectablePlaces]);

  useEffect(
    () => () => {
      const controller = requestControllerRef.current;
      requestControllerRef.current = null;
      controller?.abort();
    },
    [],
  );

  const resetResult = () => {
    const controller = requestControllerRef.current;
    requestControllerRef.current = null;
    controller?.abort();
    setRequestState("idle");
    setSaveState("idle");
    setMessage("");
    onCourseChange(null);
  };

  const requestCurrentLocation = () => {
    resetResult();
    setPreferredPlaceNos(["", ""]);
    onRequestCurrentLocation();
  };

  const requestOriginPick = () => {
    resetResult();
    setPreferredPlaceNos(["", ""]);
    onRequestOriginPick();
  };

  const openSavedCourse = (savedCourse) => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setRequestState("idle");
    setSaveState("idle");
    setMessage("브라우저에 저장된 코스를 불러왔습니다.");
    setView(VIEW.RECOMMEND);
    onOpenSavedCourse(savedCourse);
  };

  const deleteSavedCourse = (savedCourse) => {
    onDeleteSavedCourse(savedCourse.id);
    setMessage(`"${savedCourse.name}" 계획을 삭제했습니다.`);
  };

  const changePreferredPlace = (index, value) => {
    if (value && preferredPlaceNos.some((item, itemIndex) => itemIndex !== index && item === value)) {
      setMessage("같은 장소를 두 번 선택할 수 없습니다.");
      return;
    }
    setPreferredPlaceNos((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
    resetResult();
  };

  const toggleTag = (tagNo) => {
    const numericTagNo = Number(tagNo);
    if (!selectedTagNos.includes(numericTagNo) && selectedTagNos.length >= 2) {
      setMessage("태그는 최대 2개까지 선택할 수 있습니다.");
      return;
    }
    setSelectedTagNos((current) =>
      current.includes(numericTagNo)
        ? current.filter((value) => value !== numericTagNo)
        : [...current, numericTagNo],
    );
    resetResult();
  };

  const requestCourse = async () => {
    if (!origin || originStatus === "loading") {
      setMessage("시작 위치를 확인한 뒤 다시 시도해주세요.");
      return;
    }

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const condition = {
      startX: origin.xAxis,
      startY: origin.yAxis,
      placeCount,
      preferredPlaceNos: normalizedPreferredPlaceNos,
      tagNos: selectedTagNos,
    };
    const conditionKey = buildRecommendationConditionKey(condition);
    setRequestState("loading");
    setSaveState("idle");
    setMessage("");

    try {
      const result = await CourseRecommendationAPI.recommendCourse(
        {
          ...condition,
          excludeCourseSignatures: readSeenCourseSignatures(conditionKey),
        },
        controller.signal,
      );
      // 위치 변경이나 새 요청으로 무효화된 이전 응답은 현재 추천 결과에 반영하지 않는다.
      if (
        controller.signal.aborted ||
        requestControllerRef.current !== controller
      ) {
        return;
      }
      if (!result?.courseSignature || !Array.isArray(result.places)) {
        throw new Error("추천 코스 응답 형식을 확인해주세요.");
      }
      rememberCourseSignature(conditionKey, result.courseSignature);
      onCourseChange(result);
      setRequestState("success");
      setMessage(`${result.places.length}개 장소로 코스를 만들었습니다.`);
    } catch (error) {
      if (
        error?.name === "CanceledError" ||
        controller.signal.aborted ||
        requestControllerRef.current !== controller
      ) {
        return;
      }
      setRequestState("error");
      setMessage(
        error?.message ||
          "조건을 만족하는 다른 코스를 찾지 못했습니다. 조건을 바꿔주세요.",
      );
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    }
  };

  const saveCourse = async () => {
    if (!course?.places?.length || saveState === "loading") return;

    setSaveState("loading");
    const saved = await onSaveCourse(course.places);
    if (!saved) {
      setSaveState("error");
      setMessage("추천 코스를 저장하지 못했습니다.");
      return;
    }

    setSaveState("success");
    setMessage("추천 코스와 시작 위치를 브라우저에 저장했습니다.");
  };

  return (
    <>
      <S.Panel $isOpen={isOpen} aria-hidden={!isOpen}>
        <S.Header>
          <div>
            <small>추천 모드</small>
            <h2>{view === VIEW.SAVED ? "저장된 계획" : "맞춤 코스 추천"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="추천 패널 숨기기">
            <FiX />
          </button>
        </S.Header>

        <S.PanelNav aria-label="추천 모드 메뉴">
          <button
            type="button"
            className={view === VIEW.RECOMMEND ? "active" : ""}
            onClick={() => setView(VIEW.RECOMMEND)}
          >
            <FaRoute /> 코스 추천
          </button>
          <button
            type="button"
            className={view === VIEW.SAVED ? "active" : ""}
            onClick={() => setView(VIEW.SAVED)}
          >
            <FaList /> 저장 목록 {savedCourses.length}
          </button>
        </S.PanelNav>

        <S.Body>
          {view === VIEW.RECOMMEND && (
            <>
          <S.OriginCard>
            <FaMapMarkerAlt />
            <div>
              <small>코스 시작 위치</small>
              <strong>
                {origin?.placeName ||
                  (originStatus === "loading" ? "현재 위치 확인 중" : "위치 없음")}
              </strong>
            </div>
          </S.OriginCard>
          <S.OriginActions>
            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={originStatus === "loading"}
            >
              <FaLocationArrow /> 현재 위치
            </button>
            <button type="button" onClick={requestOriginPick}>
              지도에서 위치 변경
            </button>
          </S.OriginActions>

          <S.Section>
            <S.SectionTitle>
              <strong>가고 싶은 장소</strong>
              <span>타입별 추천 거리 내 · 최대 2곳</span>
            </S.SectionTitle>
            {[0, 1].map((index) => (
              <select
                key={index}
                value={preferredPlaceNos[index]}
                disabled={placeOptionsStatus === "loading" || selectablePlaces.length === 0}
                onChange={(event) => changePreferredPlace(index, event.target.value)}
              >
                <option value="">{index + 1}번째 장소 선택 안 함</option>
                {selectablePlaces.map((place) => (
                  <option key={place.placeNo} value={place.placeNo}>
                    {place.placeName}
                    {Number.isFinite(place.distanceMeters)
                      ? ` · ${(place.distanceMeters / 1000).toFixed(1)}km`
                      : ""}
                  </option>
                ))}
              </select>
            ))}
            {placeOptionsStatus === "loading" && (
              <S.OptionStatus>시작 위치에서 갈 수 있는 장소를 불러오는 중입니다.</S.OptionStatus>
            )}
            {placeOptionsStatus === "error" && (
              <S.OptionStatus $error>
                주변 장소를 불러오지 못했습니다. 시작 위치를 다시 선택해주세요.
              </S.OptionStatus>
            )}
            {placeOptionsStatus === "success" && selectablePlaces.length === 0 && (
              <S.OptionStatus>거리 조건에 해당하는 장소가 없습니다.</S.OptionStatus>
            )}
          </S.Section>

          <S.Section>
            <S.SectionTitle>
              <strong>선호 태그</strong>
              <span>선택 사항 · 최대 2개</span>
            </S.SectionTitle>
            <S.TagGrid>
              {tagOptions.map((tag) => {
                const selected = selectedTagNos.includes(Number(tag.tagNo));
                return (
                  <S.TagButton
                    type="button"
                    key={tag.tagNo}
                    $selected={selected}
                    aria-pressed={selected}
                    onClick={() => toggleTag(tag.tagNo)}
                  >
                    # {tag.tagContent}
                  </S.TagButton>
                );
              })}
            </S.TagGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>
              <strong>방문 장소 수</strong>
              <span>선택하지 않으면 기본 5곳</span>
            </S.SectionTitle>
            <select
              value={placeCount}
              onChange={(event) => {
                setPlaceCount(Number(event.target.value));
                resetResult();
              }}
            >
              {Array.from({ length: 8 }, (_, index) => index + 3).map((count) => (
                <option key={count} value={count}>
                  {count}곳{count === 5 ? " (기본)" : ""}
                </option>
              ))}
            </select>
          </S.Section>

          <S.SubmitButton
            type="button"
            disabled={
              !origin ||
              originStatus === "loading" ||
              requestState === "loading"
            }
            onClick={requestCourse}
          >
            {requestState === "loading" ? (
              "코스를 만들고 있습니다."
            ) : course ? (
              <><FaRedo /> 다시 추천받기</>
            ) : (
              <><FaRoute /> 코스 추천받기</>
            )}
          </S.SubmitButton>
          {message && <S.Message $error={requestState === "error"}>{message}</S.Message>}

          {course?.places?.length > 0 && (
            <S.CourseSection>
              <S.CourseSummary>
                <strong>{course.isSaved ? "저장된 코스" : "추천 코스"}</strong>
                <span>
                  {course.totalDistanceMeters == null
                    ? `${course.placeCount}곳`
                    : `약 ${Number(course.totalDistanceMeters).toLocaleString()}m · ${course.placeCount}곳`}
                </span>
              </S.CourseSummary>
              <ol>
                {course.places.map((place, index) => (
                  <li key={place.placeNo}>
                    <span className="order">{index + 1}</span>
                    <button type="button" onClick={() => onPreviewPlace(place)}>
                      <small>{place.typeDetail || place.type || "장소"}</small>
                      <strong>{place.placeName}</strong>
                      {place.distanceFromPreviousMeters != null && (
                        <em>
                          이전 위치에서 {Number(place.distanceFromPreviousMeters).toLocaleString()}m
                        </em>
                      )}
                    </button>
                  </li>
                ))}
              </ol>
              <S.SavePlanButton
                type="button"
                disabled={saveState === "loading"}
                onClick={() => void saveCourse()}
              >
                <FaSave /> {saveState === "loading" ? "저장 중" : "추천 코스 저장"}
              </S.SavePlanButton>
            </S.CourseSection>
          )}
            </>
          )}

          {view === VIEW.SAVED && (
            <>
              <S.SavedViewHeader>
                <span>브라우저를 닫아도 저장된 계획은 유지됩니다.</span>
                <button type="button" onClick={() => setView(VIEW.RECOMMEND)}>
                  새 추천
                </button>
              </S.SavedViewHeader>
              <S.SavedCourseSection>
                {savedCourses.length === 0 ? (
                  <S.SavedCourseEmpty>저장된 계획이 없습니다.</S.SavedCourseEmpty>
                ) : (
                  savedCourses.map((savedCourse) => (
                    <S.SavedCourseCard
                      key={savedCourse.id}
                      $active={activePlanId === savedCourse.id}
                    >
                      <button
                        className="saved-info"
                        type="button"
                        onClick={() => openSavedCourse(savedCourse)}
                      >
                        <strong>{savedCourse.name}</strong>
                        <span>{savedCourse.places.length}개 장소</span>
                        <small>
                          {new Date(
                            savedCourse.updatedAt ?? savedCourse.createdAt,
                          ).toLocaleDateString("ko-KR")}
                        </small>
                      </button>
                      <button
                        className="delete"
                        type="button"
                        aria-label={`${savedCourse.name} 계획 삭제`}
                        onClick={() => deleteSavedCourse(savedCourse)}
                      >
                        <FaTrash />
                      </button>
                    </S.SavedCourseCard>
                  ))
                )}
              </S.SavedCourseSection>
            </>
          )}
        </S.Body>
      </S.Panel>

      {!isOpen && (
        <S.ReopenButton type="button" onClick={onOpen}>
          추천 열기 <FaChevronLeft />
        </S.ReopenButton>
      )}
    </>
  );
};

export default RecommendationModePanel;
