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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    top: auto;
    height: ${({ $mobileHeight, $hasResults }) =>
      $mobileHeight || ($hasResults ? "40vh" : "auto")};
    max-height: calc(100dvh - 56px);
    background-color: ${theme.colors.bgWhite};
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    padding: 8px 16px calc(12px + env(safe-area-inset-bottom, 12px));
    box-sizing: border-box;
    z-index: 250;
    pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
    visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
    transform: ${({ $isVisible }) =>
      $isVisible ? "translateY(0)" : "translateY(110%)"};
    transition: ${({ $isDragging }) =>
      $isDragging
        ? "none"
        : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s ease, visibility 0.3s ease"};
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

  @media (max-width: 768px) {
    border-radius: 30px;
    padding: 4px 6px 4px 16px;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    box-shadow: none;
    min-height: 44px;
    box-sizing: border-box;
  }
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

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 6px;
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #475569;
    background-color: rgba(0, 0, 0, 0.05);
  }
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

  @media (max-width: 768px) {
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SearchBarBox = CompactSearchBarBox;
export const SearchInput = CompactSearchInput;
export const SearchButton = CompactSearchButton;

export const DragHandle = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 6px 0 10px;
    flex-shrink: 0;
    cursor: grab;
    touch-action: none;

    &:active {
      cursor: grabbing;
    }

    &::after {
      content: "";
      width: 36px;
      height: 4px;
      background-color: #cbd5e1;
      border-radius: 2px;
    }
  }
`;

export const MobileFilterBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    width: 100%;
    flex-shrink: 0;
    padding: 6px 0 4px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    select {
      flex: 1;
      min-width: 0;
      padding: 5px 10px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: #f1f5f9;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;

      &:focus {
        border-color: #90caf9;
      }
      &:disabled {
        opacity: 0.6;
        cursor: wait;
      }
    }

    button {
      flex-shrink: 0;
      padding: 5px 10px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: #f1f5f9;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      white-space: nowrap;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }
  }
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

