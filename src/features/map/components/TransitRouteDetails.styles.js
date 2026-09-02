import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const TransitDetails = styled.div`
  padding: 0 16px 16px;
  border-top: 1px solid ${theme.colors.borderDivider};
  background: ${theme.colors.bgWhite};
`;

export const DetailStatus = styled.p`
  margin: 12px 0 0;
  padding: 9px 10px;
  border-radius: ${theme.radius.md};
  color: ${({ $error }) =>
    $error ? theme.colors.error : theme.colors.textSecondary};
  background: ${({ $error }) => ($error ? "#fff3f3" : theme.colors.bgLight)};
  font-size: 12px;
  line-height: 1.5;
`;

export const TransitTimeline = styled.ol`
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
`;

export const TransitStep = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
  padding-bottom: 18px;

  &:not(:last-child)::before {
    content: "";
    position: absolute;
    top: 28px;
    bottom: 0;
    left: 14px;
    width: 2px;
    background: ${theme.colors.borderLight};
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const StepIcon = styled.span`
  position: relative;
  z-index: 1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  /* 대중교통 경로 색상: 지도 선과 동일한 분류 색상을 단계 아이콘에도 적용한다. */
  background: ${({ $color }) => $color || "#6B7280"};
  font-size: 13px;
`;

export const StepBody = styled.div`
  min-width: 0;
  padding-top: 3px;

  h4 {
    margin: 0;
    color: ${theme.colors.textPrimary};
    font-size: 14px;
    line-height: 1.4;
  }

  p {
    margin: 5px 0 0;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  strong {
    color: ${theme.colors.textPrimary};
  }
`;

export const StopDetails = styled.details`
  margin-top: 7px;
  color: ${theme.colors.textSecondary};
  font-size: 12px;

  summary {
    cursor: pointer;
    color: #267da5;
    font-weight: 700;
  }

  ol {
    margin: 8px 0 0;
    padding-left: 19px;
  }

  li {
    margin: 4px 0;
    line-height: 1.45;
  }
`;
