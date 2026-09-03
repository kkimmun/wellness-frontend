import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { StatusBadge } from "../../../components/Badge/Badge.styles";
import { SearchForm, Table, StateBox } from "../place/AdminPlace.styles";

export const CourseSearchForm = styled(SearchForm)`
  min-width: 0;
  flex-wrap: wrap;
  & > div { min-width: 140px; }
  input { padding-right: ${theme.spacing.xxl}; }
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-basis: 100%;
    & > div { max-width: none; }
  }
`;

export const CourseTable = styled(Table)`
  min-width: 900px;
  td { height: 44px; }
  tbody tr:last-child td { border-bottom: 0; }
  input[type="checkbox"] { accent-color: ${theme.colors.primary}; }
`;

export const StatusButton = styled(StatusBadge).attrs({ as: "button", theme })`
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.textSecondary};
  white-space: nowrap;
  &:hover:not(:disabled) { filter: brightness(0.95); }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

export const Feedback = styled(StateBox)`
  flex-direction: column;
  gap: ${theme.spacing.md};
  text-align: center;
  p { margin: 0; }
`;

export const Page = styled.section`
  min-width: 0;
  button:disabled { cursor: not-allowed; }
  button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;
