import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${theme.colors.bgDim};
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: flex-end; /* bottom sheet */
  z-index: 1000;
`;

export const SheetContainer = styled.div`
  position: relative;
  background-color: ${theme.colors.bgWhite};
  border-top-left-radius: ${theme.radius.lg};
  border-top-right-radius: ${theme.radius.lg};
  width: 100%;
  max-width: ${({ $size }) => ($size === "wide" ? "820px" : "100%")};
  max-height: 80vh;
  overflow-y: auto;
  padding: ${theme.spacing.lg};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
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
  &:hover { background-color: #d0d0d0; }
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
`;
