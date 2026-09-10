import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

export const MapStatus = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  background:
    radial-gradient(circle at 20% 20%, rgba(135, 206, 235, 0.2), transparent 32%),
    ${theme.colors.bgLight};

  strong {
    color: ${theme.colors.textPrimary};
  }
`;

/* 대중교통 경로 색상: 지도 경로의 도보·버스·지하철 색을 설명하는 범례다. */
export const RouteLegend = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px 14px;
  max-width: 430px;
  padding: 10px 14px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.14);
  color: ${theme.colors.textSecondary};
  font-size: 11px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
`;

export const LegendLine = styled.i`
  width: 25px;
  height: 0;
  border-top: 4px ${({ $dashed }) => ($dashed ? "dashed" : "solid")}
    ${({ $color }) => $color};
  border-radius: ${theme.radius.pill};
`;

/* 길찾기 UX 개선: 타입·태그 토글처럼 패널 상태만 여닫는 원형 버튼이다. */
export const RouteReopenButton = styled.button`
  position: absolute;
  top: 50%;
  left: ${({ $isOpen }) => ($isOpen ? "552px" : "24px")};
  z-index: 230;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  padding: 0;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 50%;
  background: ${theme.colors.bgWhite};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  transform: translateY(-50%);
  transition: left 0.3s ease-in-out, background 0.2s ease-in-out;

  svg {
    color: ${theme.colors.textSecondary};
    transition: transform 0.25s ease-in-out;
  }

  &:hover {
    border-color: #81d4fa;
    background: #f0f9ff;
  }

  @media (max-width: 768px) {
    left: ${({ $isOpen }) => ($isOpen ? "calc(min(100%, 540px) - 30px)" : "16px")};
    width: 48px;
    height: 48px;
  }
`;

export const MapPickNotice = styled.div`
  position: absolute;
  top: 92px;
  left: 50%;
  z-index: 240;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${theme.radius.pill};
  background: rgba(33, 33, 33, 0.9);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 700;
  transform: translateX(-50%);

  button {
    border: 0;
    background: transparent;
    color: #81d4fa;
    font-weight: 700;
  }
`;

export const MapPinToolbar = styled.div`
  position: absolute;
  top: 110px;
  right: 24px;
  z-index: 220;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
`;

export const MapPinCreateButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 54px;
  padding: 6px 4px;
  border: 0;
  border-radius: ${theme.radius.md};
  background: ${({ $active, $color }) => ($active ? `${$color}18` : "transparent")};
  color: ${({ $color }) => $color};
  cursor: pointer;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    background: ${({ $color }) => $color};
    color: white;
    font-size: 13px;
    font-weight: 800;
    transform: rotate(-45deg);

    i {
      font-style: normal;
      transform: rotate(45deg);
    }
  }

  small {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
    font-weight: 700;
  }

  &:hover {
    background: ${({ $color }) => `${$color}18`};
  }
`;

export const FloatingTags = styled.div`
  position: absolute;
  top: 16px;
  left: 416px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  
  @media (max-width: 1024px) {
    top: 16px;
    left: 416px;
  }

  @media (max-width: 768px) {
    top: 88px;
    left: 12px;
    right: 12px;
    gap: 8px;
    > div { overflow-x: auto; }
    select { min-width: 140px; }
  }
