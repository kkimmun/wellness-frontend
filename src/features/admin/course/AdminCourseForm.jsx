import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { PrimaryButton, SecondaryButton, TableActionButton } from "../../../components/Button/Button.styles";
import { BaseInput, BaseTextarea, SearchInputWrapper } from "../../../components/Input/Input.styles";
import { Modal } from "../../../components/Modal/Modal";
import { PlaceAPI } from "../../../api/place";
import { PageTitle, FormError } from "../place/AdminPlaceForm.styles";
import { AdminCourseAPI } from "./api/adminCourseApi";
import { Page, Feedback } from "./AdminCourse.styles";
import PlaceSearchModal from "./PlaceSearchModal";
import * as S from "./AdminCourseForm.styles";

const EMPTY_FORM = { courseName: "", description: "", stops: [null, null, null, null, null] };
const STOP_LABELS = ["출발지", "중간 관광지 1", "중간 관광지 2", "중간 관광지 3", "도착지"];

function PlaceField({ index, place, onSearch, onClear }) {
  const label = STOP_LABELS[index];
  const required = index === 0 || index === 4;
  return <S.FormRow>
    <label htmlFor={`course-stop-${index}`}>{label}{required && <S.Required aria-hidden="true">*</S.Required>}</label>
    <S.PlaceControls>
      <SearchInputWrapper>
        <S.PlaceInput id={`course-stop-${index}`} readOnly aria-required={required} aria-haspopup="dialog" placeholder="장소 선택" value={place?.placeName || ""} onClick={onSearch} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSearch(); } }} />
        <FiSearch aria-hidden="true" />
      </SearchInputWrapper>
      <SecondaryButton type="button" aria-label={`${label} 장소 검색`} onClick={onSearch}>검색</SecondaryButton>
      <S.SelectedPlace>{place ? `장소 번호 ${place.placeNo}` : "선택된 장소 없음"}</S.SelectedPlace>
      {place && <TableActionButton type="button" aria-label={`${label} 선택 해제`} onClick={onClear}>선택 해제</TableActionButton>}
    </S.PlaceControls>
  </S.FormRow>;
}

