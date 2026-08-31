import React, { useState } from "react";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import {
  MapContainer,
  PlaceholderText,
  TopLeftControls,
  SearchBar,
  SearchInput,
  SearchButton,
  ToggleButton
} from "./MapPage.styles";

const MapPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      alert(`"${searchKeyword}" 검색을 실행합니다.`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleToggle = () => {
    // 사이드 패널 열기 로직 연동 예정
    alert("좌측 패널을 펼칩니다.");
  };

  return (
    <MapContainer>
      {/* 상단 좌측 컨트롤 (검색창 + 패널 토글 버튼) */}
      <TopLeftControls>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>
            <FaSearch size={14} />
          </SearchButton>
        </SearchBar>

        <ToggleButton onClick={handleToggle}>
          <FaChevronRight size={16} />
        </ToggleButton>
      </TopLeftControls>

      {/* 지도 연동 전 임시 배경 문구 */}
      <PlaceholderText>지도 영역 (Kakao Map API 연동 예정)</PlaceholderText>
    </MapContainer>
  );
};

export default MapPage;
