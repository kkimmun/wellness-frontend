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

const SearchPanel = ({
  pins,
  onPlaceSelect,
  bookmarks,
  toggleBookmark,
  isVisible,
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
  const ITEMS_PER_PAGE = 3;

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

      // 검색 시 문자열 처리 (공백 제거 및 대소문자 무시)
      const searchStr = searchKeyword.replace(/\s+/g, "").toLowerCase();

      const filtered = pins.filter((p) => {
        const placeName = (p.placeName || "")
          .replace(/\s+/g, "")
          .toLowerCase();
        const addr = (p.addr || "").replace(/\s+/g, "").toLowerCase();
        return placeName.includes(searchStr) || addr.includes(searchStr);
      });

      const endIdx = currentPage * ITEMS_PER_PAGE;
      const paginated = filtered.slice(0, endIdx);

      setDisplayedResults(paginated);
      setHasMore(endIdx < filtered.length);
      setIsSearching(false);

      if (currentPage === 1 && onSearchResults) {
        onSearchResults(filtered);
      }
    },
    [pins, onSearchResults],
  );

  useEffect(() => {
    // 핀 데이터가 변경되더라도, 유저가 이미 검색을 한 상태일 때만 재검색 적용
    if (pins && pins.length > 0 && hasSearched) {
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

      {hasSearched && (
        <ResultListContainer>
          {displayedResults.map((place) => {
            const isBookmarked = bookmarks[place.placeNo];
            return (
              <ListCard key={place.placeNo} onClick={() => onPlaceSelect(place)}>
                <CardHeader>
                  <TitleGroup>
                    <PlaceTitle>{place.placeName}</PlaceTitle>
                    {/* DB 지도 핀 연동: API에 없는 리뷰 값을 목업 숫자로 채우지 않는다. */}
                    {(Number.isFinite(place.reviewCount) ||
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
                  <BookmarkBtn onClick={(e) => toggleBookmark(e, place.placeNo)}>
                    {isBookmarked ? (
                      <BsBookmarkFill
                        size={21}
                        color="#C9A227"
                      /> /* 테마의 gimpoGold 색상 활용 */
                    ) : (
                      <BsBookmark size={21} />
                    )}
                  </BookmarkBtn>
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

          {hasMore && (
            <LoadingSpinner ref={observerTarget}>
              {isSearching ? "검색 중..." : "스크롤을 내려 더보기"}
            </LoadingSpinner>
          )}
          {!hasMore && displayedResults.length > 0 && (
            <LoadingSpinner style={{ color: "#CCC" }}>
              마지막 결과입니다.
            </LoadingSpinner>
          )}
          {displayedResults.length === 0 && !isSearching && (
            <LoadingSpinner>검색 결과가 없습니다.</LoadingSpinner>
          )}
        </ResultListContainer>
      )}
    </PanelContainer>
  );
};

export default SearchPanel;
