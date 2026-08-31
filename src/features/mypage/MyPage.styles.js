import styled from "styled-components";
import { theme } from "../../styles/theme";

export const ProfilePopoverCard = styled.div`
  width: 320px;
  background-color: ${theme.colors.bgWhite};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: ${theme.spacing.lg};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.md} 0;
  text-align: center;
  border-bottom: 1px solid ${theme.colors.borderLight};
  padding-bottom: ${theme.spacing.sm};
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: ${theme.spacing.sm};
`;

export const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #E2E8F0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: #94A3B8;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CameraButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: ${theme.colors.textSecondary};

  input {
    display: none;
  }
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  span {
    font-size: ${theme.fontSize.md};
    font-weight: 700;
    color: ${theme.colors.textPrimary};
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.textSecondary};
    padding: 4px;
    display: flex;
    align-items: center;
  }
`;

export const InfoList = styled.div`
  border-top: 1px dashed ${theme.colors.borderLight};
  border-bottom: 1px dashed ${theme.colors.borderLight};
  padding: ${theme.spacing.sm} 0;
  margin-bottom: ${theme.spacing.lg};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
`;

export const InfoLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

export const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.sm};
  font-weight: 600;
  color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.textSecondary)};
  cursor: pointer;
  margin-bottom: ${theme.spacing.sm};
  transition: all 0.2s;

  &:hover {
    background-color: ${theme.colors.bgLight};
  }
`;

export const ChangePasswordButton = styled.button`
  padding: 2px 8px;
  background-color: ${theme.colors.tagBg};
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  
  &:hover {
    background-color: #e2e6ea;
  }
`;
