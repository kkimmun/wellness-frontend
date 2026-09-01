import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.bgDim};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: ${theme.colors.bgWhite};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center; /* 아이콘과 텍스트 중앙 정렬을 위해 추가 */
  gap: ${theme.spacing.md};
  position: relative; /* 닫기 버튼 배치를 위해 추가 */
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e0e0e0;
  width: 24px;
  height: 24px;
  
  &:hover {
    background-color: #d0d0d0;
  }
`;

export const IconWrapper = styled.div`
  color: ${(props) => (props.$color === "danger" ? theme.colors.error : theme.colors.primary)};
  font-size: 32px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textPrimary};
  margin: 0;
  text-align: center;
`;

export const Message = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin: 0;
  line-height: ${theme.lineHeight.normal};
  word-break: keep-all;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  width: 100%;
  margin-top: ${theme.spacing.sm};
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  transition: opacity 0.2s;

  background-color: ${(props) => {
    switch (props.$variant) {
      case "danger":
        return "#ff6b6b";
      case "secondary":
        return "#888";
      case "primary":
      default:
        return theme.colors.primary;
    }
  }};

  &:hover {
    opacity: 0.9;
  }
`;
