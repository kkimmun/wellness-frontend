import styled from "styled-components";

export const Editor = styled.div`
  width: 100%; max-width: 540px; margin: 0 auto;
  label { display: block; font-size: 14px; font-weight: 600; color: #334f5d; margin: 18px 0 8px; }
  input { width: 100%; box-sizing: border-box; border: 1px solid #cbd9e0; border-radius: 8px; padding: 12px; font: inherit; }
  input:focus-visible, button:focus-visible { outline: 3px solid #87ceeb; outline-offset: 2px; }
  p { font-size: 13px; line-height: 1.7; color: #607782; }
  [role="alert"] { color: #b33535; }
  fieldset { padding: 0; margin: 0; border: 0; }
`;
export const Tabs = styled.div`
  display: flex; gap: 10px; margin-bottom: 20px;
  button { flex: 1; cursor: pointer; border: 1px solid #dce6eb; border-radius: 8px; padding: 12px 6px; background: #f8fafb; color: #526d7a; }
  button[aria-pressed="true"] { background: #e8f5fb; border-color: #87ceeb; color: #225e79; font-weight: 700; }
  button:disabled { opacity: .5; cursor: wait; }
`;
export const Preview = styled.div`
  width: 96px; height: 96px; margin: 20px auto; border-radius: 50%; background: #edf3f6; color: #91a9b5; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
export const Reset = styled.button`
  margin-top: 14px; cursor: pointer; padding: 9px 12px; border: 1px solid #d8e3e8; border-radius: 8px; background: white; color: #526d7a;
`;
