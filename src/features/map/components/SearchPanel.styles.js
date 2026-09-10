import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { ListContainer } from "./Top10Panel.styles";

export const PanelContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: min(400px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  background: ${({ $hasResults }) => ($hasResults ? "white" : "transparent")};
  box-shadow: ${({ $hasResults }) => ($hasResults ? "2px 0 10px rgba(0, 0, 0, 0.1)" : "none")};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transform: ${({ $isVisible }) => ($isVisible ? "translateX(0)" : "translateX(-150%)")};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  pointer-events: none;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 65%;
  }
`;

export const SearchHeader = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 16px;
  box-sizing: border-box;
  background: ${({ $hasResults }) => ($hasResults ? "white" : "transparent")};
  border-bottom: 1px solid ${({ $hasResults }) => ($hasResults ? "#eee" : "transparent")};
  pointer-events: ${({ $hasResults }) => ($hasResults ? "auto" : "none")};
`;

export const CompactSearchBarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 5px 5px 12px;
  border: 2px solid #87ceeb;
  border-radius: 8px;
  background: white;
  box-shadow: ${({ $isFloating }) => ($isFloating ? "0 4px 16px rgba(0, 0, 0, 0.12)" : "none")};
  pointer-events: auto;
`;

export const CompactSearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
  &::placeholder { color: #a4b5be; }
`;

export const CompactSearchButton = styled.button`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 6px;
  background: #475569;
  color: white;
  cursor: pointer;
  &:hover { background: #334155; }
`;

export const ResultListContainer = styled(ListContainer)`
  min-height: 0;
  pointer-events: auto;
  overscroll-behavior: contain;
  @media (max-width: 768px) {
    margin-top: 64px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  .title { overflow-wrap: anywhere; }
`;

export const BookmarkBtn = styled.button`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #777;
  cursor: pointer;
  &:hover { background: #f1f3f5; }
`;

export const ReviewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  color: #777;
  font-size: 12px;
  svg { color: #ffb300; }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  button {
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    cursor: pointer;
  }
  .btn-start { background: #2196f3; }
  .btn-end { background: #ff7043; }
`;

export const LoadingSpinner = styled.div`
  padding: 20px;
  text-align: center;
  color: #777;
  font-size: 13px;
`;

export const SearchBarBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.bgWhite};
  border: none; /* 테두리 제거 */
  border-radius: 30px; /* 더 둥글게 (알약 형태) */
  padding: 9px 9px 9px 24px; /* 1.5배 */
  box-shadow: 0 4px 16px rgba(0,0,0,0.12); /* 항상 고정된 부드러운 그림자 */

  @media (max-width: 768px) {
    padding: 6px 6px 6px 16px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 21px; /* 14px * 1.5 */
  color: ${theme.colors.textPrimary};
  background: transparent;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SearchButton = styled.button`
  width: 54px; /* 36 * 1.5 */
  height: 54px;
  border-radius: 50%;
  background-color: #475569;
  color: ${theme.colors.bgWhite};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: #334155;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

