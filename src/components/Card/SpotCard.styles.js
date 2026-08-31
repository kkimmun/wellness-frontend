import styled from "styled-components";

export const SpotCardContainer = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgWhite};
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const SpotImage = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${({ theme }) => theme.colors.bgLight};
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
`;

export const SpotInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SpotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const SpotTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  word-break: keep-all;
`;

export const SpotRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;
