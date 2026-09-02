import styled from "styled-components";
import { theme } from "../../styles/theme";

/**
 * DropdownSelect (필터링용 셀렉트 박스)
 *
 * 기본 브라우저 화살표를 숨기고 커스텀 화살표(SVG data URI)를 적용한다.
 * 관리자 목록 화면의 검색 대상(target) 선택 등에 사용한다.
 */
export const DropdownSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  padding: ${theme.spacing.sm} ${theme.spacing.xl} ${theme.spacing.sm}
    ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.md} center;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textMuted};
    cursor: not-allowed;
  }
`;
