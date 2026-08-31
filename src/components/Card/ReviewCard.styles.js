import styled from "styled-components";

export const ReviewContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDivider};
  background-color: ${({ theme }) => theme.colors.bgWhite};
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;

  .date {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;

export const ReviewContent = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;

  /* isExpanded 상태에 따라 텍스트 잘림 처리 */
  ${({ $isExpanded }) =>
    !$isExpanded &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

export const ToggleTextButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
