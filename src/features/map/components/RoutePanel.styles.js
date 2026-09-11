import styled, { keyframes } from "styled-components";
import { theme } from "../../../styles/theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const RoutePanelContainer = styled.aside`
  position: absolute;
  inset: 0 auto 0 0;
  width: 540px;
  height: 100%;
  z-index: 220;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bgWhite};
  box-shadow: 4px 0 18px rgba(0, 0, 0, 0.14);
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-105%)"};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};

  /* ── 모바일: 좌측 풀패널 → 하단 바텀시트로 전환 ── */
  @media (max-width: 768px) {
    /* 위치를 좌측 슬라이드에서 하단 슬라이드로 완전히 재정의 */
    inset: auto 0 0 0;
    width: 100%;
    height: ${({ $mobileHeight }) => $mobileHeight ?? "40vh"};
    min-height: 140px;
    max-height: calc(100dvh - 56px);

    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.18);

    /* 좌측 슬라이드 대신 하단에서 위로 올라오는 애니메이션 */
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateY(0)" : "translateY(105%)"};

    /* 드래그 중에는 transition을 끄고 손가락을 놓을 때만 스냅 애니메이션 적용 */
    transition: ${({ $isDragging }) =>
      $isDragging
        ? "none"
        : "transform 0.3s ease-in-out, height 0.25s ease-out"};
  }
`;

/* 모바일 전용 드래그 핸들 바 */
export const DragHandle = styled.div`
  display: none; /* 데스크톱에서는 숨김 */

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 6px;
    cursor: grab;
    flex-shrink: 0;
    touch-action: none; /* 드래그 중 브라우저 스크롤 방지 */

    &::after {
      content: "";
      display: block;
      width: 44px;
      height: 5px;
      border-radius: 999px;
      background: ${theme.colors.borderLight};
    }

    &:active {
      cursor: grabbing;
    }
  }
`;

export const RouteHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${theme.colors.borderDivider};

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    h2 {
      font-size: 18px;
    }
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};

  &:hover {
    background: ${theme.colors.bgLight};
    color: ${theme.colors.textPrimary};
  }
`;

export const RouteBody = styled.div`
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 32px;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #d4d4d8;
  }

  @media (max-width: 768px) {
    padding: 12px 16px 20px;
  }
`;

export const PointFields = styled.div`
  padding: 16px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgLight};

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

export const PointRow = styled.div`
<<<<<<< HEAD
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 36px 36px;
=======
  display: flex;
  > label { flex: 0 0 58px; }
  > input { flex: 1; }
  > button { flex-shrink: 0; order: 2; }
>>>>>>> origin/main
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: ${({ $last }) =>
    $last ? "none" : `1px solid ${theme.colors.borderDivider}`};

  label {
    font-size: 13px;
    font-weight: 700;
    color: ${({ $accent }) => $accent || theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    grid-template-columns: 46px minmax(0, 1fr) 32px 32px;
    gap: 6px;
    padding: 6px 0;

    label {
      font-size: 12px;
    }
  }
`;

export const PointInputWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  background: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  padding: 2px 6px;

  &:focus-within {
    border-color: ${theme.colors.primaryHover};
  }
`;

export const PointInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 6px 4px;
  border: 0;
  outline: 0;
  color: ${theme.colors.textPrimary};
  background: transparent;
  font-size: 14px;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 5px 2px;
  }
`;

export const PointClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
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

export const LocationButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primaryHover};
  background: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};

  &:hover {
    border-color: ${theme.colors.primary};
    background: #eefaff;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`;

export const MapPickButton = styled(LocationButton)`
  color: ${({ $active }) => ($active ? "white" : theme.colors.primaryHover)};
  background: ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.bgWhite)};
  border-color: ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.borderLight)};
`;

export const ClearPointButton = styled(LocationButton)`
  && { order: 1; }
  color: ${theme.colors.textMuted};

  &:disabled {
    display: none;
  }
`;

