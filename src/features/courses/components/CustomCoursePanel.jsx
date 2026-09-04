import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCompass, FiX } from "react-icons/fi";
import { FaLocationArrow, FaSearch } from "react-icons/fa";
import { CourseAPI } from "../../../api/course";
import { PlaceAPI } from "../../../api/place";
import { createUserCourse } from "../utils/userCourseStorage";
import { RouteAPI } from "../../../api/route";
import {
  PillButton,
  PrimaryButton,
} from "../../../components/Button/Button.styles";
import {
  ActionArea,
  CheckList,
  ChoiceRow,
  CourseResult,
  FieldMessage,
  Header,
  IconButton,
  InlineSpinner,
  OriginLocationButton,
  OriginSearchBar,
  OriginSearchButton,
  OriginSearchInput,
  PanelBody,
  PanelContainer,
  PanelTitle,
  RecommendationButtonRow,
  Section,
  SectionHeading,
  TagGrid,
  TagOption,
} from "./CustomCoursePanel.styles";
import {
  InlineState,
  SearchResultButton,
  SearchResults,
} from "../../map/components/RoutePanel.styles";

const DESTINATION_TYPE_DETAIL_NO = 19;

const TAGS = [
  "사진명소",
  "역사",
  "전통",
  "힐링",
  "유아동반",
  "가족",
  "산책",
  "자연",
  "체험",
  "문화예술",
  "종교",
  "데이트",
  "해양",
  "반려동물",
  "레저",
  "쇼핑",
];

const getErrorMessage = (error, fallback) =>
  error?.message || error?.data?.message || fallback;

const toWaypoint = (candidate) => {
  const place = candidate?.place || candidate;
  return {
    placeNo: place?.placeNo,
    placeName: candidate?.placeName || place?.placeName || "이름 없는 장소",
    imageUrl: candidate?.imageUrl || place?.imageUrl,
    tags: candidate?.tags || place?.tags || [],
    distance: candidate?.distance,
  };
};

