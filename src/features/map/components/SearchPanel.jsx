import React, { useState, useEffect, useRef, useCallback } from "react";
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
  LoadingSpinner
} from "./SearchPanel.styles";

const SearchPanel = ({ pins, onPlaceSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [displayedResults, setDisplayedResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarks, setBookmarks] = useState({}); // { placeNo: boolean }
  
  // 임시 로그인 상태 (실제 구현 시 전역 Auth 상태나 토큰 확인 로직으로 교체하세요)
  const isLoggedIn = false; // 기본값 false로 원복
  
  const observerTarget = useRef(null);
  const ITEMS_PER_PAGE = 3;

  const toggleBookmark = (e, placeNo) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      // 필요 시 navigate('/login') 등 라우팅 추가
      return;
    }
    
    setBookmarks(prev => ({
      ...prev,
      [placeNo]: !prev[placeNo]
    }));
  };

  const executeSearch = (searchKeyword, currentPage = 1) => {
    setIsSearching(true);
    
    setTimeout(() => {
      const filtered = pins.filter(p => 
        p.placeName.includes(searchKeyword) || p.addr.includes(searchKeyword)
      );
      
      const endIdx = currentPage * ITEMS_PER_PAGE;
      const paginated = filtered.slice(0, endIdx);
      
      setDisplayedResults(paginated);
      setHasMore(endIdx < filtered.length);
      setIsSearching(false);
    }, 500); 
  };

  useEffect(() => {
    if (pins && pins.length > 0) {
      executeSearch(keyword, 1);
    }
  }, [pins]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isSearching) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        executeSearch(keyword, nextPage);
        return nextPage;
      });
    }
  }, [hasMore, isSearching, keyword, pins]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    });
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [handleObserver]);

  const handleSearchClick = () => {
    setPage(1);
    executeSearch(keyword, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <PanelContainer>
      <SearchHeader>
        <SearchBarBox>
          <SearchInput
            type="text"
            placeholder="장소, 태그 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearchClick}>
            <FaSearch size={21} />
          </SearchButton>
        </SearchBarBox>
      </SearchHeader>

      <ResultListContainer>
        {displayedResults.map((place) => {
          const isBookmarked = bookmarks[place.placeNo];
          return (
            <ListCard key={place.placeNo} onClick={() => onPlaceSelect(place)}>
              <CardHeader>
                <TitleGroup>
                  <PlaceTitle>{place.placeName}</PlaceTitle>
                  <ReviewInfo>
                    <span className="review-text">리뷰 {place.reviewCount}</span>
                    <FaStar size={15} />
                    <span className="rating-text">{place.avgRating.toFixed(1)}</span>
                  </ReviewInfo>
                </TitleGroup>
                <BookmarkBtn onClick={(e) => toggleBookmark(e, place.placeNo)}>
                  {isBookmarked ? (
                    <BsBookmarkFill size={21} color="#C9A227" /> /* 테마의 gimpoGold 색상 활용 */
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
                  <button className="btn-start" onClick={(e) => { e.stopPropagation(); alert('출발'); }}>출발</button>
                  <button className="btn-end" onClick={(e) => { e.stopPropagation(); alert('도착'); }}>도착</button>
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
          <LoadingSpinner style={{ color: '#CCC' }}>마지막 결과입니다.</LoadingSpinner>
        )}
        {displayedResults.length === 0 && !isSearching && (
          <LoadingSpinner>검색 결과가 없습니다.</LoadingSpinner>
        )}
      </ResultListContainer>
    </PanelContainer>
  );
};

export default SearchPanel;