`;

/* SearchPanel styles moved */

export const TagList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* 8 * 1.5 */
  overflow: hidden; 
  
  /* 부드러운 슬라이딩 및 페이드 효과 */
  max-width: ${({ $isOpen }) => ($isOpen ? "750px" : "0px")}; /* 500 * 1.5 */
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out;
  
  /* 스크롤바 숨기기 (모바일 대응) */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

/* DB 장소 필터 연동: 타입과 태그의 실제 DB 값을 선택하는 공통 셀렉트다. */
export const FilterSelect = styled.select`
  min-width: 170px;
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
  background-color: white;
  border: 2px solid
    ${({ $isActive }) =>
      $isActive ? theme.colors.primaryHover : theme.colors.primary};
  border-radius: 8px;
  padding: 0 12px;
  font-size: ${theme.fontSize.md};
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  background-color: ${({ $isActive }) => ($isActive ? "#eef9fd" : "white")};

  &:hover,
  &:focus {
    border-color: ${theme.colors.primaryHover};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

/* DB 장소 필터 연동: 선택한 타입·태그 조건을 해제하고 전체 핀으로 복원한다. */
export const FilterResetButton = styled.button`
  min-width: 88px;
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: 0 14px;
  border: 2px solid
    ${({ $isActive }) =>
      $isActive ? theme.colors.primaryHover : theme.colors.primary};
  border-radius: 8px;
  background: ${theme.colors.bgWhite};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  font-weight: 600;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primaryHover};
    color: ${theme.colors.textPrimary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const ToggleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: ${theme.colors.bgWhite};
  color: ${theme.colors.textSecondary};
  border: 2px solid ${theme.colors.primary};
  box-sizing: border-box;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  svg {
    transform: translateX(1.5px); /* 아이콘 살짝 조정 */
  }

  &:hover {
    background-color: #F5F5F5;
    color: ${theme.colors.textPrimary};
  }
`;

// 커스텀 오버레이 스타일 (마커 클릭 시 뜨는 카드)
export const OverlayCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 260px; /* 고정 너비로 변경하여 크기를 통일하고 간격을 확보 */
  position: relative;
  /* 마커 크기(24px)를 고려하여 꼬리가 핀을 정확히 가리키도록 여백 조정 */
  margin-bottom: 22px; 
  z-index: 100;

  /* 말풍선 꼬리 */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px 8px 0;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .action-buttons {
      display: flex;
      gap: 4px;
      
      button {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        color: white;
        border: none;
        cursor: pointer;
      }
      .btn-start {
        background-color: #2196F3; /* 파란색 출발 버튼 */
      }
      .btn-end {
        background-color: #FF5722; /* 주황색 도착 버튼 */
      }
      /* 계획 모드 연동: 장소 요약에서 경로찾기 대신 계획에 바로 추가한다. */
      .btn-plan {
        background-color: #46558A;
      }
    }
  }
  .badge {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textSecondary};
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }
  
  .sub-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: ${theme.colors.textSecondary};
    margin-top: -2px;

    .review-count {
      color: #9E9E9E;
    }
    .rating {
      font-weight: 700;
      color: ${theme.colors.textPrimary};
      display: flex;
      align-items: center;
      gap: 2px;
      
      .star {
        color: #FFC107;
      }
    }
    .detail-link {
      color: #7986CB;
      cursor: pointer;
      text-decoration: none;
      margin-left: auto;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .addr-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    margin-top: 6px;
    
    .addr-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-width: 0;
    }
    
    .addr-label {
      color: #9E9E9E;
      min-width: 35px;
      white-space: nowrap;
    }
    
    .addr-value {
      color: ${theme.colors.textPrimary};
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const OverlayTitle = styled.div`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

export const OverlapMarkerContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
`;

export const OverlapCountBadge = styled.span`
  position: absolute;
  top: -9px;
  right: -13px;
  z-index: 20;
  display: grid;
  min-width: 23px;
  height: 23px;
  padding: 0 6px;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background: #ef4444;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.3);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
`;

export const OverlapNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid #eef1f4;

  button {
    display: grid;
    width: 28px;
    height: 24px;
    padding: 0;
    place-items: center;
    border: 1px solid #dbe2e8;
    border-radius: 6px;
    background: #ffffff;
    color: #344054;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      border-color: #62c4e8;
      background: #eefaff;
      color: #1689b5;
    }
  }

  span {
    min-width: 42px;
    color: #667085;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
  }
`;

export const TagFilterPopover = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  width: min(360px, calc(100vw - 32px));
  max-height: 50vh;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  border: 2px solid ${theme.colors.primary};
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  header button { padding: 4px 8px; color: #666; }
  .tag-options { display: flex; flex-wrap: wrap; gap: 8px; }
`;

export const TagFilterChip = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.borderLight)};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#eef9fd" : "white")};
  color: #333;
  font-size: 14px;
  cursor: pointer;
  &:disabled { opacity: 0.65; cursor: wait; }
  &:focus-visible { outline: 2px solid ${theme.colors.primaryHover}; outline-offset: 2px; }
`;