const CustomCoursePanel = ({ onClose, onCourseBuilt, onCreated }) => {
  const [origin, setOrigin] = useState(null);
  const [originText, setOriginText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchState, setSearchState] = useState("idle");
  const [searchMessage, setSearchMessage] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [destinationState, setDestinationState] = useState("loading");
  const [destinationMessage, setDestinationMessage] = useState("");
  const [destinationNo, setDestinationNo] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedWaypoints, setSelectedWaypoints] = useState([]);
  const [recommendationState, setRecommendationState] = useState("idle");
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const [creationState, setCreationState] = useState("idle");
  const [creationMessage, setCreationMessage] = useState("");
  const [courseResult, setCourseResult] = useState(null);
  const searchControllerRef = useRef(null);
  const recommendationControllerRef = useRef(null);
  const creationControllerRef = useRef(null);

  useEffect(
    () => () => {
      searchControllerRef.current?.abort();
      recommendationControllerRef.current?.abort();
      creationControllerRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    PlaceAPI.getByTypeDetail(DESTINATION_TYPE_DETAIL_NO, controller.signal)
      .then((places) => {
        if (controller.signal.aborted) return;

        const validPlaces = Array.isArray(places)
          ? places.filter((place) => place?.placeNo != null)
          : [];
        const uniquePlaces = [
          ...new Map(
            validPlaces.map((place) => [String(place.placeNo), place]),
          ).values(),
        ];
        setDestinations(uniquePlaces);
        setDestinationState(uniquePlaces.length > 0 ? "success" : "empty");
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;

        setDestinationState("error");
        setDestinationMessage(
          getErrorMessage(error, "도착지 정보를 불러오지 못했습니다."),
        );
      });

    return () => controller.abort();
  }, []);

  const clearGeneratedData = () => {
    recommendationControllerRef.current?.abort();
    creationControllerRef.current?.abort();
    setRecommendations(null);
    setSelectedWaypoints([]);
    setRecommendationState("idle");
    setRecommendationMessage("");
    setCreationState("idle");
    setCreationMessage("");
    setCourseResult(null);
    onCourseBuilt(null);
  };

  const updateOriginText = (value) => {
    searchControllerRef.current?.abort();
    setOriginText(value);
    setOrigin(null);
    setSearchResults([]);
    setSearchState("idle");
    setSearchMessage("");
    clearGeneratedData();
  };

  const performOriginSearch = async () => {
    searchControllerRef.current?.abort();
    const query = originText.trim();
    if (query.length < 2) {
      setSearchState("error");
      setSearchMessage("출발지 이름을 2글자 이상 입력해주세요.");
      setSearchResults([]);
      return;
    }

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;
    setSearchState("loading");
    setSearchMessage("출발지를 검색하고 있습니다.");

    try {
      const results = await RouteAPI.searchPlaces(query, controller.signal);
      if (controller.signal.aborted) return;
      const safeResults = Array.isArray(results) ? results : [];
      setSearchResults(safeResults);
      setSearchState(safeResults.length > 0 ? "success" : "empty");
      setSearchMessage(safeResults.length > 0 ? "" : "검색 결과가 없습니다.");
    } catch (error) {
      if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;
      setSearchResults([]);
      setSearchState("error");
      setSearchMessage(
        getErrorMessage(error, "출발지 검색 중 오류가 발생했습니다."),
      );
    }
  };

  const selectOrigin = (place) => {
    searchControllerRef.current?.abort();
    setOrigin(place);
    setOriginText(place.placeName);
    setSearchResults([]);
    setSearchState("idle");
    setSearchMessage("");
    clearGeneratedData();
  };

  const useCurrentLocation = () => {
    searchControllerRef.current?.abort();
    setSearchResults([]);
    if (!navigator.geolocation) {
      setSearchState("error");
      setSearchMessage("현재 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    const controller = new AbortController();
    searchControllerRef.current = controller;
    setOrigin(null);
    clearGeneratedData();
    setSearchState("loading");
    setSearchMessage("현재 위치를 확인하고 있습니다.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (controller.signal.aborted) return;
        setOrigin({
          placeName: "현재 위치",
          X_AXIS: coords.longitude,
          Y_AXIS: coords.latitude,
        });
        setOriginText("현재 위치");
        setSearchResults([]);
        setSearchState("idle");
        setSearchMessage("");
        clearGeneratedData();
      },
      () => {
        if (controller.signal.aborted) return;
        setSearchState("error");
        setSearchMessage(
          "현재 위치를 가져오지 못했습니다. 브라우저 위치 권한을 확인해주세요.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  const changeDestination = (placeNo) => {
    setDestinationNo(String(placeNo));
    clearGeneratedData();
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((current) => current.filter((item) => item !== tag));
      setRecommendationMessage("");
      clearGeneratedData();
      return;
    }
    if (selectedTags.length >= 5) {
      setRecommendationMessage("태그는 최대 5개까지 선택할 수 있습니다.");
      return;
    }
    setSelectedTags((current) => [...current, tag]);
    setRecommendationMessage("");
    clearGeneratedData();
  };

  const validateConditions = () => {
    if (!origin) return "검색 결과에서 출발지를 선택해주세요.";
    if (!destinationNo) return "도착지를 선택해주세요.";
    if (selectedTags.length === 0) return "태그를 1개 이상 선택해주세요.";
    return "";
  };

  const originCoordinates = () => ({
    startX: Number(origin?.X_AXIS ?? origin?.xAxis),
    startY: Number(origin?.Y_AXIS ?? origin?.yAxis),
  });

  const requestRecommendations = async () => {
    const validationMessage = validateConditions();
    if (validationMessage) {
      setRecommendationState("error");
      setRecommendationMessage(validationMessage);
      return;
    }

    const coordinates = originCoordinates();
    if (
      !Number.isFinite(coordinates.startX) ||
      !Number.isFinite(coordinates.startY)
    ) {
      setRecommendationState("error");
      setRecommendationMessage("선택한 출발지의 좌표 정보가 없습니다.");
      return;
    }

    recommendationControllerRef.current?.abort();
    const controller = new AbortController();
    recommendationControllerRef.current = controller;
    setRecommendationState("loading");
    setRecommendationMessage("");
    setRecommendations(null);
    setSelectedWaypoints([]);
    setCreationState("idle");
    setCourseResult(null);
    onCourseBuilt(null);

    try {
      const response = await CourseAPI.getWaypointRecommendations(
        {
          ...coordinates,
          endPlaceNo: Number(destinationNo),
          tags: selectedTags,
          // 백엔드 필수 필드 호환용 기본값(분). 추천 계산에는 사용되지 않습니다.
          estimatedTime: 120,
        },
        controller.signal,
      );
      const candidates = Array.isArray(response?.data) ? response.data : [];
      const normalizedCandidates = candidates
        .map(toWaypoint)
        .filter((place) => place.placeNo);
      setRecommendations(normalizedCandidates);
      setRecommendationState(
        normalizedCandidates.length > 0 ? "success" : "empty",
      );
      setRecommendationMessage(
        normalizedCandidates.length > 0
          ? ""
          : "조건에 맞는 중간 코스가 없습니다. 경유지 없이 제작할 수 있습니다.",
      );
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setRecommendationState("error");
      setRecommendationMessage(
        getErrorMessage(error, "중간 코스를 추천받지 못했습니다."),
      );
    }
  };

  const toggleWaypoint = (placeNo) => {
    if (selectedWaypoints.includes(placeNo)) {
      setSelectedWaypoints((current) =>
        current.filter((item) => item !== placeNo),
      );
      setCreationMessage("");
      return;
    }
    if (selectedWaypoints.length >= 3) {
      setCreationMessage("중간 코스는 최대 3곳까지 선택할 수 있습니다.");
      return;
    }
    setSelectedWaypoints((current) => [...current, placeNo]);
    setCreationMessage("");
  };

  const createCourse = async () => {
    if (creationState === "loading") return;
    const validationMessage = validateConditions();
    if (validationMessage) {
      setCreationState("error");
      setCreationMessage(validationMessage);
      return;
    }

    const coordinates = originCoordinates();
    const controller = new AbortController();
    creationControllerRef.current?.abort();
    creationControllerRef.current = controller;
    setCreationState("loading");
    setCreationMessage("");
    setCourseResult(null);

    try {
      const routeResponse = await CourseAPI.getRecommendedRoute(
        {
          ...coordinates,
          endPlaceNo: Number(destinationNo),
          transportType: "WALK",
          routeOption: "SHORTEST",
          waypointPlaceNos: selectedWaypoints,
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      const routeData = routeResponse?.data;
      onCourseBuilt(routeData);

      const courseResponse = await CourseAPI.getCustomCourse(
        {
          ...coordinates,
          endPlaceNo: Number(destinationNo),
          waypoints: Array.isArray(routeData?.waypoints)
            ? routeData.waypoints.map((place) => place.placeNo)
            : selectedWaypoints,
          tags: selectedTags,
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      const course = createUserCourse({
        info: courseResponse?.data,
        routeData,
        origin,
        tags: selectedTags,
      });
      setCourseResult(courseResponse?.data || null);
      setCreationState("success");
      setCreationMessage(
        "순례길 코스를 만들었습니다. 지도에서 경로를 확인해보세요.",
      );
      onCreated?.(course);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setCreationState("error");
      setCreationMessage(
        getErrorMessage(error, "순례길 코스를 만드는 중 오류가 발생했습니다."),
      );
    }
  };

  return (
    <PanelContainer aria-label="순례길 코스 제작">
      <Header>
        <PanelTitle>
          <FiCompass aria-hidden="true" />
          <span>순례길 코스</span>
        </PanelTitle>
        <IconButton type="button" onClick={onClose} aria-label="코스 제작 닫기">
          <FiX aria-hidden="true" />
        </IconButton>
      </Header>

      <PanelBody>
        <Section aria-label="출발지 선택">
          <SectionHeading>
            <strong>출발지 선택</strong>
            <span>필수 · 1곳</span>
          </SectionHeading>
          <form
            role="search"
            aria-label="출발지 검색"
            onSubmit={(event) => {
              event.preventDefault();
              performOriginSearch();
            }}
          >
            <OriginSearchBar>
              <OriginSearchInput
                id="course-origin"
                aria-label="출발지"
                value={originText}
                placeholder="검색어를 입력해주세요"
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby="course-origin-help"
                onChange={(event) => updateOriginText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.nativeEvent.isComposing) {
                    event.preventDefault();
                  }
                }}
              />
              <OriginSearchButton type="submit" aria-label="출발지 검색" title="검색">
                <FaSearch size={18} aria-hidden="true" />
              </OriginSearchButton>
            </OriginSearchBar>
          </form>
          <OriginLocationButton
            type="button"
            onClick={useCurrentLocation}
            aria-label="현재 위치를 출발지로 사용"
          >
            <FaLocationArrow aria-hidden="true" />
            현재 위치를 출발지로
          </OriginLocationButton>
          <FieldMessage id="course-origin-help">
            검색 결과에서 출발지를 선택해주세요.
          </FieldMessage>
          {searchState !== "idle" && (
            <SearchResults
              aria-label="출발지 검색 결과"
              aria-busy={searchState === "loading"}
            >
              {searchState === "loading" && (
                <InlineState role="status">{searchMessage}</InlineState>
              )}
              {searchState === "error" && (
                <InlineState $error role="alert">
                  {searchMessage}
                </InlineState>
              )}
              {searchState === "empty" && (
                <InlineState role="status">검색 결과가 없습니다.</InlineState>
              )}
              {searchState === "success" &&
                searchResults.map((place) => (
                  <SearchResultButton
                    type="button"
                    key={
                      place.placeNo ??
                      [
                        place.X_AXIS ?? place.xAxis,
                        place.Y_AXIS ?? place.yAxis,
                      ].join("-")
                    }
                    onClick={() => selectOrigin(place)}
                  >
                    <strong>{place.placeName}</strong>
                    <span>
                      {place.address || place.addr || "주소 정보 없음"}
                    </span>
                    <span>출발지로 선택</span>
                  </SearchResultButton>
                ))}
            </SearchResults>
          )}
          {origin && (
            <FieldMessage $success role="status">
              <FiCheck aria-hidden="true" /> 출발지 선택 완료:{" "}
              {origin.placeName}
              {(origin.address || origin.addr) && (
                <>
                  <br />
                  {origin.address || origin.addr}
                </>
              )}
            </FieldMessage>
          )}
        </Section>

        <Section>
          <SectionHeading>
            <strong>도착지 선택</strong>
            <span>필수 · 1곳</span>
          </SectionHeading>
          {destinationState === "loading" && (
            <FieldMessage role="status">
              도착지 정보를 불러오는 중입니다.
            </FieldMessage>
          )}
          {destinationState === "error" && (
            <FieldMessage $error role="alert">
              {destinationMessage}
            </FieldMessage>
          )}
          {destinationState === "empty" && (
            <FieldMessage role="status">
              선택할 수 있는 도착지가 없습니다.
            </FieldMessage>
          )}
          {destinationState === "success" && (
            <CheckList>
              {destinations.map((place) => (
                <ChoiceRow key={place.placeNo}>
                  <input
                    type="radio"
                    name="pilgrim-destination"
                    value={place.placeNo}
                    checked={String(place.placeNo) === destinationNo}
                    onChange={() => changeDestination(place.placeNo)}
                  />
                  <span className="check" aria-hidden="true">
                    <FiCheck />
                  </span>
                  <span>{place.placeName}</span>
                </ChoiceRow>
              ))}
            </CheckList>
          )}
        </Section>

        <Section>
          <SectionHeading>
            <strong>태그 선택하기</strong>
            <span>필수 · 최대 5개 ({selectedTags.length}/5)</span>
          </SectionHeading>
          <TagGrid>
            {TAGS.map((tag) => (
              <TagOption key={tag} $selected={selectedTags.includes(tag)}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="check" aria-hidden="true">
                  <FiCheck />
                </span>
                <span>{tag}</span>
              </TagOption>
            ))}
          </TagGrid>
        </Section>

        <RecommendationButtonRow>
          <PillButton
            type="button"
            onClick={requestRecommendations}
            disabled={
              recommendationState === "loading" || creationState === "loading"
            }
          >
            {recommendationState === "loading" ? (
              <>
                <InlineSpinner /> 추천 중
              </>
            ) : (
              "✦ 추천받기"
            )}
          </PillButton>
          <span>선택한 태그와 이동 경로를 기준으로 추천합니다.</span>
        </RecommendationButtonRow>
        {recommendationMessage && (
          <FieldMessage $error={recommendationState === "error"}>
            {recommendationMessage}
          </FieldMessage>
        )}

        {recommendations !== null && (
          <Section>
            <SectionHeading>
              <strong>중간코스 추가하기</strong>
              <span>선택 · 최대 3곳 ({selectedWaypoints.length}/3)</span>
            </SectionHeading>
            {recommendations.length > 0 && (
              <CheckList>
                {recommendations.map((place) => (
                  <ChoiceRow key={place.placeNo}>
                    <input
                      type="checkbox"
                      disabled={creationState === "loading"}
                      checked={selectedWaypoints.includes(place.placeNo)}
                      onChange={() => toggleWaypoint(place.placeNo)}
                    />
                    <span className="check" aria-hidden="true">
                      <FiCheck />
                    </span>
                    <span>{place.placeName}</span>
                    {Number.isFinite(place.distance) && (
                      <small>{Math.round(place.distance)}m</small>
                    )}
                  </ChoiceRow>
                ))}
              </CheckList>
            )}
          </Section>
        )}

        {creationMessage && (
          <FieldMessage
            $error={creationState === "error"}
            $success={creationState === "success"}
            role={creationState === "error" ? "alert" : "status"}
          >
            {creationMessage}
          </FieldMessage>
        )}

        {courseResult && (
          <CourseResult>
            <strong>{courseResult.courseName || "나만의 순례길 코스"}</strong>
            <p>{courseResult.description}</p>
          </CourseResult>
        )}
      </PanelBody>

      {recommendations !== null && (
        <ActionArea>
          <PrimaryButton
            type="button"
            $size="lg"
            $fullWidth
            disabled={creationState === "loading"}
            onClick={createCourse}
          >
            {creationState === "loading" ? (
              <>
                <InlineSpinner /> 로딩중 ...
              </>
            ) : (
              "순례길 코스 제작"
            )}
          </PrimaryButton>
        </ActionArea>
      )}
    </PanelContainer>
  );
};

export default CustomCoursePanel;
