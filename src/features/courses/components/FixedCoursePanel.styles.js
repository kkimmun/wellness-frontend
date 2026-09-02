import styled, { css, keyframes } from "styled-components";
import { theme } from "../../../styles/theme";

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

const thumbnailTones = [
  "linear-gradient(145deg, #536f4a 0%, #c0aa72 52%, #53635d 100%)",
  "linear-gradient(145deg, #244d36 0%, #7e9b65 48%, #d4bd7a 100%)",
  "linear-gradient(145deg, #61523b 0%, #b39c67 48%, #465847 100%)",
  "linear-gradient(145deg, #7a5238 0%, #d3a06b 50%, #61715c 100%)",
  "linear-gradient(145deg, #334b42 0%, #819d7c 50%, #d1c39e 100%)",
];

export const PanelContainer = styled.section`
  position: absolute;
  top: 112px;
  left: ${theme.spacing.lg};
  z-index: 11;
  width: 540px;
  max-height: calc(100% - 136px);
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.lg};
  overflow: hidden;
  background: ${theme.colors.bgWhite};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.16);

  @media (max-width: ${theme.breakpoints.md}) {
    top: 104px;
    left: ${theme.spacing.md};
    width: min(480px, calc(100% - 32px));
    max-height: calc(100% - 120px);
    padding: ${theme.spacing.md};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

export const HeaderText = styled.div`
  min-width: 0;

  h2 {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin: 0;
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSize.xl};
    line-height: 1.35;

    svg {
      color: ${theme.colors.primaryHover};
      flex-shrink: 0;
    }
  }

  p {
    margin: ${theme.spacing.sm} 0 0;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.sm};
    line-height: 1.55;
  }
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 0;
  color: ${theme.colors.textSecondary};
  border-radius: 50%;

  &:hover,
  &:focus-visible {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.bgLight};
  }
`;

export const CourseList = styled.ol`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  margin: 0;
  padding: 0 ${theme.spacing.xs} 0 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderLight};
    border-radius: ${theme.radius.pill};
  }
`;

export const CourseCard = styled.button`
  width: 100%;
  min-height: 112px;
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: ${theme.spacing.md};
  padding: 12px;
  text-align: left;
  background: ${theme.colors.bgWhite};
  border: 1px solid
    ${({ $selected }) =>
      $selected ? theme.colors.primaryHover : theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-visible {
    border-color: ${theme.colors.primaryHover};
    box-shadow: 0 5px 16px rgba(107, 187, 221, 0.16);
    outline: none;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      box-shadow: 0 5px 16px rgba(107, 187, 221, 0.16);
    `}

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 80px minmax(0, 1fr);
    gap: 12px;
  }
`;

export const CourseThumbnail = styled.div`
  position: relative;
  min-height: 86px;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  background: ${({ $tone }) => thumbnailTones[$tone]};
  border-radius: ${theme.radius.md};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 35%, rgba(15, 23, 42, 0.35)),
      repeating-linear-gradient(
        118deg,
        transparent 0 15px,
        rgba(255, 255, 255, 0.08) 16px 17px
      );
  }

  > svg {
    width: 30px;
    height: 30px;
    z-index: 1;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.28));
  }
`;

export const NumberBadge = styled.span`
  position: absolute;
  top: ${theme.spacing.xs};
  left: ${theme.spacing.xs};
  z-index: 2;
  min-width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  padding: 0 6px;
  color: ${theme.colors.white};
  background: ${theme.colors.primaryHover};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.xs};
  font-weight: 700;
`;

export const CourseInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const CourseName = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.md};
  line-height: 1.4;
`;

export const CourseDescription = styled.p`
  display: -webkit-box;
  margin: ${theme.spacing.xs} 0 ${theme.spacing.sm};
  overflow: hidden;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.xs};
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const CourseMeta = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-top: auto;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.xs};

  > span {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    flex-shrink: 0;
    color: ${theme.colors.primaryHover};
    font-weight: 600;
  }
`;

export const RouteInfo = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  svg {
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const LoadingCard = styled.li`
  height: 112px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    ${theme.colors.bgLight} 25%,
    ${theme.colors.borderDivider} 50%,
    ${theme.colors.bgLight} 75%
  );
  background-size: 200% 100%;
  border-radius: ${theme.radius.lg};
  animation: ${shimmer} 1.2s infinite linear;
`;

export const ErrorState = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  text-align: center;

  strong {
    color: ${theme.colors.textPrimary};
  }
`;

export const EmptyState = styled(ErrorState)`
  svg {
    width: 32px;
    height: 32px;
    color: ${theme.colors.textMuted};
  }
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.white};
  background: ${theme.colors.primaryHover};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.sm};
`;

export const InfiniteScrollFooter = styled.li`
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};

  ${RetryButton} {
    margin-top: ${theme.spacing.xs};
  }
`;
