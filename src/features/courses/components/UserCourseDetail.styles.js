import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { PillButton } from "../../../components/Button/Button.styles";

export const CourseCard = styled.aside`
  position: absolute;
  z-index: 240;
  top: ${theme.spacing.lg};
  bottom: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  width: min(380px, calc(100% - 48px));
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
    max-height: 65%;
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
  margin: 0;
  padding: 0;
  list-style: none;
  > li {
    position: relative;
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr);
    align-items: start;
    column-gap: ${theme.spacing.sm};
  }
  > li:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 17px;
    top: 30px;
    bottom: 0;
    border-left: 1px dashed ${theme.colors.borderLight};
  }
  .label {
    display: grid;
    min-height: 28px;
    place-items: center;
    border-radius: ${theme.radius.sm};
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.primaryDisabled};
    font-size: ${theme.fontSize.xs};
    font-weight: 700;
  }
`;

export const PhotoPlaceholder = styled.div`
  display: grid;
  min-height: 140px;
  align-content: center;
  gap: 8px;
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
  left: 420px;
  width: ${({ $expanded }) => $expanded ? "min(460px, calc(100% - 436px))" : "min(250px, calc(100% - 436px))"};
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

export const DestinationHero = styled.figure`
  flex-shrink: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  figcaption {
    display: flex;
    align-items: baseline;
    gap: ${theme.spacing.sm};
    padding: 12px;
    background: ${theme.colors.bgLight};
    font-size: ${theme.fontSize.md};
    overflow-wrap: anywhere;
  }
  figcaption span { flex-shrink: 0; color: ${theme.colors.textSecondary}; font-size: ${theme.fontSize.xs}; }
`;

export const PlacePhoto = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bgLight};
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  ${PhotoPlaceholder} { width: 100%; height: 100%; min-height: 0; }
`;

export const ItineraryHeader = styled.div`
  border-top: 1px solid ${theme.colors.borderDivider};
  padding-top: ${theme.spacing.md};
  h2 { margin: 0; font-size: ${theme.fontSize.lg}; }
  p { margin: 6px 0 0; color: ${theme.colors.textSecondary}; font-size: ${theme.fontSize.sm}; line-height: 1.5; }
`;

export const StopContent = styled.div`
  display: grid;
  min-width: 0;
  gap: ${theme.spacing.sm};
  padding: 4px 0 12px;
  h3 { margin: 0; font-size: ${theme.fontSize.md}; overflow-wrap: anywhere; }
  > small { color: ${theme.colors.textSecondary}; font-size: ${theme.fontSize.xs}; }
`;

export const StopAddress = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.xs};
  line-height: 1.5;
  overflow-wrap: anywhere;
  svg { flex-shrink: 0; margin-top: 2px; }
`;

export const SegmentArea = styled.div`
  grid-column: 2;
  display: grid;
  gap: 6px;
  margin: 0 0 20px;
  .segment-label {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.xs};
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;

export const SegmentButton = styled.button`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  min-height: 44px;
  padding: 10px;
  border: 1px solid ${({ $selected }) => $selected ? theme.colors.primaryHover : theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textSecondary};
  text-align: left;
  font-size: ${theme.fontSize.sm};
  background: ${({ $selected }) => $selected ? theme.colors.primaryDisabled : theme.colors.bgLight};
  &:hover, &:focus-visible { border-color: ${theme.colors.primaryHover}; background: ${theme.colors.primaryDisabled}; }
  &:focus-visible { outline: 2px solid ${theme.colors.primaryHover}; outline-offset: 2px; }
  svg { flex-shrink: 0; }
  > svg:last-child { margin-left: auto; }
`;

export const RestaurantResults = styled.div`
  scroll-margin-top: 12px;
  display: grid;
  gap: ${theme.spacing.sm};
  padding-top: ${theme.spacing.sm};
  min-width: 0;
`;

export const RestaurantSummary = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.sm};
  font-weight: 600;
  line-height: 1.6;
  color: ${theme.colors.textPrimary};
`;

export const RestaurantDistanceNote = styled.p`
  margin: 0;
  font-size: ${theme.fontSize.xs};
  line-height: 1.5;
  color: ${theme.colors.textSecondary};
`;

export const RestaurantList = styled.ul`
  display: grid;
  gap: ${theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const RestaurantCard = styled.button`
  width: 100%;
  text-align: left;
  color: inherit;
  cursor: pointer;
  &:hover { border-color: ${theme.colors.primaryHover}; }
  &:focus-visible { outline: 2px solid ${theme.colors.primaryHover}; outline-offset: 2px; }
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: ${theme.spacing.sm};
  padding: 10px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bgWhite};
`;

export const RestaurantPhoto = styled.div`
  height: 80px;
  overflow: hidden;
  border-radius: ${theme.radius.sm};
  img { width: 100%; height: 100%; object-fit: cover; }
  ${PhotoPlaceholder} { min-height: 0; height: 100%; font-size: 10px; padding: 4px; }
`;

export const RestaurantInfo = styled.div`
  display: grid;
  gap: 6px;
  align-content: start;
  min-width: 0;
  h4 { margin: 0; font-size: ${theme.fontSize.md}; overflow-wrap: anywhere; }
`;

export const RestaurantDistance = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
  font-weight: 600;
`;

export const RestaurantDescription = styled(Description)`
  grid-column: 1 / -1;
  color: ${theme.colors.textSecondary};
`;

export const RestaurantLink = styled.span`
  color: ${theme.colors.primaryHover};
  font-size: ${theme.fontSize.xs};
  font-weight: 600;
`;