export const WaypointSection = styled.section`
  margin-top: 12px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  strong {
    font-size: 14px;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }
`;

export const AddWaypointButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed ${theme.colors.primaryHover};
  border-radius: ${theme.radius.md};
  color: #2686b4;
  background: #f2fbff;
  font-size: 13px;
  font-weight: 700;

  &:disabled {
    border-color: ${theme.colors.borderLight};
    color: ${theme.colors.textMuted};
    background: ${theme.colors.bgLight};
    cursor: not-allowed;
  }
`;

export const WaypointRow = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .order {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-size: 12px;
    font-weight: 800;
  }

  input {
    width: 100%;
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: ${theme.radius.md};
    outline: none;

    &:focus {
      border-color: ${theme.colors.primaryHover};
    }
  }
`;

export const SearchResults = styled.div`
  margin: 12px 0 18px;
  max-height: 210px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgWhite};
`;

export const SearchResultButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  border-bottom: 1px solid ${theme.colors.borderDivider};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${theme.colors.bgLight};
  }

  strong {
    font-size: 14px;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }
`;

export const InlineState = styled.div`
  padding: 14px;
  text-align: center;
  color: ${({ $error }) =>
    $error ? theme.colors.error : theme.colors.textSecondary};
  font-size: 13px;
`;

export const TransportTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 20px 0 14px;
`;

export const TransportButton = styled.button`
  padding: 11px 5px;
  border-radius: ${theme.radius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 1px solid
    ${({ $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.borderLight};
  color: ${({ $active }) =>
    $active ? "#17688f" : theme.colors.textSecondary};
  background: ${({ $active }) => ($active ? "#e9f8ff" : theme.colors.bgWhite)};
  font-size: 12px;
  font-weight: 700;
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

export const OptionButton = styled.button`
  padding: 9px 6px;
  border-radius: ${theme.radius.pill};
  border: 1px solid
    ${({ $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.borderLight};
  background: ${({ $active }) => ($active ? theme.colors.primary : "white")};
  color: ${({ $active }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

export const SelectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
  }

  select {
    padding: 10px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: ${theme.radius.md};
    color: ${theme.colors.textPrimary};
    background: white;
  }
`;

export const FindRouteButton = styled.button`
  width: 100%;
  min-height: 46px;
  border-radius: ${theme.radius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 15px;
  font-weight: 800;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
  }

  &:disabled {
    background: ${theme.colors.primaryDisabled};
    cursor: not-allowed;
  }
`;

export const Spinner = styled.span`
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const RouteResultsSection = styled.section`
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${theme.colors.borderDivider};

  h3 {
    margin: 0 0 12px;
    font-size: 17px;
  }
`;

/* 대중교통 상세 안내: 카드 안에 단계별 경로를 배치할 수 있도록 카드와 선택 버튼을 분리한다. */
export const RouteCard = styled.article`
  width: 100%;
  margin-bottom: 10px;
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? theme.colors.primaryHover : theme.colors.borderLight};
  background: ${({ $selected }) => ($selected ? "#eefaff" : "white")};
  box-shadow: ${({ $selected }) =>
    $selected ? "0 4px 12px rgba(107, 187, 221, 0.18)" : "none"};

  .route-card-content {
    min-width: 0;
  }

  .summary {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .time {
    font-size: 21px;
    font-weight: 800;
    color: ${theme.colors.textPrimary};
  }

  .distance,
  .meta {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }

  .meta {
    margin-top: 8px;
    line-height: 1.6;
  }
`;

export const RouteCardButton = styled.button`
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  color: inherit;
  background: transparent;

  &:hover {
    background: ${({ $selected }) => ($selected ? "#e4f7ff" : theme.colors.bgLight)};
  }
`;

export const RouteExpandIcon = styled.span`
  flex: 0 0 auto;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
`;

export const EmptyState = styled.div`
  padding: 38px 18px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgLight};
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-size: 14px;

  svg {
    display: block;
    margin: 0 auto 10px;
    font-size: 34px;
  }
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
