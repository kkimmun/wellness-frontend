import React, { useRef, useState } from "react";
import {
  UploaderContainer,
  UploadTrigger,
  PreviewContainer,
  ThumbnailWrapper,
  ThumbnailImage,
  DeleteButton,
} from "./ImageUploader.styles";

export default function ImageUploader({ maxFiles = 5, onImagesChange }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (previewUrls.length + files.length > maxFiles) {
      alert(`사진은 최대 ${maxFiles}장까지만 첨부할 수 있습니다.`);
      return;
    }

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);

    // 부모 컴포넌트에 파일 객체 전달 로직 필요 시 여기에 추가
    if (onImagesChange) onImagesChange(files);

    // 같은 파일을 다시 선택할 수 있도록 인풋 초기화
    e.target.value = "";
  };

  const handleDelete = (indexToDelete) => {
    setPreviewUrls((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  return (
    <UploaderContainer>
      {previewUrls.length < maxFiles && (
        <UploadTrigger>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ fontSize: "12px" }}>
            사진 첨부 ({previewUrls.length}/{maxFiles})
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </UploadTrigger>
      )}

      {previewUrls.length > 0 && (
        <PreviewContainer>
          {previewUrls.map((url, index) => (
            <ThumbnailWrapper key={url}>
              <ThumbnailImage src={url} alt={`미리보기 ${index + 1}`} />
              <DeleteButton onClick={() => handleDelete(index)}>✕</DeleteButton>
            </ThumbnailWrapper>
          ))}
        </PreviewContainer>
      )}
    </UploaderContainer>
  );
}
