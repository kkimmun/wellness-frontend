import React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import * as S from "./Modal.styles";

export const Modal = ({
  isOpen,
  title,
  message,
  icon: Icon,           // 선택적 아이콘 컴포넌트 전달
  iconColor,            // "danger" | "primary"
  showClose = false,    // 우측 상단 X 버튼 표시 여부
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "primary", // "primary" | "danger" | "secondary"
  cancelVariant = "secondary", // "primary" | "danger" | "secondary"
}) => {
  if (!isOpen) return null;

  // onCancel이 있으면 Confirm(2버튼), 없으면 Alert(1버튼) 모드로 작동
  const isConfirmMode = Boolean(onCancel);

  // 오버레이 클릭 시 닫힘 처리: Confirm 모드일 때만 동작하도록 방어 로직 추가
  const handleOverlayClick = () => {
    if (isConfirmMode) {
      onCancel();
    }
  };

  return createPortal(
    <S.Overlay onClick={handleOverlayClick}>
      {/* 모달 본체 클릭 시 이벤트 버블링 차단 */}
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <S.CloseButton onClick={isConfirmMode ? onCancel : onConfirm}>
            <FiX />
          </S.CloseButton>
        )}
        
        {Icon && (
          <S.IconWrapper $color={iconColor}>
            <Icon />
          </S.IconWrapper>
        )}

        {title && <S.Title>{title}</S.Title>}
        <S.Message>{message}</S.Message>

        <S.ButtonGroup>
          {isConfirmMode && (
            <S.ActionButton $variant={cancelVariant} onClick={onCancel}>
              {cancelText}
            </S.ActionButton>
          )}
          <S.ActionButton $variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </S.ActionButton>
        </S.ButtonGroup>
      </S.ModalContainer>
    </S.Overlay>,
    document.body
  );
};
