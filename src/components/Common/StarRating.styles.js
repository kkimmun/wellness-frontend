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
  
  fill: ${({ theme, $active }) =>
    $active ? theme.colors.warning : theme.colors.borderLight};

  &:hover {
    transform: scale(1.1);
  }
`;
