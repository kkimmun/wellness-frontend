import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const Panel = styled.aside`
  position: absolute;
  top: 88px;
  right: 24px;
  z-index: 240;
  width: min(390px, calc(100% - 48px));
  max-height: calc(100% - 112px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(26, 46, 59, 0.18);
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(calc(100% + 40px))")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transition: transform 0.25s ease, opacity 0.2s ease;

  @media (max-width: 768px) {
    top: auto;
    right: 12px;
    bottom: 12px;
    width: calc(100% - 24px);
    max-height: 68%;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 14px;

  small {
    color: #46558a;
    font-size: 12px;
    font-weight: 800;
  }

  h2 {
    margin: 4px 0 0;
    color: ${theme.colors.textPrimary};
    font-size: 20px;
  }

  > button {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: ${theme.colors.bgLight};
    color: ${theme.colors.textSecondary};
    cursor: pointer;
  }
`;

export const PanelNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 16px 14px;
  border-bottom: 1px solid ${theme.colors.borderDivider};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 4px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  button.active {
    border-bottom-color: #46558a;
    color: #46558a;
  }
`;

export const PanelBody = styled.div`
  min-height: 250px;
  overflow-y: auto;
  padding: 18px;
`;

export const OriginCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #dfe5f5;
  border-radius: 12px;
  background: #f7f9ff;
  color: #46558a;

  > svg {
    flex: 0 0 auto;
  }

  div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 3px;
  }

  small {
    color: ${theme.colors.textSecondary};
  }

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const OriginActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 8px;
  margin-top: 10px;

  button {
    padding: 9px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 8px;
    background: white;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 24px 0 12px;

  strong {
    font-size: 15px;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;

  button {
    min-height: 48px;
    padding: 10px;
    border: 1px solid #cad4ed;
    border-radius: 10px;
    background: #edf3ff;
    color: #46558a;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    border-color: #46558a;
    background: #e1e9fb;
  }

  button:disabled {
    opacity: 0.5;
  }
`;

export const EmptyState = styled.div`
  padding: 34px 12px;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #46558a;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

export const ContextText = styled.p`
  margin: 12px 0;
  color: ${theme.colors.textSecondary};
  font-size: 12px;

  strong {
    color: ${theme.colors.textPrimary};
  }
`;

export const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RecommendationCard = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 12px;
  background: white;
  color: inherit;
  text-align: left;

  &:hover {
    border-color: #8798c7;
    box-shadow: 0 4px 12px rgba(70, 85, 138, 0.1);
  }

  .preview-button {
    min-width: 0;
    display: grid;
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  img,
  .image-empty {
    width: 82px;
    height: 66px;
    border-radius: 8px;
    object-fit: cover;
  }

  .image-empty {
    display: grid;
    place-items: center;
    background: ${theme.colors.bgLight};
    color: ${theme.colors.textMuted};
    font-size: 10px;
  }

  .content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .content small,
  .content span {
    overflow: hidden;
    color: ${theme.colors.textSecondary};
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .content strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .content em {
    color: #46558a;
    font-size: 11px;
    font-style: normal;
    font-weight: 800;
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border: 0;
    border-radius: 8px;
    background: #46558a;
    color: white;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const PlanHelp = styled.p`
  margin: 0 0 12px;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  line-height: 1.6;
`;

export const PlanList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 54px;
    padding: 10px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 10px;
    background: white;
  }

  li.origin {
    border-color: #ffb39f;
    background: #fff7f4;
  }

  .order {
    width: 28px;
    height: 28px;
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 50%;
    background: #46558a;
    color: white;
    font-size: 11px;
    font-weight: 800;
  }

  .origin .order {
    background: #ff7043;
  }

  li > div,
  .place-info {
    min-width: 0;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  small {
    color: ${theme.colors.textSecondary};
    font-size: 10px;
  }

  strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .remove {
    width: 28px;
    height: 28px;
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: ${theme.colors.bgLight};
    color: ${theme.colors.textSecondary};
    cursor: pointer;
  }
`;

export const PlanActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 12px;
    border: 1px solid #cad4ed;
    border-radius: 8px;
    background: #edf3ff;
    color: #46558a;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.45;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }
`;

export const SaveForm = styled.form`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.borderDivider};

  label {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    font-weight: 800;
  }

  > div {
    display: flex;
    gap: 8px;
  }

  input {
    min-width: 0;
    flex: 1;
    padding: 10px 12px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 8px;
    outline: none;
  }

  input:focus {
    border-color: #46558a;
  }

  button {
    display: flex;
    width: 100%;
    min-height: 40px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 13px;
    border: 0;
    border-radius: 8px;
    background: #46558a;
    color: white;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  button:disabled {
    cursor: default;
    opacity: 0.45;
  }
`;

export const InlineMessage = styled.p`
  margin: 10px 0 0;
  color: #46558a;
  font-size: 11px;
`;

export const SavedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  span {
    color: ${theme.colors.textSecondary};
    font-size: 10px;
  }

  button {
    flex: 0 0 auto;
    padding: 7px 10px;
    border: 1px solid #cad4ed;
    border-radius: 8px;
    background: #edf3ff;
    color: #46558a;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const SavedList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    padding: 11px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 10px;
  }

  li.active {
    border-color: #46558a;
    background: #f7f9ff;
  }

  .saved-info {
    min-width: 0;
    display: grid;
    flex: 1;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 10px;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span,
  small {
    color: ${theme.colors.textSecondary};
    font-size: 10px;
  }

  small {
    grid-column: 1 / -1;
  }

  .delete {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: ${theme.colors.bgLight};
    color: ${theme.colors.textSecondary};
    cursor: pointer;
  }
`;

export const ReopenButton = styled.button`
  position: absolute;
  top: 96px;
  right: 20px;
  z-index: 230;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border: 0;
  border-radius: 999px;
  background: #46558a;
  box-shadow: 0 6px 18px rgba(26, 46, 59, 0.2);
  color: white;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;
