import { useRef, useState } from "react";
import { AdminPlaceAPI } from "./api/adminPlaceApi";

export function usePlaceImageDelete(placeNo, onDeleted) {
  const [target, setTarget] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);

  const requestDelete = (image) => {
    if (inFlight.current || image.imgNo == null) return;
    setError("");
    setMessage("");
    setTarget(image);
  };
  const confirmDelete = async () => {
    if (!target || inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    try {
      await AdminPlaceAPI.deletePlaceImage(placeNo, target.imgNo);
      onDeleted(target.imgNo);
      setTarget(null);
      setMessage("이미지를 삭제했습니다.");
    } catch (err) {
      setError(err?.message || "이미지 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return {
    pending,
    message,
    error,
    requestDelete,
    modalProps: {
      isOpen: target != null,
      title: "이미지 삭제",
      message: `${target?.originalName || "선택한 이미지"}를 삭제하시겠습니까? 이미지와 출처 정보가 즉시 삭제되며 되돌릴 수 없습니다.`,
      pending,
      confirmText: pending ? "삭제 중…" : "삭제",
      confirmVariant: "danger",
      onConfirm: confirmDelete,
      onCancel: () => { if (!inFlight.current) { setTarget(null); setError(""); } },
    },
  };
}
