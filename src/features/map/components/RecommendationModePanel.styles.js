import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const Panel = styled.aside`
  position: absolute;
  top: 88px;
  right: 24px;
  z-index: 240;
  width: min(400px, calc(100% - 48px));
  max-height: calc(100% - 112px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: 18px;
  background: ${theme.colors.bgWhite};
  box-shadow: 0 12px 32px rgba(42, 26, 24, 0.18);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(calc(100% + 40px))"};
  transition: transform 0.25s ease, opacity 0.2s ease;

  @media (max-width: 768px) {
    top: auto;
    right: 12px;
    bottom: 12px;
    width: calc(100% - 24px);
    max-height: 72%;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 14px;
  border-bottom: 1px solid ${theme.colors.borderDivider};

  small {
    color: #9a5c50;
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

export const Body = styled.div`
  overflow-y: auto;
  padding: 18px;
`;

export const OriginCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #ead8d1;
  border-radius: 12px;
  background: #fff7f3;
  color: #9a5c50;

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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 8px;
    background: white;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
`;

export const Section = styled.section`
  margin-top: 20px;

  > select {
    width: 100%;
    min-height: 42px;
    margin-top: 8px;
    padding: 0 11px;
    border: 1px solid ${theme.colors.borderLight};
    border-radius: 9px;
    background: white;
    color: ${theme.colors.textPrimary};
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  strong {
    font-size: 14px;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
  }
`;

export const TagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
`;

export const TagButton = styled.button`
  padding: 7px 10px;
  border: 1px solid ${({ $selected }) => ($selected ? "#9a5c50" : "#e4dad6")};
  border-radius: 999px;
  background: ${({ $selected }) => ($selected ? "#9a5c50" : "white")};
  color: ${({ $selected }) => ($selected ? "white" : theme.colors.textSecondary)};
  font-size: 11px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
  border: 0;
  border-radius: 10px;
  background: #9a5c50;
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;

export const Message = styled.p`
  margin: 10px 0 0;
  color: ${({ $error }) => ($error ? "#d64545" : theme.colors.textSecondary)};
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
`;

export const CourseSection = styled.section`
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${theme.colors.borderDivider};

  ol {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: center;
    gap: 9px;
    padding: 10px;
    border: 1px solid #eaded9;
    border-radius: 10px;
    background: #fffaf8;
  }

  .order {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #9a5c50;
    color: white;
    font-size: 12px;
    font-weight: 800;
  }

  li button {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  li small,
  li em {
    color: ${theme.colors.textSecondary};
    font-size: 10px;
    font-style: normal;
  }

  li strong {
    overflow: hidden;
    max-width: 260px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }
`;

export const CourseSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
  }
`;

const FullWidthActionButton = styled.button`
  width: 100%;
  min-height: 42px;
  margin-top: 12px;
  border: 1px solid #9a5c50;
  border-radius: 9px;
  background: white;
  color: #9a5c50;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

export const PanelNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
    border-bottom-color: #9a5c50;
    color: #9a5c50;
  }
`;

export const OptionStatus = styled.p`
  margin: 8px 2px 0;
  color: ${({ $error }) => ($error ? "#d64545" : theme.colors.textSecondary)};
  font-size: 11px;
  line-height: 1.45;
`;

export const SavedCourseCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 12px;
  border: 1px solid ${({ $active }) => ($active ? "#168b91" : "#d9e5e6")};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? "#eefafa" : "#f8fbfb")};

  .saved-info {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${theme.colors.textPrimary};
    text-align: left;
    cursor: pointer;
  }

  .saved-info strong {
    max-width: 100%;
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .saved-info span,
  .saved-info small {
    color: ${theme.colors.textSecondary};
    font-size: 10px;
  }

  .delete {
    width: 32px;
    height: 32px;
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    padding: 0;
    border: 1px solid #f0cccc;
    border-radius: 8px;
    background: white;
    color: #d9534f;
    cursor: pointer;
  }
`;

export const SavedCourseSection = styled.section`
  margin-top: 10px;

  ${SavedCourseCard} {
    margin-top: 8px;
  }
`;

export const SavedViewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  span {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.4;
  }

  button {
    flex: 0 0 auto;
    padding: 8px 11px;
    border: 1px solid #d8b8ad;
    border-radius: 8px;
    background: #fff7f3;
    color: #9a5c50;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const SavedCourseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  strong {
    font-size: 13px;
  }

  span {
    color: ${theme.colors.textSecondary};
    font-size: 11px;
  }
`;

export const SavedCourseEmpty = styled.p`
  margin: 8px 0 0;
  padding: 14px 10px;
  border-radius: 10px;
  background: #f7f9f9;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  text-align: center;
`;

export const SavePlanButton = styled(FullWidthActionButton)`
  border-color: #9a5c50;
  background: #9a5c50;
  color: white;

  &:disabled {
    cursor: default;
    opacity: 0.55;
  }
`;

export const ReopenButton = styled.button`
  position: absolute;
  top: 110px;
  right: 24px;
  z-index: 235;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  border: 1px solid #ead8d1;
  border-radius: 999px;
  background: white;
  box-shadow: 0 5px 16px rgba(42, 26, 24, 0.15);
  color: #9a5c50;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;
