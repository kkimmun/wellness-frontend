import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Page = styled.div`
  min-height: 100%; background: #f4f8fa; padding: 48px 40px 72px; color: ${theme.colors.textPrimary};
  * { box-sizing: border-box; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible { outline: 3px solid #2680a3; outline-offset: 4px; }
  @media (max-width: 700px) { padding: 28px 18px 80px; }
`;
export const Container = styled.div`max-width: 1120px; margin: auto;`;
export const Heading = styled.header`
  display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 30px;
  small { color: #43758b; font-weight: 700; letter-spacing: 2px; }
  h1 { font-size: clamp(28px, 4vw, 36px); margin: 10px 0; letter-spacing: -1px; }
  p { color: ${theme.colors.textSecondary}; margin: 0; line-height: 1.6; }
  a { color: #315f74; white-space: nowrap; text-decoration: none; font-weight: 600; }
  @media (max-width: 600px) { align-items: flex-start; flex-direction: column; }
`;
export const Layout = styled.div`
  display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 28px; align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
export const Profile = styled.aside`
  background: white; border: 1px solid #e2e9ed; border-radius: 20px; padding: 28px 22px;
  h2 { margin: 15px 0 8px; font-size: 21px; overflow-wrap: anywhere; }
  > p { font-size: 13px; color: #697782; margin: 0; overflow-wrap: anywhere; }
`;
export const Avatar = styled.div`
  width: 76px; height: 76px; border-radius: 50%; overflow: hidden; color: #91a9b5; background: #edf3f6;
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
export const Info = styled.dl`
  border-top: 1px solid #e6ecef; margin: 24px 0 0; padding-top: 8px;
  dt { color: #74808a; font-size: 12px; margin-top: 18px; }
  dd { font-size: 14px; margin: 7px 0 0; overflow-wrap: anywhere; line-height: 1.6; }
`;
export const Section = styled.section`
  min-width: 0; background: white; border: 1px solid #e2e9ed; border-radius: 20px; padding: 26px;
  @media (max-width: 600px) { padding: 20px 16px; }
`;
export const Tabs = styled.div`
  display: flex; border-bottom: 1px solid #e2e9ed; gap: 20px; margin-bottom: 24px;
  button { background: none; border: 0; border-bottom: 3px solid transparent; padding: 0 0 16px; color: #64717b;
    font-size: 15px; font-weight: 650; cursor: pointer; line-height: 1.6; }
  button[aria-selected="true"] { color: #285f77; border-color: ${theme.colors.primary}; }
  span { background: #eff5f8; border-radius: 8px; padding: 2px 7px; margin-left: 6px; font-size: 12px; }
  @media (max-width: 480px) { gap: 12px; button { font-size: 13px; } }
`;
export const SectionHeading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px;
  h2 { font-size: 20px; margin: 0; } p { color: #687983; font-size: 13px; line-height: 1.6; margin: 8px 0 0; }
  a { text-decoration: none; font-size: 13px; color: #215d77; background: #eaf5fa; border-radius: 8px; padding: 10px 12px; white-space: nowrap; }
`;
export const Notice = styled.p`
  font-size: 12px; line-height: 1.8; padding: 13px 15px; background: #f4f8fa; color: #62727b; border-radius: 10px; margin: 0 0 22px;
`;
export const TripList = styled.div`display: grid; gap: 14px;`;
export const Trip = styled.article`
  border: 1px solid #e0e8ec; border-radius: 14px; padding: 20px;
  h3 { font-size: 17px; margin: 0; overflow-wrap: anywhere; line-height: 1.5; }
  time { display: block; font-size: 12px; color: #71818b; margin: 8px 0 17px; }
  ol { list-style: decimal; padding-left: 22px; margin: 12px 0 20px; color: #465963; font-size: 13px; line-height: 1.9; }
  li { overflow-wrap: anywhere; padding-left: 3px; }
`;
export const Origin = styled.p`font-size: 13px; color: #426f82; line-height: 1.7; overflow-wrap: anywhere; margin: 0; svg { vertical-align: -2px; margin-right: 5px; }`;
export const Actions = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 15px;
  a, button { font-size: 13px; cursor: pointer; padding: 9px 12px; border-radius: 8px; text-decoration: none; }
  a { background: #eaf5fa; color: #215d77; font-weight: 700; }
  button { background: white; border: 1px solid #e8dddd; color: #a14d4d; }
`;
export const Empty = styled.div`
  padding: 46px 12px; text-align: center; color: #71818b; line-height: 1.8;
  svg { color: #8fbbcc; font-size: 34px; } h3 { color: #405561; font-size: 17px; margin: 16px 0 6px; } p { font-size: 14px; margin: 0; }
`;
export const Account = styled.section`
  margin-top: 24px; padding-top: 22px; border-top: 1px solid #e6ecef;
  h3 { font-size: 14px; margin: 0 0 14px; }
`;

export const EditButton = styled.button`
  width: 100%; margin-top: 22px; padding: 11px; border: 1px solid #c7e2ee; border-radius: 8px;
  background: #eaf5fa; color: #215d77; font-weight: 700; cursor: pointer;
`;
