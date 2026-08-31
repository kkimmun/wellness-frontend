import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const PanelContainer = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  width: 540px; /* 360 * 1.5 */
  max-height: 70vh; /* 높이도 좀 더 여유있게 늘림 */
  background-color: ${theme.colors.bgWhite};
  border-radius: 24px; /* 16 * 1.5 */
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow: hidden;

  @media (max-width: 1024px) {
    top: 16px;
    left: 16px;
    width: 480px;
    max-height: 75vh;
  }
`;

export const SearchHeader = styled.div`
  padding: 30px 30px 18px 30px; /* 1.5배 */
  border-bottom: none;
`;

export const SearchBarBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.bgWhite};
  border: 3px solid ${theme.colors.borderLight}; /* 2px * 1.5 */
  border-radius: 18px; /* 1.5배 */
  padding: 9px 9px 9px 24px; /* 1.5배 */
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
`;

export const ResultListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px; /* 16 * 1.5 */
  display: flex;
  flex-direction: column;
  gap: 24px; /* 16 * 1.5 */
  
  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ListCard = styled.div`
  background: white;
  border: 2px solid ${theme.colors.borderLight};
  border-radius: 18px; /* 12 * 1.5 */
  padding: 24px; /* 16 * 1.5 */
  display: flex;
  flex-direction: column;
  gap: 12px; /* 8 * 1.5 */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PlaceTitle = styled.h3`
  font-size: 24px; /* 16 * 1.5 */
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px; /* 넉넉하게 */
`;

export const ReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px; /* 11 * 1.5 */
  
  .review-text {
    color: ${theme.colors.bgDim};
  }
  .rating-text {
    color: ${theme.colors.textPrimary};
    font-weight: 700;
  }
  svg {
    color: #FFB300;
    margin-bottom: 2px;
  }
`;

export const BookmarkBtn = styled.button`
  background: white;
  border: 2px solid ${theme.colors.borderLight}; /* 1px -> 2px */
  border-radius: 6px;
  width: 36px; /* 24 * 1.5 */
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    background: ${theme.colors.bgLight};
  }
`;

export const AddressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 16px; /* 11 * 1.5 */
  margin-top: 6px;

  .addr-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-width: 0;
  }
  .addr-label {
    color: ${theme.colors.bgDim};
    min-width: 50px; /* 35 * 1.5 */
  }
  .addr-value {
    color: ${theme.colors.textPrimary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 6px;
`;

export const PhoneText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px; /* 11 * 1.5 */
  color: ${theme.colors.textSecondary};
  
  svg {
    font-size: 14px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 6px;

  button {
    padding: 6px 15px; /* 4, 10 * 1.5 */
    border-radius: 6px;
    border: none;
    font-size: 16px; /* 11 * 1.5 */
    font-weight: 600;
    color: white;
    cursor: pointer;
  }
  .btn-start {
    background-color: #2196F3;
  }
  .btn-end {
    background-color: #FF7043;
  }
`;

export const LoadingSpinner = styled.div`
  padding: 30px;
  text-align: center;
  color: ${theme.colors.bgDim};
  font-size: 20px; /* 13 * 1.5 */
`;
