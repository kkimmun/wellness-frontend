import { useState } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.borderDivider};
`;

const TabItem = styled.button`
  flex: 1;
  padding: ${theme.spacing.sm} 0;
  font-size: ${theme.fontSize.md};
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "500")};
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.textMuted};

  /* 활성 탭 하단 밑줄 표시 */
  border-bottom: 2px solid
    ${({ $isActive }) => ($isActive ? theme.colors.primary : "transparent")};
  transition: all 0.2s ease;
`;

export const TabSelect = ({ tabs = ["기본정보", "리뷰"], onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <TabContainer>
      {tabs.map((tab, index) => (
        <TabItem
          key={tab}
          $isActive={activeTab === index}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </TabItem>
      ))}
    </TabContainer>
  );
};
