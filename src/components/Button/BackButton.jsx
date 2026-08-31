import styled from "styled-components";
import { theme } from "../../styles/theme";

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs};
  color: ${theme.colors.textPrimary};
  background: none;
  border: none;
  cursor: pointer;
  /* 부드러운 애니메이션을 위한 transition 추가 */
  transition: opacity 0.2s ease;

  svg {
    /* SVG 자체에도 이동 애니메이션 설정 */
    transition: transform 0.2s ease-in-out;
  }

  &:hover:not(:disabled) {
    opacity: 0.7;
    svg {
      /* 마우스 올리면 왼쪽으로 4px 부드럽게 이동 */
      transform: translateX(-4px);
    }
  }

  &:active:not(:disabled) {
    svg {
      /* 클릭하는 순간 왼쪽으로 살짝 더(6px) 쏙 들어감 */
      transform: translateX(-6px);
    }
  }
`;

export const BackButton = ({ onClick, ...props }) => {
  return (
    <StyledBackButton
      onClick={onClick}
      type="button"
      aria-label="뒤로가기"
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    </StyledBackButton>
  );
};
