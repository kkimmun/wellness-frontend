import { useEffect, useState } from "react";
import { FiInfo, FiSearch } from "react-icons/fi";
import { PlaceAPI } from "../../../api/place";
import { Modal } from "../../../components/Modal/Modal";
import { PrimaryButton, SecondaryButton } from "../../../components/Button/Button.styles";
import { BaseInput, SearchInputWrapper } from "../../../components/Input/Input.styles";
import Pagination from "../../../components/Common/Pagination";
import { TableWrapper, Th, Td } from "../place/AdminPlace.styles";
import * as S from "./PlaceSearchModal.styles";

const PAGE_SIZE = 5;

// 전체 명소를 제공하는 기존 API를 재사용하고 결과 내에서 이름 검색과 페이지 이동을 처리한다.
export default function PlaceSearchModal({ targetLabel, currentPlaceNo, excludedPlaceNos, onSelect, onClose }) {
  const [response, setResponse] = useState({ places: [], status: "loading", error: "" });
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    PlaceAPI.getPins(controller.signal).then((places) => {
      if (controller.signal.aborted) return;
      if (!Array.isArray(places)) throw new Error("명소 목록을 확인할 수 없습니다.");
      setResponse({ places, status: "ready", error: "" });
    }).catch((error) => {
      if (!controller.signal.aborted) setResponse({ places: [], status: "error", error: error?.message || "명소 목록을 불러오지 못했습니다." });
    });
    return () => controller.abort();
  }, [attempt]);

  const filtered = response.places.filter((place) => (place.placeName || "").toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <Modal isOpen title="웰니스 장소 선택" size="wide" showClose onCancel={onClose} cancelText="취소">
    <S.SearchForm onSubmit={(event) => { event.preventDefault(); setKeyword(input.trim()); setPage(1); }}>
      <SearchInputWrapper><BaseInput type="search" aria-label="장소명 검색" placeholder="장소명 입력" value={input} onChange={(event) => setInput(event.target.value)} /><FiSearch aria-hidden="true" /></SearchInputWrapper>
      <PrimaryButton type="submit" disabled={response.status === "loading"}>검색</PrimaryButton>
    </S.SearchForm>
    <S.Notice><FiInfo aria-hidden="true" />장소를 선택하면 {targetLabel}에 바로 적용됩니다. 이미 다른 구간에 선택한 장소는 중복 선택할 수 없습니다.</S.Notice>
    {response.status === "loading" ? <S.State role="status">로딩중...</S.State>
      : response.status === "error" ? <S.State $error role="alert">{response.error}<SecondaryButton onClick={() => { setResponse({ places: [], status: "loading", error: "" }); setAttempt((value) => value + 1); }}>다시 시도</SecondaryButton></S.State>
      : filtered.length === 0 ? <S.State role="status">{keyword ? "검색 결과가 없습니다." : "등록된 명소가 없습니다."}</S.State>
      : <>
        <TableWrapper role="region" aria-label="웰니스 장소 검색 결과" tabIndex={0}>
          <S.PlaceTable>
            <thead><tr>{["장소명", "주소", "카테고리", "장소 번호", "선택"].map((title) => <Th key={title} scope="col">{title}</Th>)}</tr></thead>
            <tbody>{visible.map((place) => {
              const excluded = excludedPlaceNos.includes(place.placeNo);
              const current = place.placeNo === currentPlaceNo;
              return <S.PlaceRow key={place.placeNo} $current={current}>
                <Td>{place.placeName}</Td><Td>{[place.addr, place.addrDetail].filter(Boolean).join(" ") || "-"}</Td><Td>{place.type || "-"}</Td><Td>{place.placeNo}</Td>
                <Td><PrimaryButton type="button" $size="sm" disabled={excluded} aria-label={`${place.placeName} ${excluded ? "선택 불가" : "선택"}`} onClick={() => onSelect(place)}>{excluded ? "사용 중" : current ? "현재 장소" : "선택"}</PrimaryButton></Td>
              </S.PlaceRow>;
            })}</tbody>
          </S.PlaceTable>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </>}
  </Modal>;
}
