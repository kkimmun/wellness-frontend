import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import {
  PrimaryButton,
  SecondaryButton,
  TableActionButton,
} from "../../../components/Button/Button.styles";
import {
  BaseInput,
  SearchInputWrapper,
} from "../../../components/Input/Input.styles";
import { DropdownSelect } from "../../../components/Select/Select.styles";
import Pagination from "../../../components/Common/Pagination";
import { Modal } from "../../../components/Modal/Modal";
import { AdminPlaceAPI } from "./api/adminPlaceApi";
import { PLACE_TYPE_GROUPS } from "./placeTypeOptions";
import {
  PageTitle,
  Toolbar,
  SearchForm,
  ActionGroup,
  SelectedCount,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  CheckboxCell,
  DelBadge,
  TruncateText,
  RowActions,
  StateBox,
} from "./AdminPlace.styles";

const TARGET_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "placeName", label: "명소명" },
  { value: "placeDetailNo", label: "명소타입" },
];

const PAGE_SIZE_FALLBACK = 10;

const AdminPlace = () => {
  const navigate = useNavigate();

  // 입력 상태 (검색 실행 전)
  const [keywordInput, setKeywordInput] = useState("");
  const [targetInput, setTargetInput] = useState("all");

  // 실제 조회에 사용하는 확정 쿼리 (page는 1부터)
  const [query, setQuery] = useState({ page: 1, keyword: "", target: "all" });
  const [refetchKey, setRefetchKey] = useState(0);

  const [result, setResult] = useState({
    content: [],
    currentPage: 1,
    size: PAGE_SIZE_FALLBACK,
    totalElements: 0,
    totalPages: 0,
  });
  const [screenState, setScreenState] = useState("loading"); // loading | success | empty | error
  const [errorMessage, setErrorMessage] = useState("");

  const [selected, setSelected] = useState(() => new Set());
  const [modalType, setModalType] = useState(null); // "delete" | "restore" | null
  const [actionLoading, setActionLoading] = useState(false);

  // 목록 조회 / 검색
  useEffect(() => {
    let ignore = false;

    const fetchPlaces = async () => {
      setScreenState("loading");
      setErrorMessage("");
      try {
        const data = await AdminPlaceAPI.getPlaces({
          page: query.page,
          keyword: query.keyword,
          target: query.target,
        });
        if (ignore) return;

        const content = data?.content ?? [];
        setResult({
          content,
          currentPage: data?.currentPage ?? query.page, // 페이지는 1부터
          size: data?.size ?? PAGE_SIZE_FALLBACK,
          totalElements: data?.totalElements ?? 0,
          totalPages: data?.totalPages ?? 0,
        });
        setScreenState(content.length === 0 ? "empty" : "success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          err?.message || "명소 목록을 불러오지 못했습니다. 다시 시도해주세요.",
        );
        setScreenState("error");
      }
    };

    fetchPlaces();
    return () => {
      ignore = true;
    };
  }, [query, refetchKey]);

  const handleTargetChange = (e) => {
    // 검색 대상이 바뀌면 입력값을 초기화 (타입 검색은 typeDetailNo, 그 외는 자유 텍스트)
    setTargetInput(e.target.value);
    setKeywordInput("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelected(new Set());
    setQuery({ page: 1, keyword: keywordInput, target: targetInput });
  };

  const handlePageChange = (page) => {
    setSelected(new Set());
    setQuery((prev) => ({ ...prev, page }));
  };

  const toggleRow = useCallback((placeNo) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeNo)) next.delete(placeNo);
      else next.add(placeNo);
      return next;
    });
  }, []);

  const currentPageNos = result.content.map((row) => row.placeNo);
  const isAllSelected =
    currentPageNos.length > 0 && currentPageNos.every((no) => selected.has(no));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isAllSelected) currentPageNos.forEach((no) => next.delete(no));
      else currentPageNos.forEach((no) => next.add(no));
      return next;
    });
  };

  const runAction = async () => {
    if (selected.size === 0 || !modalType) return;
    const placeNos = Array.from(selected);
    setActionLoading(true);
    try {
      if (modalType === "delete") await AdminPlaceAPI.deletePlaces(placeNos);
      else await AdminPlaceAPI.restorePlaces(placeNos);

      setModalType(null);
      setSelected(new Set());
      setRefetchKey((k) => k + 1); // 현재 쿼리로 재조회
    } catch (err) {
      setModalType(null);
      setErrorMessage(
        err?.message ||
          (modalType === "delete"
            ? "장소 삭제에 실패했습니다. 다시 시도해주세요."
            : "장소 복구에 실패했습니다. 다시 시도해주세요."),
      );
      setScreenState("error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <PageTitle>웰니스 명소 관리</PageTitle>

      <Toolbar>
        <SearchForm onSubmit={handleSearch}>
          <DropdownSelect
            value={targetInput}
            onChange={handleTargetChange}
            aria-label="검색 대상"
          >
            {TARGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </DropdownSelect>

          {targetInput === "placeDetailNo" ? (
            <DropdownSelect
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              aria-label="명소 타입"
            >
              <option value="">명소 타입 선택</option>
              {PLACE_TYPE_GROUPS.map((group) => (
                <optgroup key={group.type} label={group.type}>
                  {group.items.map((item) => (
                    <option key={item.typeDetailNo} value={item.typeDetailNo}>
                      {item.detail}
                    </option>
                  ))}
                </optgroup>
              ))}
            </DropdownSelect>
          ) : (
            <SearchInputWrapper>
              <BaseInput
                type="search"
                placeholder="검색어를 입력하세요"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
              />
              <FiSearch />
            </SearchInputWrapper>
          )}

          <PrimaryButton type="submit">검색</PrimaryButton>
        </SearchForm>

        <ActionGroup>
          {selected.size > 0 && (
            <SelectedCount>{selected.size}건 선택</SelectedCount>
          )}
          <SecondaryButton
            type="button"
            disabled={selected.size === 0}
            onClick={() => setModalType("restore")}
          >
            복구
          </SecondaryButton>
          <SecondaryButton
            type="button"
            disabled={selected.size === 0}
            onClick={() => setModalType("delete")}
          >
            삭제
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={() => navigate("/admin/places/add")}
          >
            명소 추가
          </PrimaryButton>
        </ActionGroup>
      </Toolbar>

      {screenState === "loading" && (
        <StateBox>목록을 불러오는 중입니다…</StateBox>
      )}

      {screenState === "error" && <StateBox $error>{errorMessage}</StateBox>}

      {screenState === "empty" && <StateBox>검색 결과가 없습니다.</StateBox>}

      {screenState === "success" && (
        <>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleAll}
                      aria-label="현재 페이지 전체 선택"
                    />
                  </Th>
                  <Th>명소키</Th>
                  <Th>게시일자</Th>
                  <Th>명소명</Th>
                  <Th>작성자</Th>
                  <Th>유형</Th>
                  <Th>연락처</Th>
                  <Th>상태</Th>
                  <Th>관리</Th>
                </tr>
              </thead>
              <tbody>
                {result.content.map((row) => {
                  const deleted = row.delYn === "Y";
                  return (
                    <Tr key={row.placeNo}>
                      <CheckboxCell>
                        <input
                          type="checkbox"
                          checked={selected.has(row.placeNo)}
                          onChange={() => toggleRow(row.placeNo)}
                          aria-label={`${row.placeName} 선택`}
                        />
                      </CheckboxCell>
                      <Td $deleted={deleted}>{row.placeNo}</Td>
                      <Td $deleted={deleted}>{row.createDate}</Td>
                      <Td $deleted={deleted}>
                        <TruncateText title={row.placeName}>
                          {row.placeName}
                        </TruncateText>
                      </Td>
                      <Td $deleted={deleted}>{row.memberName}</Td>
                      <Td $deleted={deleted}>{row.type}</Td>
                      <Td $deleted={deleted}>{row.phoneNumber}</Td>
                      <Td>
                        <DelBadge $deleted={deleted}>
                          {deleted ? "삭제됨" : "노출"}
                        </DelBadge>
                      </Td>
                      <Td>
                        <RowActions>
                          <TableActionButton
                            type="button"
                            onClick={() =>
                              navigate(`/admin/places/${row.placeNo}`)
                            }
                          >
                            상세
                          </TableActionButton>
                          <TableActionButton
                            type="button"
                            onClick={() =>
                              navigate(`/admin/places/edit/${row.placeNo}`)
                            }
                          >
                            수정
                          </TableActionButton>
                        </RowActions>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>

          <Pagination
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={modalType === "delete"}
        title="명소 삭제"
        message={`선택한 ${selected.size}건의 명소를 삭제하시겠습니까?`}
        confirmText={actionLoading ? "처리 중…" : "삭제"}
        confirmVariant="danger"
        cancelText="취소"
        onConfirm={runAction}
        onCancel={() => !actionLoading && setModalType(null)}
      />

      <Modal
        isOpen={modalType === "restore"}
        title="명소 복구"
        message={`선택한 ${selected.size}건의 명소를 복구하시겠습니까?`}
        confirmText={actionLoading ? "처리 중…" : "복구"}
        cancelText="취소"
        onConfirm={runAction}
        onCancel={() => !actionLoading && setModalType(null)}
      />
    </div>
  );
};

export default AdminPlace;
