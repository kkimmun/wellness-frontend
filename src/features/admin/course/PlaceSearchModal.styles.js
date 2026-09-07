import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { Table, Tr } from "../place/AdminPlace.styles";

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  & > div { flex: 1; min-width: 0; }
  & > button { flex-shrink: 0; white-space: nowrap; }
  input { padding-right: ${theme.spacing.xxl}; }
`;
export const Notice = styled.p`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primaryDisabled};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.sm};
  svg { flex-shrink: 0; }
`;
export const PlaceTable = styled(Table)`
  min-width: 630px;
  font-size: ${theme.fontSize.sm};
  td { white-space: normal; overflow-wrap: anywhere; }
  th:last-child, td:last-child { width: 80px; white-space: nowrap; }
  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 100%;
    table-layout: fixed;
    th:nth-child(1), td:nth-child(1) { width: 35%; }
    th:nth-child(2), td:nth-child(2) { width: 43%; }
    th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) { display: none; }
    th:nth-child(5), td:nth-child(5) { width: 22%; }
  }
`;
export const PlaceRow = styled(Tr)`
  background: ${({ $current }) => $current ? theme.colors.primaryDisabled : theme.colors.bgWhite};
`;
export const State = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  min-height: 200px;
  color: ${({ $error }) => $error ? theme.colors.error : theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  text-align: center;
`;
