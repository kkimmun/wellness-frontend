import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const PageTitle = styled.h2`
  margin: 0 0 ${theme.spacing.lg};
  font-size: ${theme.fontSize.xl};
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex: 1;
  min-width: 280px;

  /* SearchInputWrapper가 남은 공간을 차지하도록 */
  & > div {
    flex: 1;
    max-width: 360px;
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const SelectedCount = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-right: ${theme.spacing.xs};
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.fontSize.md};
  white-space: nowrap;
`;

export const Th = styled.th`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  text-align: left;
  font-weight: 600;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  background-color: ${theme.colors.bgLight};
  border-bottom: 1px solid ${theme.colors.borderDivider};
`;

export const Td = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${({ $deleted }) =>
    $deleted ? theme.colors.textMuted : theme.colors.textPrimary};
  border-bottom: 1px solid ${theme.colors.borderDivider};
`;

export const Tr = styled.tr`
  &:hover td {
    background-color: ${theme.colors.bgLight};
  }
`;

export const CheckboxCell = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.borderDivider};
  width: 40px;
`;

export const DelBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.xs};
  font-weight: 700;
  background-color: ${({ $deleted }) =>
    $deleted ? theme.colors.bgLight : theme.colors.success};
  color: ${({ $deleted }) =>
    $deleted ? theme.colors.textMuted : theme.colors.white};
`;

export const RowActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

export const TruncateText = styled.span`
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
`;

export const StateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${theme.spacing.xl};
  font-size: ${theme.fontSize.md};
  color: ${({ $error }) =>
    $error ? theme.colors.error : theme.colors.textSecondary};
`;
