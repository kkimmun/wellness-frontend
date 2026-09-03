import styled from "styled-components";

export const PanelContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 100%;
  background: white;
  z-index: 20;
  display: flex;
  flex-direction: column;
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
`;

export const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 5px;
    &:hover {
      color: #333;
    }
  }
`;

export const ListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
  padding: 10px;
  gap: 15px;

  /* 스크롤바 숨기기 (한번에 다 띄운다는 요청 반영하되, 혹시 넘치면 휠은 되도록) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const Top10Card = styled.div`
  display: flex;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .rank-badge {
    position: absolute;
    top: 0;
    left: 0;
    background: #81D4FA;
    color: white;
    font-weight: bold;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    font-size: 13px;
  }
`;

export const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .address {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }

  .phone {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 5px;
  }

  .stats {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
    margin-top: -10px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 3px;
      color: #777;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: auto;

    .tag {
      background: #f1f3f5;
      padding: 3px 6px;
      border-radius: 12px;
      font-size: 11px;
      color: #555;
    }
  }
`;
