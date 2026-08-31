import styled from "styled-components";

/* 1. TagBadge (해시태그용 둥근 칩) */
export const TagBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.tagBg};
  color: ${({ theme }) => theme.colors.tagText};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.fontSize.sm};
  padding: 4px 12px;
  white-space: nowrap; /* 자동 줄바꿈 방지 */
  display: inline-block;
`;

/* 2. CategoryBadge (코스 성격 분류 배지) */
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

/* 3. StatusBadge (관리자 테이블용 활성/비활성 배지) */
export const StatusBadge = styled.span`
  /* $active 속성에 따라 배경 및 글자색 조건부 렌더링 */
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
