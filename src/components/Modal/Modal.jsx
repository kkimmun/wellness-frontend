import { useEffect, useId, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import * as S from "./Modal.styles";
import { modalStack } from "./modalStack";

export const Modal = ({
  isOpen,
  title,
  message,
  icon: Icon,
  iconColor,
  showClose = false,
  onConfirm,
  onCancel,
  onClose,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "primary",
  cancelVariant = "secondary",
  pending = false,
  children,
  size = "default",
  priority = 0,
}) => {
  const containerRef = useRef(null);
  const stackId = useId();
  const titleId = useId();
  const messageId = useId();

  const activeId = useSyncExternalStore(modalStack.subscribe, modalStack.getSnapshot, modalStack.getSnapshot);
  const visible = isOpen && activeId === stackId;

  useLayoutEffect(() => {
    if (isOpen) return modalStack.register(stackId, priority);
  }, [isOpen, stackId, priority]);

  useEffect(() => {
    if (!visible) return;
    const previousFocus = document.activeElement;
    const container = containerRef.current;
    container?.focus();
    return () => {
      if (container?.contains(document.activeElement) && previousFocus?.isConnected) previousFocus.focus();
    };
  }, [visible]);

  if (!isOpen) return null;

  const isConfirmMode = Boolean(onCancel);
  const dismissHandler = onClose || onCancel;

  const handleOverlayClick = () => {
    if (dismissHandler && !pending) {
      dismissHandler();
    }
  };

  return createPortal(
    <S.Overlay $visible={visible} aria-hidden={!visible} onClick={handleOverlayClick}>
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
          if (event.key === "Escape") {
            event.stopPropagation();
            if (dismissHandler && !pending) dismissHandler();
          }
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
          <S.CloseButton type="button" aria-label="닫기" disabled={pending} onClick={dismissHandler || onConfirm}>
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

        {(isConfirmMode || onConfirm) && (
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
        )}
      </S.ModalContainer>
    </S.Overlay>,
    document.body
  );
};
