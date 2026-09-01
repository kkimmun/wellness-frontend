import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const PanelContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0; /* 우측(right)에서 좌측(left)으로 변경 */
  width: 540px; /* 검색 패널(540px)과 동일한 폭으로 넓힘 */
  height: 100vh;
  background-color: ${theme.colors.bgWhite};
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1); /* 그림자 방향 변경 */
  z-index: 200;
  display: flex;
  flex-direction: column;
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-100%)")}; /* 음수 100%로 변경 */
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  font-family: 'Pretendard', sans-serif;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export const TopHeader = styled.div`
  flex-shrink: 0;
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .back-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    padding: 0;
  }

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #000;
  }
`;

export const ActionIcons = styled.div`
  display: flex;
  gap: 12px;

  .icon-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #81D4FA; /* 연한 파란색 */
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
  }
`;

export const RatingInfo = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 20px;
  font-size: 13px;
  color: #999;

  .rating-box {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #000;
    font-weight: 700;
    
    .star {
      color: #FFC107;
      font-size: 15px;
    }
  }
`;


export const ImageCarousel = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 250px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  user-select: none;
`;

export const CarouselItem = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -110px; /* height 220 / 2 */
  margin-left: -160px; /* width 320 / 2 */
  width: 320px;
  height: 220px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  background-size: cover;
  background-position: center;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  cursor: pointer;

  &.active {
    transform: translateX(0) scale(1);
    z-index: 3;
    opacity: 1;
  }

  &.prev {
    /* 여백을 두기 위해 기존보다 더 멀리(-150px) 보냄 */
    transform: translateX(-150px) scale(0.85);
    z-index: 2;
    opacity: 0.5;
  }

  &.next {
    transform: translateX(150px) scale(0.85);
    z-index: 2;
    opacity: 0.5;
  }

  &.hidden {
    transform: translateX(0) scale(0.5);
    z-index: 1;
    opacity: 0;
    pointer-events: none;
  }

  &:hover.prev, &:hover.next {
    opacity: 0.8;
  }
`;

export const TabMenu = styled.div`
  flex-shrink: 0;
  display: flex;
  border-bottom: 1px solid #EEE;
  margin-bottom: 24px;

  .tab {
    flex: 1;
    text-align: center;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 700;
    color: #999;
    cursor: pointer;
    position: relative;

    &.active {
      color: #2196F3;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background-color: #2196F3;
      }
    }
  }
`;

export const InfoSection = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: 14px;

  .label-group {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    width: 80px;
    color: #000;
    
    svg {
      color: #555;
    }
  }

  .value-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #333;

    .addr-line {
      display: flex;
      gap: 12px;
      
      .type {
        color: #666;
        min-width: 40px;
      }
    }
  }
`;

export const BottomArea = styled.div`
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  
  .tags {
    display: flex;
    gap: 10px;
    
    .tag {
      padding: 6px 14px;
      background: white;
      border: 1px solid #E0E0E0;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
  }

  .route-btn {
    background-color: #81D4FA;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;
