import styled from "styled-components";

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StarIcon = styled.svg`
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform 0.1s ease;
  /* 활성화 여부에 따라 Warning(주황색) 또는 Muted(회색) 처리 */
  fill: ${({ theme, $active }) =>
    $active ? theme.colors.warning : theme.colors.borderLight};

  &:hover {
    transform: scale(1.1);
  }
`;
