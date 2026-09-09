import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaRedo,
  FaRoute,
  FaSave,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { CourseRecommendationAPI } from "../../../api/courseRecommendation";
import {
  buildRecommendationConditionKey,
  readSeenCourseSignatures,
  rememberCourseSignature,
} from "../utils/recommendationSessionStorage";
import * as S from "./RecommendationModePanel.styles";

const RecommendationModePanel = ({
  isOpen,
  origin,
  originStatus,
  placeOptions,
  tagOptions,
  course,
  onClose,
  onOpen,
  onRequestCurrentLocation,
  onRequestOriginPick,
  onCourseChange,
  onPreviewPlace,
  onSaveCourse,
  onSwitchToPlanMode,
}) => {
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

  const normalizedPreferredPlaceNos = useMemo(
    () => preferredPlaceNos.filter(Boolean).map(Number),
    [preferredPlaceNos],
  );

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
    onRequestCurrentLocation();
  };

  const requestOriginPick = () => {
    resetResult();
    onRequestOriginPick();
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
    setMessage("추천 코스를 계획 세션에 저장했습니다.");
  };

  return (
    <>
      <S.Panel $isOpen={isOpen} aria-hidden={!isOpen}>
        <S.Header>
          <div>
            <small>추천 모드</small>
            <h2>맞춤 코스 추천</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="추천 패널 숨기기">
            <FiX />
          </button>
        </S.Header>

        <S.Body>
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
              <span>선택 사항 · 최대 2곳</span>
            </S.SectionTitle>
            {[0, 1].map((index) => (
              <select
                key={index}
                value={preferredPlaceNos[index]}
                onChange={(event) => changePreferredPlace(index, event.target.value)}
              >
                <option value="">{index + 1}번째 장소 선택 안 함</option>
                {selectablePlaces.map((place) => (
                  <option key={place.placeNo} value={place.placeNo}>
                    {place.placeName}
                  </option>
                ))}
              </select>
            ))}
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
                <strong>추천 코스</strong>
                <span>
                  약 {Number(course.totalDistanceMeters || 0).toLocaleString()}m · {course.placeCount}곳
                </span>
              </S.CourseSummary>
              <ol>
                {course.places.map((place, index) => (
                  <li key={place.placeNo}>
                    <span className="order">{index + 1}</span>
                    <button type="button" onClick={() => onPreviewPlace(place)}>
                      <small>{place.typeDetail || place.type || "장소"}</small>
                      <strong>{place.placeName}</strong>
                      <em>
                        이전 위치에서 {Number(place.distanceFromPreviousMeters || 0).toLocaleString()}m
                      </em>
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
              <S.PlanSwitchButton type="button" onClick={onSwitchToPlanMode}>
                이 코스로 계획 모드 전환
              </S.PlanSwitchButton>
            </S.CourseSection>
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
