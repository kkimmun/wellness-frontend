import { useEffect, useId, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import * as S from "./BottomSheet.styles";
import { modalStack } from "../Modal/modalStack";

export const BottomSheet = ({
  isOpen,
  title,
  message,
  icon: Icon,
  iconColor,
  showClose = true,
  onClose,
  children,
  size = "default",
  priority = 0,
}) => {
  const containerRef = useRef(null);
  const stackId = useId();
  const titleId = useId();
  const messageId = useId();

  const activeId = useSyncExternalStore(
    modalStack.subscribe,
    modalStack.getSnapshot,
    modalStack.getSnapshot,
  );
  const visible = isOpen && activeId === stackId;

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    return modalStack.register(stackId, priority);
  }, [isOpen, stackId, priority]);

  useEffect(() => {
    if (!visible) return;
    const previousFocus = document.activeElement;
    const container = containerRef.current;
    container?.focus();
    return () => {
      if (container?.contains(document.activeElement) && previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [visible]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (onClose) onClose();
  };

  return createPortal(
    <S.Overlay
      $visible={visible}
      aria-hidden={!visible}
      onClick={handleOverlayClick}
    >
      <S.SheetContainer
        ref={containerRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Bottom Sheet"}
        aria-describedby={message ? messageId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            if (onClose) onClose();
          }
        }}
      >
        {showClose && (
          <S.CloseButton type="button" aria-label="닫기" onClick={onClose}>
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
      </S.SheetContainer>
    </S.Overlay>,
    document.body,
  );
};
