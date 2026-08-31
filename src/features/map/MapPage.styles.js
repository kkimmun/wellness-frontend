import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MapContainer = styled.div`
  width: 100%;
  height: 100vh; /* 화면 전체를 덮도록 설정 */
  background-color: #E2E8F0; /* 카카오맵 렌더링 전 임시 배경색 */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const PlaceholderText = styled.div`
  font-size: ${theme.fontSize.xl};
  color: #94A3B8;
  font-weight: 600;
`;

export const TopLeftControls = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;

  @media (max-width: 1024px) {
    top: 16px;
    left: 16px;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.bgWhite};
  border-radius: 30px;
  padding: 4px 6px 4px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
  height: 48px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 240px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  background: transparent;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export const SearchButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #475569; /* 어두운 회색 (디자인 반영) */
  color: ${theme.colors.bgWhite};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #334155;
  }
`;

export const ToggleButton = styled.button`
  width: 40px;
  height: 40px;
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

  svg {
    /* 꺾쇠(>) 모양이 시각적으로 중앙에 오도록 미세 보정 */
    transform: translateX(1px);
  }

  &:hover {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textPrimary};
  }
`;
