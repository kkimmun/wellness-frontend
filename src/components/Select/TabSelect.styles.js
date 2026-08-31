import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDivider};
`;

export const TabItem = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 16px 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textMuted};
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  /* 활성화 시 하단 굵은 밑줄 포인트 */
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : "transparent"};
    transition: background-color 0.2s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
