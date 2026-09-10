import { useState, useEffect, useMemo } from "react";
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
  // 길찾기 기능 연동: 검색 결과를 출발지/도착지로 전달하는 콜백
  onSetOrigin,
  onSetDestination,
}) => {
  const [keyword, setKeyword] = useState("");
  const [lastSearchedKeyword, setLastSearchedKeyword] = useState("");
  const hasSearched = Boolean(lastSearchedKeyword.trim());
  // 목록과 지도 모두 같은 검색 결과를 사용한다. 페이지 추가는 지도 결과를 바꾸지 않는다.
  const matchingPlaces = useMemo(
    () => hasSearched ? filterDbPlaces(pins, lastSearchedKeyword) : pins,
    [pins, hasSearched, lastSearchedKeyword],
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
    <PanelContainer $isVisible={isVisible} $hasResults={hasSearched || showFilteredResults}>
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

      {(hasSearched || showFilteredResults) && (
        <ResultListContainer ref={listRef} onScroll={onScroll} role="region" aria-label="장소 목록" tabIndex={0}>
          {filtersLoading && <LoadingSpinner>장소를 불러오는 중입니다...</LoadingSpinner>}
          {!filtersLoading && resultsToRender.map((place) => {
            const isBookmarked = bookmarks[place.placeNo];
            return (
              <Top10Card key={place.placeNo} onClick={() => onPlaceSelect(place)}>
                <ImageWrapper>
                  <PlaceImage src={place.imageUrl || place.imgUrl} place={place} alt={place.placeName} />
                </ImageWrapper>
                <InfoWrapper style={{ minWidth: 0 }}>
                  <CardHeader>
                    <div className="title">{place.placeName}</div>
                    {!place.isExternal && (
                      <BookmarkBtn aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(e, place.placeNo); }}>
                        {isBookmarked ? <BsBookmarkFill size={16} color="#C9A227" /> : <BsBookmark size={16} />}
                      </BookmarkBtn>
                    )}
                  </CardHeader>
                  <div className="address">{place.address || place.addr}</div>
                  {place.addrDetail && <div className="address">{place.addrDetail}</div>}
                  {!place.isExternal && (
                    <ReviewInfo>
                      {Number.isFinite(place.reviewCount) && <span>리뷰 {place.reviewCount}</span>}
                      {Number.isFinite(place.avgRating) && <span><FaStar size={11} /> {place.avgRating.toFixed(1)}</span>}
                    </ReviewInfo>
                  )}
                  <CardFooter>
                    <ActionButtons>
                      <button className="btn-start" onClick={(e) => { e.stopPropagation(); onSetOrigin(place); }}>출발</button>
                      <button className="btn-end" onClick={(e) => { e.stopPropagation(); onSetDestination(place); }}>도착</button>
                    </ActionButtons>
                  </CardFooter>
                </InfoWrapper>
              </Top10Card>
            );
          })}

          {hasMore && !filtersLoading && (
            <LoadingSpinner>
              스크롤을 내려 더보기
            </LoadingSpinner>
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
