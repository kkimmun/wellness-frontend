import styled from "styled-components";
import { theme } from "../../styles/theme";

export const State = styled.p`padding: 40px 12px; text-align: center; color: #71818b; font-size: 14px;`;
export const Summary = styled.dl`
  display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; margin: 0 0 20px; padding-bottom: 18px; border-bottom: 1px solid #e6ecef;
  dt { font-size: 13px; color: #687983; width: 100%; }
  dd { margin: 0; font-size: 34px; font-weight: 800; color: ${theme.colors.textPrimary};
    span { font-size: 15px; font-weight: 600; color: #687983; margin-left: 6px; } }
  p { margin: 0; font-size: 12px; color: #8b98a1; }
`;
export const RecordList = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; max-height: 280px; overflow-y: auto;
  li { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f7fafb; border-radius: 10px; font-size: 13px; color: #3a4a52; }
  time { color: #71818b; }
`;
