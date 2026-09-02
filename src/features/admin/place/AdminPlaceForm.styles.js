import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const Form = styled.form`
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  label {
    font-size: ${theme.fontSize.sm};
    font-weight: 600;
    color: ${theme.colors.textSecondary};
  }
`;

export const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.md};

  & > div {
    flex: 1;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const FileInput = styled.input`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
`;

export const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

export const PreviewImage = styled.img`
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.borderLight};
`;

export const PreviewCard = styled.div`
  width: 96px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const OrderBadge = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSize.xs};
  font-weight: 700;
  color: ${theme.colors.white};
  background-color: ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
`;

export const PreviewThumbWrap = styled.div`
  position: relative;
`;

export const PreviewControls = styled.div`
  display: flex;
  gap: 2px;

  button {
    flex: 1;
    padding: 2px 0;
    font-size: ${theme.fontSize.xs};
    color: ${theme.colors.textSecondary};
    background-color: ${theme.colors.bgWhite};
    border: 1px solid ${theme.colors.borderLight};
    border-radius: ${theme.radius.sm};
  }

  button:hover:not(:disabled) {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textPrimary};
  }

  button:disabled {
    color: ${theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const CurrentImageNote = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`;

export const CurrentImageLabel = styled.p`
  margin: ${theme.spacing.sm} 0 ${theme.spacing.xs};
  font-size: ${theme.fontSize.sm};
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`;

export const FormError = styled.p`
  margin: 0;
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.sm};
`;

export const FieldError = styled.span`
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const StateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${theme.spacing.xl};
  font-size: ${theme.fontSize.md};
  color: ${({ $error }) =>
    $error ? theme.colors.error : theme.colors.textSecondary};
`;
