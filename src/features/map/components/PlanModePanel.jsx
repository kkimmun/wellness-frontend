import PlaceImage from "../../../components/PlaceImage";
import { visibleMapPlaces } from "../utils/placeVisibility";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaList,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaPlus,
  FaRoute,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { FiX, FiHelpCircle } from "react-icons/fi";
import { PlanRecommendationAPI } from "../../../api/planRecommendation";
import { MAX_TRAVEL_PLAN_PLACES } from "../utils/travelPlanStorage";
import * as S from "./PlanModePanel.styles";

const VIEW = {
  CATEGORY: "category",
  RECOMMENDATIONS: "recommendations",
  PLAN: "plan",
  SAVED: "saved",
};

const PlanModePanel = ({
  isOpen,
  initialView = VIEW.CATEGORY,
  initialPlanName = "",
  origin,
  originStatus,
  typeOptions,
  places,
  savedPlans,
  activePlanId,
  onClose,
  onOpen,
  onRequestCurrentLocation,
  onRequestOriginPick,
  onRecommendationsChange,
  onPreviewPlace,
  onAddPlace,
  onRemovePlace,
  onSavePlan,
  onOpenSavedPlan,
  onDeleteSavedPlan,
  onStartNewPlan,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [view, setView] = useState(initialView);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [requestState, setRequestState] = useState("idle");
  const [message, setMessage] = useState("");
  const [planName, setPlanName] = useState(initialPlanName);
  const [previousInitialPlanName, setPreviousInitialPlanName] = useState(initialPlanName);
  const requestControllerRef = useRef(null);
  const previousPlaceCountRef = useRef(places.length);

  // 인증 정보가 늦게 도착해 복원 이름이 바뀐 경우만 동기화한다.
  // 일반 재렌더링에서는 사용자가 입력 중인 이름을 유지한다.
  if (previousInitialPlanName !== initialPlanName) {
    setPreviousInitialPlanName(initialPlanName);
    setPlanName(initialPlanName);
  }

  const groupedTypes = useMemo(() => {
    const groups = new Map();
    typeOptions.forEach((option) => {
      if (option?.typeNo == null || groups.has(String(option.typeNo))) return;
      groups.set(String(option.typeNo), {
        typeNo: Number(option.typeNo),
        type: option.type || "이름 없는 타입",
      });
    });
    return [...groups.values()];
  }, [typeOptions]);

  const recommendationOrigin = places.at(-1) || origin;

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    // 계획 모드: 추천 카드와 상세 패널 어느 쪽에서 추가해도 계획 흐름으로 동일하게 이동한다.
    // 저장 목록으로 진입한 경우에는 늦게 복원된 초안이 저장 목록 화면을 덮지 않게 한다.
    if (
      initialView !== VIEW.SAVED &&
      places.length > previousPlaceCountRef.current
    ) {
      setRecommendations([]);
      setMessage("");
      setView(VIEW.PLAN);
    }
    previousPlaceCountRef.current = places.length;
  }, [initialView, places.length]);

  const openCategories = () => {
    requestControllerRef.current?.abort();
    setRequestState("idle");
    setMessage("");
    setView(VIEW.CATEGORY);
  };

  const loadRecommendations = async (type) => {
    if (!recommendationOrigin) {
      setMessage("시작 위치를 확인한 뒤 다시 시도해주세요.");
      return;
    }

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setSelectedType(type);
    setRequestState("loading");
    setMessage("");
    setView(VIEW.RECOMMENDATIONS);

    try {
      const result = await PlanRecommendationAPI.getNearbyPlaces({
        xAxis: recommendationOrigin.xAxis,
        yAxis: recommendationOrigin.yAxis,
        typeNo: type.typeNo,
        excludePlaceNos: places.map((place) => place.placeNo),
        signal: controller.signal,
      });
      const nextRecommendations = visibleMapPlaces(result);
      setRecommendations(nextRecommendations);
      onRecommendationsChange(nextRecommendations);
      setRequestState("success");
      if (nextRecommendations.length === 0) {
        setMessage("현재 기준 위치에서 3km 안에 추천할 장소가 없습니다.");
      }
    } catch (error) {
      if (error?.name === "CanceledError" || controller.signal.aborted) return;
      setRecommendations([]);
      onRecommendationsChange([]);
      setRequestState("error");
      setMessage(
        error?.message || "주변 장소를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    }
  };

  const addPlace = (place) => {
    if (onAddPlace(place)) {
      setRecommendations([]);
      onRecommendationsChange([]);
      setView(VIEW.PLAN);
    }
  };

  const savePlan = () => {
    const saved = onSavePlan(planName);
    if (!saved) return;
    setPlanName("");
    setMessage("계획을 브라우저에 저장했습니다.");
    setView(VIEW.SAVED);
  };

  // 계획 모드: 저장 목록에서 계획을 선택하면 지도 상태를 복원하고 계획 내용을 즉시 보여준다.
  const openSavedPlan = (plan) => {
    onOpenSavedPlan(plan);
    setPlanName(plan.name || "");
    setMessage("");
    setView(VIEW.PLAN);
  };

  // 계획 모드: 새 계획은 저장된 목록을 유지한 채 현재 초안만 비우고 추천 단계로 돌아간다.
  const startNewPlan = () => {
    requestControllerRef.current?.abort();
    setRecommendations([]);
    setSelectedType(null);
    setPlanName("");
    setRequestState("idle");
    setMessage("");
    onRecommendationsChange([]);
    onStartNewPlan();
    setView(VIEW.CATEGORY);
  };

  return (
    <>
      <S.Panel $isOpen={isOpen} aria-hidden={!isOpen}>
        <S.PanelHeader>
          <div>
            <small>계획 모드</small>
            <h2>
              {view === VIEW.CATEGORY && "주위 장소 추천 받기"}
              {view === VIEW.RECOMMENDATIONS && `${selectedType?.type || "장소"} 추천`}
              {view === VIEW.PLAN && "관광지 계획"}
              {view === VIEW.SAVED && "저장된 계획"}
            </h2>
          </div>
          <div className="header-actions">
            <button 
              type="button" 
              onClick={() => setIsTooltipOpen(!isTooltipOpen)} 
              aria-label="도움말 보기"
            >
              <FiHelpCircle size={18} />
            </button>
            <button type="button" onClick={onClose} aria-label="계획 패널 숨기기">
              <FiX size={18} />
            </button>
          </div>
        </S.PanelHeader>

        {isTooltipOpen && (
          <div style={{
            padding: "16px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #eee",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "#333",
            margin: "0"
          }}>
            <strong>📌 이렇게 사용해 보세요!</strong>
            <ol style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
              <li>지도에서 장소를 찾습니다.</li>
              <li>상세 창에서 <strong>'계획에 추가'</strong> 버튼을 눌러 장소를 담습니다.</li>
              <li><strong>[계획]</strong> 탭에서 담은 장소들의 순서를 변경하거나 삭제할 수 있습니다.</li>
              <li>완성된 코스를 저장하고 즐거운 하루를 보내세요!</li>
            </ol>
          </div>
        )}

        <S.PanelNav aria-label="계획 메뉴">
          <button
            type="button"
            className={view === VIEW.CATEGORY ? "active" : ""}
            onClick={openCategories}
          >
            <FaLocationArrow /> 추천
          </button>
          <button
            type="button"
            className={view === VIEW.PLAN ? "active" : ""}
            onClick={() => setView(VIEW.PLAN)}
          >
            <FaRoute /> 계획 {places.length}
          </button>
          <button
            type="button"
            className={view === VIEW.SAVED ? "active" : ""}
            onClick={() => setView(VIEW.SAVED)}
          >
            <FaList /> 저장 목록
          </button>
        </S.PanelNav>

        <S.PanelBody>
          {view === VIEW.CATEGORY && (
            <>
              <S.OriginCard>
                <FaMapMarkerAlt />
                <div>
                  <small>{places.length === 0 ? "시작 위치" : "다음 추천 기준"}</small>
                  <strong>
                    {recommendationOrigin?.placeName ||
                      (originStatus === "loading" ? "현재 위치 확인 중" : "위치 없음")}
                  </strong>
                </div>
              </S.OriginCard>

              <S.OriginActions>
                <button
                  type="button"
                  onClick={onRequestCurrentLocation}
                  disabled={originStatus === "loading"}
                >
                  현재 위치
                </button>
                <button type="button" onClick={onRequestOriginPick}>
                  지도에서 위치 변경
                </button>
              </S.OriginActions>

              <S.SectionTitle>
                <strong>어떤 장소를 찾을까요?</strong>
              </S.SectionTitle>

              <S.CategoryGrid>
                {groupedTypes.map((type) => (
                  <button
                    key={type.typeNo}
                    type="button"
                    onClick={() => loadRecommendations(type)}
                    disabled={!recommendationOrigin || originStatus === "loading"}
                  >
                    주위 {type.type} 추천
                  </button>
                ))}
              </S.CategoryGrid>
              {groupedTypes.length === 0 && (
                <S.EmptyState>장소 타입 정보를 불러오고 있습니다.</S.EmptyState>
              )}
            </>
          )}

          {view === VIEW.RECOMMENDATIONS && (
            <>
              <S.BackButton type="button" onClick={openCategories}>
                <FaChevronLeft /> 다른 타입 선택
              </S.BackButton>
              <S.ContextText>
                <strong>{recommendationOrigin?.placeName}</strong> 주변 · 가까운 순
              </S.ContextText>

              {requestState === "loading" && (
                <S.EmptyState>주변 장소를 찾고 있습니다.</S.EmptyState>
              )}
              {requestState !== "loading" && message && (
                <S.EmptyState>{message}</S.EmptyState>
              )}

              <S.RecommendationList>
                {recommendations.map((place) => (
                  <S.RecommendationCard
                    key={place.placeNo}
                  >
                    <button
                      type="button"
                      className="preview-button"
                      onClick={() => onPreviewPlace(place)}
                    >
                      {place.imageUrl ? (
                        <PlaceImage src={place.imageUrl} place={place} alt="" />
                      ) : (
                        <span className="image-empty">이미지 없음</span>
                      )}
                      <span className="content">
                        <small>{place.typeDetail || place.type}</small>
                        <strong>{place.placeName}</strong>
                        <span>{place.addr || "주소 정보 없음"}</span>
                        <em>{Number(place.distanceMeters || 0).toLocaleString()}m</em>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => addPlace(place)}
                      aria-label={`${place.placeName} 계획에 추가`}
                    >
                      <FaPlus /> 추가
                    </button>
                  </S.RecommendationCard>
                ))}
              </S.RecommendationList>
            </>
          )}

          {view === VIEW.PLAN && (
            <>
              <S.PlanHelp>
                선택한 순서대로 표시됩니다. 중간 장소를 삭제하면 그 이후 장소도 함께
                삭제됩니다.
              </S.PlanHelp>
              <S.PlanList>
                <li className="origin">
                  <span className="order">출</span>
                  <div>
                    <small>시작 위치</small>
                    <strong>{origin?.placeName || "위치 확인 중"}</strong>
                  </div>
                </li>
                {places.map((place, index) => (
                  <li key={place.placeNo}>
                    <span className="order">{index + 1}</span>
                    <button
                      type="button"
                      className="place-info"
                      onClick={() => onPreviewPlace(place)}
                    >
                      <small>{place.typeDetail || place.type || "장소"}</small>
                      <strong>{place.placeName}</strong>
                    </button>
                    <button
                      type="button"
                      className="remove"
                      aria-label={`${place.placeName}부터 이후 장소 삭제`}
                      onClick={() => onRemovePlace(index)}
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </S.PlanList>

              {places.length === 0 && (
                <S.EmptyState>추천 장소를 선택해 계획을 시작해주세요.</S.EmptyState>
              )}

              <S.PlanActions>
                <button
                  type="button"
                  className="secondary"
                  disabled={places.length >= MAX_TRAVEL_PLAN_PLACES}
                  onClick={openCategories}
                >
                  <FaPlus /> 주위 장소 추가
                </button>
                <span>
                  {places.length}/{MAX_TRAVEL_PLAN_PLACES}
                </span>
              </S.PlanActions>

              <S.SaveForm
                onSubmit={(event) => {
                  event.preventDefault();
                  savePlan();
                }}
              >
                <label htmlFor="travel-plan-name">계획 이름</label>
                <div>
                  <input
                    id="travel-plan-name"
                    value={planName}
                    onChange={(event) => setPlanName(event.target.value)}
                    maxLength={30}
                    placeholder="예: 김포 가족 나들이"
                  />
                  <button
                    type="submit"
                    disabled={!planName.trim() || places.length === 0}
                  >
                    <FaSave /> 저장
                  </button>
                </div>
              </S.SaveForm>
              {message && <S.InlineMessage>{message}</S.InlineMessage>}
            </>
          )}

          {view === VIEW.SAVED && (
            <>
              <S.SavedHeader>
                <span>브라우저를 닫아도 저장된 계획은 유지됩니다.</span>
                <button type="button" onClick={startNewPlan}>
                  새 계획
                </button>
              </S.SavedHeader>
              <S.SavedList>
                {savedPlans.map((plan) => (
                  <li key={plan.id} className={activePlanId === plan.id ? "active" : ""}>
                    <button
                      type="button"
                      className="saved-info"
                      onClick={() => openSavedPlan(plan)}
                    >
                      <strong>{plan.name}</strong>
                      <span>{plan.places.length}개 장소</span>
                      <small>
                        {new Date(plan.createdAt).toLocaleDateString("ko-KR")}
                      </small>
                    </button>
                    <button
                      type="button"
                      className="delete"
                      aria-label={`${plan.name} 계획 삭제`}
                      onClick={() => onDeleteSavedPlan(plan.id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </S.SavedList>
              {savedPlans.length === 0 && (
                <S.EmptyState>저장된 계획이 없습니다.</S.EmptyState>
              )}
            </>
          )}
        </S.PanelBody>
      </S.Panel>

      {!isOpen && (
        <S.ReopenButton type="button" onClick={onOpen}>
          계획 열기 <FaChevronLeft />
        </S.ReopenButton>
      )}
    </>
  );
};

export default PlanModePanel;

