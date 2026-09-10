import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaStar, FaPhoneAlt } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {
  PanelContainer,
  SearchHeader,
  SearchBarBox,
  SearchInput,
  SearchButton,
  ResultListContainer,
  ListCard,
  CardHeader,
  TitleGroup,
  PlaceTitle,
  ReviewInfo,
  BookmarkBtn,
  AddressRow,
  CardFooter,
  PhoneText,
  ActionButtons,
  LoadingSpinner,
} from "./SearchPanel.styles";
import { filterDbPlaces } from "../utils/placeSearch";

const SEARCH_PAGE_SIZE = 15;

const SearchPanel = ({
  pins,
  onPlaceSelect,
  bookmarks,
  toggleBookmark,
  isVisible,
  showFilteredResults = false,
  filtersLoading = false,
  onSearchResults,
  // 길찾기 기능 연동: 검색 결과를 출발지/도착지로 전달하는 콜백
  onSetOrigin,
  onSetDestination,
}) => {
  const [keyword, setKeyword] = useState("");
  const [displayedResults, setDisplayedResults] = useState([]);
  // 코드 리뷰 반영: 현재 페이지를 직접 사용해 함수형 setter 안에서 검색 상태를 다시 갱신하지 않도록 한다.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // 처음 진입 시 검색 전 상태 
  const [lastSearchedKeyword, setLastSearchedKeyword] = useState(""); // 추가: 마지막으로 실제 검색을 수행한 키워드

  const observerTarget = useRef(null);

  // 기존 코드 개선: 핀 변경 시 최신 목록으로 검색하도록 함수 의존성을 명확히 고정한다.
  const executeSearch = useCallback(
    (searchKeyword, currentPage = 1) => {
      setIsSearching(true);
      setPage(currentPage); // 항상 전달받은 페이지로 상태 동기화

      // 빈 검색어 처리: 아무것도 안 나오게 (hasSearched = false로 설정하여 드롭다운 숨김)
      if (!searchKeyword || !searchKeyword.trim()) {
        setDisplayedResults([]);
        setHasMore(false);
        setIsSearching(false);
        setHasSearched(false);
        if (onSearchResults) onSearchResults(pins); // 빈 배열 대신 전체 원본 pins 복원
        return;
      }

      setHasSearched(true);
      setLastSearchedKeyword(searchKeyword);

      // 지도 검색은 외부 카카오 결과를 섞지 않고 현재 DB에서 받은 장소만 사용한다.
      const filteredLocal = filterDbPlaces(pins, searchKeyword);
      const startIndex = (currentPage - 1) * SEARCH_PAGE_SIZE;
      const pageResults = filteredLocal.slice(
        startIndex,
        startIndex + SEARCH_PAGE_SIZE,
      );

      setDisplayedResults((prev) =>
        currentPage === 1 ? pageResults : [...prev, ...pageResults],
      );
      // 목록은 나누어 보여주되 지도에는 검색 조건에 맞는 DB 핀 전체를 표시한다.
      if (onSearchResults) onSearchResults(filteredLocal);
      setHasMore(startIndex + SEARCH_PAGE_SIZE < filteredLocal.length);
      setIsSearching(false);
    },
    [pins, onSearchResults],
  );

  useEffect(() => {
    // DB 장소 필터 연동: 필터 결과가 0건이어도 이전 검색 결과가 남지 않게 빈 배열까지 재검색한다.
    if (hasSearched) {
      // 기존 코드 개선: effect 본문에서 동기 setState가 발생하지 않도록 다음 작업으로 예약한다.
      const timeoutId = window.setTimeout(
        () => executeSearch(lastSearchedKeyword, 1),
        0,
      );
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [pins, lastSearchedKeyword, hasSearched, executeSearch]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isSearching) {
        const nextPage = page + 1;
        executeSearch(lastSearchedKeyword, nextPage);
      }
    },
    [page, hasMore, isSearching, lastSearchedKeyword, executeSearch],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    // 기존 코드 개선: 정리 시점에도 같은 DOM을 해제하도록 ref 값을 고정한다.
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [handleObserver]);

  const handleSearchClick = () => {
    executeSearch(keyword, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const resultsToRender = hasSearched ? displayedResults : pins;
  const resultsLoading = filtersLoading || isSearching;

  return (
    <PanelContainer $isVisible={isVisible}>
      <SearchHeader>
        <SearchBarBox>
          <SearchInput
            type="text"
            placeholder="검색어를 입력해주세요"
            value={keyword}
            onChange={(e) => {
              const val = e.target.value;
              setKeyword(val);
              if (!val.trim()) {
                executeSearch("", 1);
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearchClick}>
            <FaSearch size={21} />
          </SearchButton>
        </SearchBarBox>
      </SearchHeader>

      {(hasSearched || showFilteredResults) && (
        <ResultListContainer>
          {filtersLoading && <LoadingSpinner>장소를 불러오는 중입니다...</LoadingSpinner>}
          {!filtersLoading && resultsToRender.map((place) => {
            const isBookmarked = bookmarks[place.placeNo];
            return (
              <ListCard key={place.placeNo} onClick={() => onPlaceSelect(place)}>
                <CardHeader>
                  <TitleGroup>
                    <PlaceTitle>{place.placeName}</PlaceTitle>
                    {!place.isExternal &&
                    (Number.isFinite(place.reviewCount) ||
                      Number.isFinite(place.avgRating)) && (
                      <ReviewInfo>
                        {Number.isFinite(place.reviewCount) && (
                          <span className="review-text">
                            리뷰 {place.reviewCount}
                          </span>
                        )}
                        {Number.isFinite(place.avgRating) && (
                          <>
                            <FaStar size={15} />
                            <span className="rating-text">
                              {place.avgRating.toFixed(1)}
                            </span>
                          </>
                        )}
                      </ReviewInfo>
                    )}
                  </TitleGroup>
                  {!place.isExternal && (
                    <BookmarkBtn onClick={(e) => toggleBookmark(e, place.placeNo)}>
                      {isBookmarked ? (
                        <BsBookmarkFill
                          size={21}
                          color="#C9A227"
                        />
                      ) : (
                        <BsBookmark size={21} />
                      )}
                    </BookmarkBtn>
                  )}
                </CardHeader>

                <AddressRow>
                  <div className="addr-item">
                    <span className="addr-label">도로명</span>
                    <span className="addr-value">{place.addr}</span>
                  </div>
                  {place.addrDetail && (
                    <div className="addr-item">
                      <span className="addr-label">지번</span>
                      <span className="addr-value">{place.addrDetail}</span>
                    </div>
                  )}
                </AddressRow>

                <CardFooter>
                  <PhoneText>
                    <FaPhoneAlt />
                    {place.phone || "번호없음"}
                  </PhoneText>
                  <ActionButtons>
                    <button
                      className="btn-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 길찾기 기능 연동: 기존 임시 alert 대신 선택 장소를 출발지로 설정
                        onSetOrigin(place);
                      }}
                    >
                      출발
                    </button>
                    <button
                      className="btn-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 길찾기 기능 연동: 기존 임시 alert 대신 선택 장소를 도착지로 설정
                        onSetDestination(place);
                      }}
                    >
                      도착
                    </button>
                  </ActionButtons>
                </CardFooter>
              </ListCard>
            );
          })}

          {hasSearched && hasMore && !filtersLoading && (
            <LoadingSpinner ref={observerTarget}>
              {isSearching ? "검색 중..." : "스크롤을 내려 더보기"}
            </LoadingSpinner>
          )}
          {(!hasSearched || !hasMore) && resultsToRender.length > 0 && !resultsLoading && (
            <LoadingSpinner style={{ color: "#CCC" }}>
              마지막 결과입니다.
            </LoadingSpinner>
          )}
          {resultsToRender.length === 0 && !resultsLoading && (
            <LoadingSpinner>선택한 조건에 해당하는 장소가 없습니다.</LoadingSpinner>
          )}
        </ResultListContainer>
      )}
    </PanelContainer>
  );
};

export default SearchPanel;
