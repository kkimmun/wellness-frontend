import * as S from "./Modal.styles";
import { PrimaryButton, SecondaryButton } from "../Button/Button.styles";

export const Modal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
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

  return (
    <S.Overlay onClick={handleOverlayClick}>
      {/* 모달 본체 클릭 시 이벤트 버블링 차단 */}
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        {title && <S.Title>{title}</S.Title>}
        <S.Message>{message}</S.Message>

        <S.ButtonGroup>
          {/* isConfirmMode가 true일 때만 취소 버튼 렌더링 */}
          {isConfirmMode && (
            <SecondaryButton $fullWidth onClick={onCancel}>
              {cancelText}
            </SecondaryButton>
          )}
          <PrimaryButton $fullWidth onClick={onConfirm}>
            {confirmText}
          </PrimaryButton>
        </S.ButtonGroup>
      </S.ModalContainer>
    </S.Overlay>
  );
};
