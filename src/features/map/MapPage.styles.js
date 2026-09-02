import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
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

export const FloatingTags = styled.div`
  position: absolute;
  top: 24px;
  left: 580px; /* SearchPanel(너비 540px + left 24px + 간격) 우측에 배치 */
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  
  @media (max-width: 1024px) {
    top: 16px;
    left: 350px;
  }
`;

/* SearchPanel styles moved */

export const TagList = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* 8 * 1.5 */
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

export const TagButton = styled.button`
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 30px; /* 20 * 1.5 */
  padding: 12px 24px; /* 8,16 * 1.5 */
  font-size: 20px; /* 13 * 1.5 (반올림) */
  font-weight: 700;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #F5F5F5;
  }
`;

export const ToggleButton = styled.button`
  width: 60px; /* 40 * 1.5 */
  height: 60px; /* 40 * 1.5 */
  border-radius: 50%;
  background-color: ${theme.colors.bgWhite};
  color: ${theme.colors.textSecondary};
  border: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
