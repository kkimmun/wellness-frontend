import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { PillButton } from "../../../components/Button/Button.styles";

export const CourseCard = styled.aside`
  position: absolute;
  z-index: 240;
  top: ${theme.spacing.lg};
  bottom: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgWhite};
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.16);

  h1 { margin: 0; color: ${theme.colors.primaryHover}; font-size: ${theme.fontSize.xl}; overflow-wrap: anywhere; }
  @media (max-width: ${theme.breakpoints.sm}) {
    top: auto;
    bottom: ${theme.spacing.md};
    left: ${theme.spacing.md};
    width: calc(100% - 32px);
    max-height: 58%;
    padding: ${theme.spacing.md};
  }
`;

export const BackRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

export const CourseMetrics = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

export const Description = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const StopList = styled.ol`
  display: grid;
  gap: ${theme.spacing.sm};
  li { position: relative; display: grid; grid-template-columns: 42px 1fr; align-items: start; gap: ${theme.spacing.sm}; min-height: 34px; }
  li:not(:last-child)::after { content: ""; position: absolute; left: 20px; top: 28px; bottom: -8px; border-left: 1px solid ${theme.colors.borderLight}; }
  .label { display: grid; min-height: 24px; place-items: center; border-radius: ${theme.radius.sm}; color: ${theme.colors.white}; background: ${theme.colors.primaryHover}; font-size: ${theme.fontSize.xs}; }
  .waypoint { display: grid; height: 24px; place-items: center; color: ${theme.colors.primaryHover}; }
  strong { display: block; padding-top: 2px; font-size: ${theme.fontSize.md}; font-weight: 500; overflow-wrap: anywhere; }
  small { color: ${theme.colors.textSecondary}; font-size: ${theme.fontSize.xs}; }
`;

export const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 70px;
  gap: ${theme.spacing.xs};
  > :first-child { grid-row: span 2; }
  > :only-child { grid-column: span 2; }
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const PhotoPlaceholder = styled.div`
  display: grid;
  min-height: 70px;
  padding: ${theme.spacing.sm};
  place-items: center;
  background: ${theme.colors.bgLight};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.xs};
  text-align: center;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

export const ReviewButton = styled(PillButton)`
  width: 100%;
  margin-top: auto;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  background: #6b7280;
  min-height: 38px;
`;

export const Feedback = styled.p`
  margin: 0;
  padding: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.bgLight};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.sm};
  overflow-wrap: anywhere;
`;

export const ReviewPanel = styled.aside`
  position: absolute;
  z-index: 260;
  top: ${theme.spacing.lg};
  left: 360px;
  width: ${({ $expanded }) => $expanded ? "min(460px, calc(100% - 376px))" : "min(250px, calc(100% - 376px))"};
  max-height: calc(100% - 48px);
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgWhite};
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);

  header { display: flex; align-items: center; justify-content: space-between; gap: ${theme.spacing.sm}; padding: ${theme.spacing.md}; }
  h2 { margin: 0; font-size: ${theme.fontSize.md}; overflow-wrap: anywhere; }
  header button { display: grid; width: 32px; height: 32px; flex-shrink: 0; place-items: center; }
  > p { margin: 0 ${theme.spacing.md} ${theme.spacing.md}; }

  @media (max-width: ${theme.breakpoints.md}) {
    left: auto;
    right: ${theme.spacing.md};
    width: ${({ $expanded }) => $expanded ? "min(460px, calc(100% - 32px))" : "min(250px, calc(100% - 32px))"};
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    top: ${theme.spacing.md};
    max-height: calc(100% - 32px);
  }
`;

export const PlaceChoice = styled.button`
  display: block;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  min-height: 42px;
  border-top: 1px solid ${theme.colors.borderDivider};
  text-align: left;
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  overflow-wrap: anywhere;
  &:hover:not(:disabled), &:focus-visible { color: ${theme.colors.white}; background: ${theme.colors.primaryHover}; }
  &:disabled { color: ${theme.colors.textSecondary}; cursor: default; }
  small { display: block; font-size: ${theme.fontSize.xs}; }
`;

export const ChoiceActions = styled.div`
  display: grid;
  gap: ${theme.spacing.sm};
`;
