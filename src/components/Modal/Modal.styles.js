import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 설계서 지정 딤 처리 */
  background-color: ${theme.colors.bgDim};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: ${theme.colors.bgWhite};
  border-radius: ${theme.radius.lg}; /* 12px 둥글기 적용 */
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
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
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;
