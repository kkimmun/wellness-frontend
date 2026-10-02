import styled from "styled-components";

export const TagBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.tagBg};
  color: ${({ theme }) => theme.colors.tagText};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.fontSize.sm};
  padding: 4px 12px;
  white-space: nowrap; 
  display: inline-block;
`;

export const CategoryBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  padding: 4px 8px;
  font-weight: 600;
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

export const StatusBadge = styled.span`
  
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.success : theme.colors.bgLight};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  padding: 4px 8px;
  font-weight: 700;
  display: inline-block;
`;
