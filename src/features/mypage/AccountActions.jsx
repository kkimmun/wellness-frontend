import { useRef, useState } from "react";
import { useAuth } from "../../context/authContextValue";
import { Modal } from "../../components/Modal/Modal";
import { ActionButton } from "./MyPage.styles";

export default function AccountActions({ onClose }) {
  const { logout, withdraw } = useAuth();
  const [action, setAction] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);

  const confirm = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPending(true);
    setError("");
    if (action === "logout") {
      const request = logout();
      try { await request; } catch {   }
      onClose?.();
      window.location.replace("/");
      return;
    }
    try {
      await withdraw();
      onClose?.();
      window.location.replace("/");
    } catch (failure) {
      setError(failure?.message || "회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      setPending(false);
      busyRef.current = false;
    }
  };

  return <>
    <ActionButton type="button" onClick={() => { setError(""); setAction("logout"); }}>로그아웃</ActionButton>
    <ActionButton type="button" $danger onClick={() => { setError(""); setAction("withdraw"); }}>회원탈퇴</ActionButton>
    <Modal isOpen={Boolean(action)} title={action === "withdraw" ? "회원탈퇴" : "로그아웃"}
      message={action === "withdraw" ? "정말 탈퇴하시겠습니까? 탈퇴는 되돌릴 수 없습니다. 이 브라우저의 여행 저장 데이터는 별도로 삭제해주세요." : "로그아웃하시겠습니까? 저장한 여행은 이 브라우저에 유지됩니다."}
      confirmText={pending ? "처리 중…" : action === "withdraw" ? "탈퇴하기" : "로그아웃"}
      confirmVariant={action === "withdraw" ? "danger" : "primary"} pending={pending}
      onConfirm={confirm} onCancel={() => { if (!busyRef.current) setAction(null); }}>
      {error && <p role="alert">{error}</p>}
    </Modal>
  </>;
}
