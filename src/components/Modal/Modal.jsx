import { useEffect, useId, useRef } from "react";
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
  pending = false,
  children,
  size = "default",
}) => {
  const containerRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    containerRef.current?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // onCancel이 있으면 Confirm(2버튼), 없으면 Alert(1버튼) 모드로 작동
  const isConfirmMode = Boolean(onCancel);

  // 오버레이 클릭 시 닫힘 처리: Confirm 모드일 때만 동작하도록 방어 로직 추가
  const handleOverlayClick = () => {
    if (isConfirmMode && !pending) {
      onCancel();
    }
  };

  return createPortal(
    <S.Overlay onClick={handleOverlayClick}>
      {/* 모달 본체 클릭 시 이벤트 버블링 차단 */}
      <S.ModalContainer
        ref={containerRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "알림"}
        aria-describedby={message ? messageId : undefined}
        aria-busy={pending}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isConfirmMode && !pending) onCancel();
          if (event.key !== "Tab") return;
          const focusable = [...event.currentTarget.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex='0']")];
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first) { event.preventDefault(); return; }
          if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
            event.preventDefault(); last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
            event.preventDefault(); first.focus();
          }
        }}
      >
        {showClose && (
          <S.CloseButton type="button" aria-label="닫기" disabled={pending} onClick={isConfirmMode ? onCancel : onConfirm}>
            <FiX />
          </S.CloseButton>
        )}
        
        {Icon && (
          <S.IconWrapper $color={iconColor}>
            <Icon />
          </S.IconWrapper>
        )}

        {title && <S.Title id={titleId}>{title}</S.Title>}
        {message && <S.Message id={messageId}>{message}</S.Message>}
        {children}

        <S.ButtonGroup>
          {isConfirmMode && (
            <S.ActionButton type="button" disabled={pending} $variant={cancelVariant} onClick={onCancel}>
              {cancelText}
            </S.ActionButton>
          )}
          {onConfirm && <S.ActionButton type="button" disabled={pending} $variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </S.ActionButton>}
        </S.ButtonGroup>
      </S.ModalContainer>
    </S.Overlay>,
    document.body
  );
};
