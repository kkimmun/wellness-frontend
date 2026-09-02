import styled, { css, keyframes } from "styled-components";
import { theme } from "../../../styles/theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PanelContainer = styled.aside`
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 240;
  width: 460px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bgWhite};
  box-shadow: 4px 0 22px rgba(15, 23, 42, 0.16);

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const Header = styled.header`
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.borderDivider};
`;

export const PanelTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.xl};

  svg {
    color: ${theme.colors.primaryHover};
  }
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: inline-grid;
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

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg};
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.borderLight};
    border-radius: ${theme.radius.pill};
  }
`;

export const Section = styled.section`
  margin-bottom: ${theme.spacing.md};
`;

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};

  strong {
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSize.md};
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.xs};
    text-align: right;
  }
`;

export const LocationField = styled.div`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 34px 34px;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 7px 8px 7px 12px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bgLight};

  > svg {
    color: ${theme.colors.primaryHover};
  }

  input {
    width: 100%;
    min-width: 0;
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
    color: ${theme.colors.textPrimary};
    background: transparent;
    border: 0;
    outline: 0;
    font-size: ${theme.fontSize.md};

    &::placeholder {
      color: ${theme.colors.textMuted};
    }
  }
`;

export const LocationButton = styled(IconButton)`
  color: ${theme.colors.primaryHover};
  background: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
`;

export const SearchResults = styled.div`
  max-height: 176px;
  margin-top: ${theme.spacing.sm};
  overflow-y: auto;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
`;

export const SearchResultButton = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid ${theme.colors.borderDivider};

  &:last-child {
    border-bottom: 0;
  }

  &:hover,
  &:focus-visible {
    background: ${theme.colors.bgLight};
  }

  strong {
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSize.md};
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.xs};
  }
`;

export const CheckList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.bgWhite};
`;

const checkControl = css`
  position: relative;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .check {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    color: transparent;
    background: #8b929d;
    border-radius: 4px;

    svg {
      width: 12px;
      height: 12px;
      stroke-width: 3;
    }
  }

  input:checked + .check {
    color: ${theme.colors.white};
    background: ${theme.colors.primary};
  }

  &:focus-within {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: -2px;
  }
`;

export const ChoiceRow = styled.label`
  ${checkControl}
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 9px 12px;
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.textMuted : theme.colors.textPrimary};
  background: ${({ $disabled }) =>
    $disabled ? theme.colors.bgLight : theme.colors.bgWhite};
  border-bottom: 1px solid ${theme.colors.borderDivider};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-size: ${theme.fontSize.sm};

  &:last-child {
    border-bottom: 0;
  }

  &:has(input:checked) {
    background: #f1f8ff;
  }

  small {
    margin-left: auto;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.xs};
  }
`;

export const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
`;

export const TagOption = styled.label`
  ${checkControl}
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 9px 12px;
  color: ${({ $selected }) =>
    $selected ? theme.colors.textPrimary : theme.colors.textSecondary};
  background: ${({ $selected }) => ($selected ? "#f1f8ff" : "white")};
  border-right: 1px solid ${theme.colors.borderDivider};
  border-bottom: 1px solid ${theme.colors.borderDivider};
  cursor: pointer;
  font-size: ${theme.fontSize.sm};

  &:nth-child(2n) {
    border-right: 0;
  }

  &:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
`;

export const SelectField = styled.div`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 0 12px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};

  svg {
    color: ${theme.colors.primaryHover};
  }

  select {
    width: 100%;
    padding: 11px 0;
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.bgWhite};
    border: 0;
    outline: 0;
    font-size: ${theme.fontSize.sm};
  }
`;

export const RecommendationButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.md} 0 ${theme.spacing.sm};

  button {
    flex: 0 0 auto;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.xs};
  }
`;

export const FieldMessage = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: ${({ $error, $success }) =>
    $error
      ? theme.colors.error
      : $success
        ? theme.colors.success
        : theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  line-height: 1.45;
`;

export const InlineSpinner = styled.span`
  width: 15px;
  height: 15px;
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: ${theme.colors.white};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

export const CourseResult = styled.article`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  color: ${theme.colors.textPrimary};
  background: #f1f8ff;
  border: 1px solid ${theme.colors.primaryDisabled};
  border-radius: ${theme.radius.lg};

  strong {
    font-size: ${theme.fontSize.md};
  }

  p {
    margin: ${theme.spacing.sm} 0 0;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.sm};
    line-height: 1.65;
    white-space: pre-line;
  }
`;

export const ActionArea = styled.footer`
  padding: 12px ${theme.spacing.lg} ${theme.spacing.md};
  background: ${theme.colors.bgWhite};
  border-top: 1px solid ${theme.colors.borderDivider};
`;
