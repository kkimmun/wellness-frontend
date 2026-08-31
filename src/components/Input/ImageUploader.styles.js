import styled from "styled-components";

export const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const UploadTrigger = styled.label`
  border: 1px dashed ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryDisabled};
    color: ${({ theme }) => theme.colors.primary};
  }

  /* 숨겨진 실제 file input */
  input {
    display: none;
  }
`;

export const PreviewContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ThumbnailWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgLight};
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
  }
`;
