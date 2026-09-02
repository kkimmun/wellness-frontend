import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const InfoCard = styled.div`
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.bgWhite};
`;

export const InfoRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.borderDivider};
  font-size: ${theme.fontSize.md};

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  flex-shrink: 0;
  width: 120px;
  color: ${theme.colors.textSecondary};
  font-weight: 600;
`;

export const InfoValue = styled.span`
  color: ${theme.colors.textPrimary};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

export const ThumbImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.borderLight};
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