function CourseFormContent({ courseNo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = /^\/admin\/courses(?:\?|$)/.test(location.state?.returnTo || "") ? location.state.returnTo : "/admin/courses";
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadState, setLoadState] = useState(courseNo ? "loading" : "ready");
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pickerIndex, setPickerIndex] = useState(null);
  const saveLock = useRef(false);
  const heading = courseNo ? "고정코스 수정" : "고정코스 등록";

  useEffect(() => {
    if (!courseNo) return;
    const controller = new AbortController();
    Promise.all([PlaceAPI.getPins(controller.signal), AdminCourseAPI.getCourse(courseNo, controller.signal)])
      .then(([pins, detail]) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(pins)) throw new Error("명소 목록을 확인할 수 없습니다.");
        if (!detail) throw new Error("코스를 찾을 수 없습니다.");
        if ((detail.waypointPlaceNos || []).length > 3) throw new Error("중간 관광지가 3개를 초과하여 수정할 수 없습니다.");
        const waypointIds = detail.waypointPlaceNos || [];
        const ids = [detail.startPlaceNo, waypointIds[0], waypointIds[1], waypointIds[2], detail.endPlaceNo];
        setForm({
          courseName: detail.courseName || "",
          description: detail.description || "",
          stops: ids.map((id) => id ? pins.find((pin) => pin.placeNo === id) || { placeNo: id, placeName: `기존 장소 #${id}` } : null),
        });
        setLoadState("ready");
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setLoadError(failure?.message || "코스 정보를 불러오지 못했습니다.");
          setLoadState("error");
        }
      });
    return () => controller.abort();
  }, [courseNo, revision]);

  const update = (name, value) => {
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };
  const updatePlace = (index, place) => {
    if (saveLock.current) return;
    setError("");
    setForm((current) => ({ ...current, stops: current.stops.map((stop, order) => order === index ? place : stop) }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (saveLock.current || saved) return;
    const payload = {
      courseName: form.courseName.trim(),
      description: form.description.trim(),
      startPlaceNo: form.stops[0]?.placeNo,
      waypointPlaceNos: form.stops.slice(1, 4).filter(Boolean).map((place) => place.placeNo),
      endPlaceNo: form.stops[4]?.placeNo,
    };
    if (!payload.courseName || !payload.description) { setError("코스명과 설명을 입력해주세요."); return; }
    if (!payload.startPlaceNo || !payload.endPlaceNo) { setError("출발지와 도착지를 선택해주세요."); return; }
    const ids = [payload.startPlaceNo, ...payload.waypointPlaceNos, payload.endPlaceNo];
    if (ids.some((id) => !Number.isSafeInteger(id) || id < 1)) { setError("선택한 장소를 확인해주세요."); return; }
    if (new Set(ids).size !== ids.length) { setError("같은 명소를 중복으로 선택할 수 없습니다."); return; }
    saveLock.current = true;
    setSaving(true);
    setError("");
    try {
      if (courseNo) await AdminCourseAPI.updateCourse(courseNo, payload);
      else await AdminCourseAPI.createCourse(payload);
      setSaved(true);
    } catch (failure) {
      setError(failure?.message || "코스를 저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
      saveLock.current = false;
    }
  };

  return <Page aria-label={heading}>
    <S.Header><PageTitle>{heading}</PageTitle><SecondaryButton disabled={saving} onClick={() => navigate(returnTo)}>목록으로</SecondaryButton></S.Header>
    {loadState === "loading" ? <Feedback role="status">로딩중...</Feedback>
      : loadState === "error" ? <Feedback $error role="alert"><p>{loadError}</p><SecondaryButton onClick={() => { setLoadState("loading"); setRevision((value) => value + 1); }}>다시 시도</SecondaryButton></Feedback>
      : <S.CourseForm onSubmit={submit}>
        <fieldset disabled={saving || saved}>
          <S.Section aria-labelledby="basic-info-title">
            <S.SectionTitle id="basic-info-title">기본 정보</S.SectionTitle>
            <S.FormRow><label htmlFor="course-name">코스명<S.Required aria-hidden="true">*</S.Required></label><BaseInput id="course-name" required maxLength={100} placeholder="예) 김포 한강 힐링 코스" value={form.courseName} onChange={(event) => update("courseName", event.target.value)} /></S.FormRow>
            <S.FormRow><label htmlFor="course-description">코스 설명<S.Required aria-hidden="true">*</S.Required></label><div><BaseTextarea id="course-description" rows={4} required maxLength={500} placeholder="코스에 대한 상세한 설명을 입력해주세요." value={form.description} onChange={(event) => update("description", event.target.value)} /><S.CharacterCount>{form.description.length} / 500자</S.CharacterCount></div></S.FormRow>
          </S.Section>
          <S.Section aria-labelledby="route-config-title">
            <S.SectionTitle id="route-config-title">코스 경로 설정</S.SectionTitle>
            <S.Hint>출발지와 도착지를 선택하고, 중간 관광지는 방문 순서대로 최대 3곳까지 선택해주세요.</S.Hint>
            {STOP_LABELS.map((label, index) => <PlaceField key={label} index={index} place={form.stops[index]} onSearch={() => setPickerIndex(index)} onClear={() => updatePlace(index, null)} />)}
          </S.Section>
          {error && <FormError role="alert">{error}</FormError>}
          <S.FormActions><SecondaryButton type="button" onClick={() => navigate(returnTo)}>취소</SecondaryButton><PrimaryButton type="submit">{saving ? "저장 중…" : courseNo ? "수정 저장" : "등록"}</PrimaryButton></S.FormActions>
        </fieldset>
      </S.CourseForm>}
    {pickerIndex !== null && <PlaceSearchModal key={pickerIndex} targetLabel={STOP_LABELS[pickerIndex]} currentPlaceNo={form.stops[pickerIndex]?.placeNo} excludedPlaceNos={form.stops.filter((_, index) => index !== pickerIndex).filter(Boolean).map((place) => place.placeNo)} onSelect={(place) => { updatePlace(pickerIndex, place); setPickerIndex(null); }} onClose={() => setPickerIndex(null)} />}
    <Modal isOpen={saved} title={courseNo ? "수정 완료" : "등록 완료"} message={courseNo ? "코스가 수정되었습니다." : "코스가 등록되었습니다."} onConfirm={() => navigate(returnTo)} />
  </Page>;
}

export default function AdminCourseForm() {
  const { courseNo } = useParams();
  return <CourseFormContent key={courseNo || "new"} courseNo={courseNo} />;
}
