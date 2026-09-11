import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {
  PanelContainer,
  SearchHeader,
  CompactSearchBarBox as SearchBarBox,
  CompactSearchInput as SearchInput,
  CompactSearchButton as SearchButton,
  ResultListContainer,
  CardHeader,
  ReviewInfo,
  BookmarkBtn,
  CardFooter,
  ActionButtons,
  LoadingSpinner,
  DragHandle,
  MobileFilterBar,
} from "./SearchPanel.styles";
import PlaceImage from "../../../components/PlaceImage";
import { Top10Card, ImageWrapper, InfoWrapper } from "./Top10Panel.styles";
import useIncrementalPlaces from "../hooks/useIncrementalPlaces";
import { filterDbPlaces } from "../utils/placeSearch";

const SearchPanel = ({
  pins,
  onPlaceSelect,
  bookmarks,
  toggleBookmark,
  isVisible,
  showFilteredResults = false,
  filtersLoading = false,
  onSearchResults,
  onSetOrigin,
  onSetDestination,
  mobileFilterContent,
}) => {
  const [keyword, setKeyword] = useState("");
  const [lastSearchedKeyword, setLastSearchedKeyword] = useState("");
  const hasSearched = Boolean(lastSearchedKeyword.trim());

  // 모바일 바텀시트 드래그 리사이즈
  const [mobileHeight, setMobileHeight] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(null);
  const dragStartHRef = useRef(null);
  const panelRef = useRef(null);

  const handleDragStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartYRef.current = clientY;
    dragStartHRef.current =
      panelRef.current?.getBoundingClientRect().height ?? window.innerHeight * 0.5;
    setIsDragging(true);
  };

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || dragStartYRef.current === null) return;
      if (e.cancelable) e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = dragStartYRef.current - clientY;
      const newHeight = Math.min(
        window.innerHeight * 0.85,
        Math.max(120, dragStartHRef.current + deltaY)
      );
      setMobileHeight(`${newHeight}px`);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartYRef.current = null;
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      const onMove = (e) => handleDragMove(e);
      const onEnd = () => handleDragEnd();

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onEnd);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 목록과 지도 모두 같은 검색 결과를 사용한다.
  const matchingPlaces = useMemo(
    () => (hasSearched ? filterDbPlaces(pins, lastSearchedKeyword) : pins),
    [pins, hasSearched, lastSearchedKeyword]
  );

  useEffect(() => {
    onSearchResults?.(matchingPlaces);
  }, [matchingPlaces, onSearchResults]);

  const { listRef, onScroll, visiblePlaces: resultsToRender, hasMore } =
    useIncrementalPlaces(matchingPlaces, lastSearchedKeyword);
  const resultsLoading = filtersLoading;

  const handleSearchClick = () => setLastSearchedKeyword(keyword.trim());
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) handleSearchClick();
  };

  return (
    <PanelContainer
      ref={panelRef}
      $isVisible={isVisible}
      $hasResults={hasSearched || showFilteredResults}
      $mobileHeight={mobileHeight}
      $isDragging={isDragging}
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <DragHandle
        onTouchStart={handleDragStart}
        onMouseDown={handleDragStart}
      />
      <SearchHeader $hasResults={hasSearched || showFilteredResults}>
        <SearchBarBox $isFloating={!hasSearched && !showFilteredResults}>
          <SearchInput
            type="text"
            aria-label="장소 검색"
            placeholder="검색어를 입력해주세요"
            value={keyword}
            onChange={(e) => {
              const val = e.target.value;
              setKeyword(val);
              if (!val.trim()) {
                setLastSearchedKeyword("");
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <SearchButton aria-label="검색" onClick={handleSearchClick}>
            <FaSearch size={21} />
          </SearchButton>
        </SearchBarBox>
      </SearchHeader>

      {mobileFilterContent && (
        <MobileFilterBar>{mobileFilterContent}</MobileFilterBar>
      )}

      {(hasSearched || showFilteredResults) && (
        <ResultListContainer
          ref={listRef}
          onScroll={onScroll}
          role="region"
          aria-label="장소 목록"
          tabIndex={0}
        >
          {filtersLoading && <LoadingSpinner>장소를 불러오는 중입니다...</LoadingSpinner>}
          {!filtersLoading &&
            resultsToRender.map((place) => {
              const isBookmarked = bookmarks[place.placeNo];
              return (
                <Top10Card key={place.placeNo} onClick={() => onPlaceSelect(place)}>
                  <ImageWrapper>
                    <PlaceImage
                      src={place.imageUrl || place.imgUrl}
                      place={place}
                      alt={place.placeName}
                    />
                  </ImageWrapper>
                  <InfoWrapper style={{ minWidth: 0 }}>
                    <CardHeader>
                      <div className="title">{place.placeName}</div>
                      {!place.isExternal && (
                        <BookmarkBtn
                          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(e, place.placeNo);
                          }}
                        >
                          {isBookmarked ? (
                            <BsBookmarkFill size={16} color="#C9A227" />
                          ) : (
                            <BsBookmark size={16} />
                          )}
                        </BookmarkBtn>
                      )}
                    </CardHeader>
                    <div className="address">{place.address || place.addr}</div>
                    {place.addrDetail && <div className="address">{place.addrDetail}</div>}
                    {!place.isExternal && (
                      <ReviewInfo>
                        {Number.isFinite(place.reviewCount) && (
                          <span>리뷰 {place.reviewCount}</span>
                        )}
                        {Number.isFinite(place.avgRating) && (
                          <span>
                            <FaStar size={11} /> {place.avgRating.toFixed(1)}
                          </span>
                        )}
                      </ReviewInfo>
                    )}
                    <CardFooter>
                      <ActionButtons>
                        <button
                          className="btn-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetOrigin(place);
                          }}
                        >
                          출발
                        </button>
                        <button
                          className="btn-end"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetDestination(place);
                          }}
                        >
                          도착
                        </button>
                      </ActionButtons>
                    </CardFooter>
                  </InfoWrapper>
                </Top10Card>
              );
            })}

          {hasMore && !filtersLoading && (
            <LoadingSpinner>스크롤을 내려 더보기</LoadingSpinner>
          )}
          {!hasMore && resultsToRender.length > 0 && !resultsLoading && (
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
