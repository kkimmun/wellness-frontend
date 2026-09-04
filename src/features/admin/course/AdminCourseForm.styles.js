import styled from "styled-components";
import { theme } from "../../../styles/theme";
import { BaseInput } from "../../../components/Input/Input.styles";
import { FormHeader } from "../place/AdminPlaceForm.styles";

export const Header = styled(FormHeader)`
  flex-wrap: wrap;
  h2 { word-break: keep-all; }
  button { flex-shrink: 0; white-space: nowrap; }
`;

export const CourseForm = styled.form`
  max-width: 1080px;
  padding: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
  @media (max-width: ${theme.breakpoints.sm}) { padding: ${theme.spacing.md}; }
`;
export const SectionTitle = styled.h3`
  margin: 0 0 ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.borderDivider};
  font-size: ${theme.fontSize.md};
`;
export const Section = styled.section`
  & + & { margin-top: ${theme.spacing.xl}; }
`;
export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 136px minmax(0, 1fr);
  align-items: start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  & > label { padding-top: ${theme.spacing.sm}; font-size: ${theme.fontSize.sm}; font-weight: 600; }
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; gap: ${theme.spacing.xs}; }
`;
export const Required = styled.span`
  margin-left: ${theme.spacing.xs};
  color: ${theme.colors.error};
`;
export const Hint = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;
export const CharacterCount = styled(Hint)`text-align: right;`;
export const PlaceControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  & > div:first-child { flex: 1; min-width: 120px; max-width: 360px; }
  & > button { flex-shrink: 0; }
`;
export const PlaceInput = styled(BaseInput)`
  &[readonly] { color: ${theme.colors.textPrimary}; background: ${theme.colors.bgWhite}; cursor: pointer; padding-right: ${theme.spacing.xxl}; }
`;
export const SelectedPlace = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  overflow-wrap: anywhere;
`;
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;
