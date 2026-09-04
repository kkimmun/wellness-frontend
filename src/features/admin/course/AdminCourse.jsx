import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiAlertCircle, FiSearch } from "react-icons/fi";
import { PrimaryButton, SecondaryButton, TableActionButton } from "../../../components/Button/Button.styles";
import { BaseInput, SearchInputWrapper } from "../../../components/Input/Input.styles";
import { DropdownSelect } from "../../../components/Select/Select.styles";
import Pagination from "../../../components/Common/Pagination";
import { Modal } from "../../../components/Modal/Modal";
import { PageTitle, Toolbar, ActionGroup, SelectedCount, TableWrapper, Th, Td, Tr, CheckboxCell, TruncateText, RowActions } from "../place/AdminPlace.styles";
import { AdminCourseAPI } from "./api/adminCourseApi";
import * as S from "./AdminCourse.styles";

export default function AdminCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get("page") || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const keyword = params.get("keyword") || "";
  const active = ["Y", "N"].includes(params.get("active")) ? params.get("active") : "";
  const [inputs, setInputs] = useState({ key: location.key, keyword, active });
  const [submittedQuery, setSubmittedQuery] = useState(null);
  // URL 이동 시 입력값도 동기화하되 입력 DOM을 재생성하지 않는다.
  if (inputs.key !== location.key) {
    const isSubmittedNavigation = submittedQuery === JSON.stringify([page, keyword, active]);
    setInputs(isSubmittedNavigation ? { ...inputs, key: location.key } : { key: location.key, keyword, active });
    setSubmittedQuery(null);
  }
  const [revision, setRevision] = useState(0);
  const requestKey = JSON.stringify([page, keyword, active, revision]);
  const [response, setResponse] = useState({ key: null, data: null, error: "" });
  const [selected, setSelected] = useState(() => new Set());
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState(null);
  const [pending, setPending] = useState(false);
  const actionLock = useRef(false);
  const allCheckbox = useRef(null);
  const loading = response.key !== requestKey;
  const rows = loading || response.error ? [] : response.data?.content || [];
  const selectedNos = rows.filter((row) => selected.has(row.courseNo)).map((row) => row.courseNo);
  const allSelected = rows.length > 0 && selectedNos.length === rows.length;

  useEffect(() => {
    const controller = new AbortController();
    AdminCourseAPI.getCourses({ page, keyword, active }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, data.totalPages || 0);
        if (page > lastPage) {
          const next = new URLSearchParams();
          if (lastPage > 1) next.set("page", lastPage);
          if (keyword) next.set("keyword", keyword);
          if (active) next.set("active", active);
          setParams(next, { replace: true });
          return;
        }
        setResponse({ key: requestKey, data, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResponse({ key: requestKey, data: null, error: error?.message || "코스 목록을 불러오지 못했습니다. 다시 시도해주세요." });
        }
      });
    return () => controller.abort();
  }, [page, keyword, active, requestKey, setParams]);

  useEffect(() => {
    if (allCheckbox.current) allCheckbox.current.indeterminate = selectedNos.length > 0 && !allSelected;
  }, [selectedNos.length, allSelected]);

  const changeQuery = (next) => {
    if (actionLock.current) return;
    const query = new URLSearchParams();
    if (next.page > 1) query.set("page", next.page);
    if (next.keyword) query.set("keyword", next.keyword);
    if (next.active) query.set("active", next.active);
    setSubmittedQuery(JSON.stringify([next.page, next.keyword, next.active]));
    setSelected(new Set());
    setParams(query);
    setRevision((value) => value + 1);
  };

  const toggleRow = (courseNo) => setSelected((previous) => {
    const next = new Set(previous);
    if (next.has(courseNo)) next.delete(courseNo);
    else next.add(courseNo);
    return next;
  });

  const runAction = async () => {
    if (!confirmation || actionLock.current) return;
    actionLock.current = true;
    setPending(true);
    try {
      if (confirmation.type === "status") {
        await AdminCourseAPI.updateStatus(confirmation.row.courseNo, confirmation.row.active === "Y" ? "N" : "Y");
        setNotice({ title: "상태 변경 완료", message: "활성 상태가 변경되었습니다." });
        setSelected(new Set());
      } else {
        // 명세에 일괄 삭제 API가 없으므로 단건 API로 각각 요청하고 실패한 항목을 유지한다.
        const results = await Promise.allSettled(confirmation.ids.map(AdminCourseAPI.deleteCourse));
        const failed = confirmation.ids.filter((_, index) => results[index].status === "rejected");
        setSelected(new Set(failed));
        const deleted = confirmation.ids.length - failed.length;
        const reason = results.find((result) => result.status === "rejected")?.reason?.message;
        setNotice(failed.length
          ? { title: "삭제 결과 확인", message: `${deleted}건 삭제, ${failed.length}건 삭제 실패. ${reason || "실패한 코스를 다시 선택해 시도해주세요."}` }
          : { title: "삭제 완료", message: confirmation.ids.length === 1 ? "코스가 삭제되었습니다." : `${deleted}건의 코스가 삭제되었습니다.` });
      }
      setRevision((value) => value + 1);
    } catch (error) {
      setNotice({ title: "처리 실패", message: error?.message || "요청을 처리하지 못했습니다. 다시 시도해주세요." });
    } finally {
      setConfirmation(null);
      setPending(false);
      actionLock.current = false;
    }
  };

  const goToForm = (path) => navigate(path, { state: { returnTo: location.pathname + location.search } });
  const confirmationMessage = confirmation?.type === "status"
    ? `‘${confirmation.row.courseName}’ 코스를 ${confirmation.row.active === "Y" ? "비활성" : "활성"} 상태로 변경하시겠습니까?`
    : confirmation?.ids.length === 1 ? "코스를 삭제하시겠습니까?" : `선택한 ${confirmation?.ids.length || 0}건의 코스를 삭제하시겠습니까?`;

  return (
    <S.Page aria-label="순례자길 관리">
      <PageTitle>순례자길 관리</PageTitle>
      <Toolbar>
        <S.CourseSearchForm onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          changeQuery({ page: 1, keyword: String(values.get("keyword")).trim(), active: values.get("active") });
        }}>
          <DropdownSelect name="active" aria-label="코스 상태" value={inputs.active} onChange={(event) => setInputs((value) => ({ ...value, active: event.target.value }))} disabled={pending}>
            <option value="">전체</option><option value="Y">활성</option><option value="N">비활성</option>
          </DropdownSelect>
          <SearchInputWrapper>
            <BaseInput name="keyword" type="search" aria-label="코스명 검색" placeholder="코스명을 입력하세요" value={inputs.keyword} onChange={(event) => setInputs((value) => ({ ...value, keyword: event.target.value }))} disabled={pending} />
            <FiSearch aria-hidden="true" />
          </SearchInputWrapper>
          <PrimaryButton type="submit" disabled={pending}>검색</PrimaryButton>
        </S.CourseSearchForm>
        <ActionGroup>
          {selectedNos.length > 0 && <SelectedCount>{selectedNos.length}건 선택</SelectedCount>}
          <SecondaryButton type="button" disabled={!selectedNos.length || pending || loading} onClick={() => setConfirmation({ type: "delete", ids: selectedNos })}>선택 삭제</SecondaryButton>
          <PrimaryButton type="button" disabled={pending} onClick={() => goToForm("/admin/courses/add")}>코스 등록</PrimaryButton>
        </ActionGroup>
      </Toolbar>
      {loading ? <S.Feedback role="status">로딩중...</S.Feedback>
        : response.error ? <S.Feedback $error role="alert"><p>{response.error}</p><SecondaryButton onClick={() => setRevision((value) => value + 1)}>다시 시도</SecondaryButton></S.Feedback>
        : rows.length === 0 ? <S.Feedback role="status">{keyword || active ? "검색 결과가 없습니다." : "등록된 코스가 없습니다."}</S.Feedback>
        : <>
          <TableWrapper tabIndex={0} role="region" aria-label="고정코스 목록">
            <S.CourseTable>
              <thead><tr>
                <Th scope="col" style={{ width: 40 }}><input ref={allCheckbox} type="checkbox" aria-label="현재 페이지 전체 선택" checked={allSelected} disabled={pending} onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.courseNo)))} /></Th>
                {["코스 ID", "코스명", "설명", "생성일", "상태", "관리"].map((label) => <Th key={label} scope="col">{label}</Th>)}
              </tr></thead>
              <tbody>{rows.map((row) => <Tr key={row.courseNo}>
                <CheckboxCell><input type="checkbox" aria-label={`${row.courseName} 선택`} checked={selected.has(row.courseNo)} disabled={pending} onChange={() => toggleRow(row.courseNo)} /></CheckboxCell>
                <Td>{row.courseNo}</Td>
                <Td><TruncateText title={row.courseName}>{row.courseName}</TruncateText></Td>
                <Td><TruncateText title={row.description}>{row.description || "-"}</TruncateText></Td>
                <Td>{(row.createDate || row.createdDate || "").slice(0, 10) || "-"}</Td>
                <Td><S.StatusButton type="button" $active={row.active === "Y"} disabled={pending || !["Y", "N"].includes(row.active)} aria-label={`${row.courseName} ${row.active === "Y" ? "활성" : "비활성"} 상태 변경`} onClick={() => setConfirmation({ type: "status", row })}>{row.active === "Y" ? "활성" : row.active === "N" ? "비활성" : "상태 미확인"}</S.StatusButton></Td>
                <Td><RowActions>
                  <TableActionButton disabled={pending} onClick={() => goToForm(`/admin/courses/${row.courseNo}/edit`)}>수정</TableActionButton>
                  <TableActionButton disabled={pending} onClick={() => setConfirmation({ type: "delete", ids: [row.courseNo] })}>삭제</TableActionButton>
                </RowActions></Td>
              </Tr>)}</tbody>
            </S.CourseTable>
          </TableWrapper>
          <Pagination currentPage={page} totalPages={response.data.totalPages} onPageChange={(next) => changeQuery({ page: next, keyword, active })} />
        </>}
      <Modal isOpen={Boolean(confirmation)} title={confirmation?.type === "status" ? "활성 상태 변경" : "코스 삭제"} message={confirmationMessage} icon={FiAlertCircle} iconColor="danger" showClose pending={pending} confirmText={pending ? "처리 중…" : "예"} confirmVariant={confirmation?.type === "delete" ? "danger" : "primary"} onConfirm={runAction} onCancel={() => { if (!actionLock.current) setConfirmation(null); }} />
      <Modal isOpen={Boolean(notice)} title={notice?.title} message={notice?.message} onConfirm={() => setNotice(null)} />
    </S.Page>
  );
}
