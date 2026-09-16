import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";

const safeInternalPath = (path) =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
    ? path
    : "/";

const LoginRequiredModal = ({ isOpen, onClose, returnTo = "/", returnState }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login", {
      state: {
        returnTo: safeInternalPath(returnTo),
        returnState,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      icon={FiAlertCircle}
      iconColor="primary"
      title="로그인이 필요합니다"
      message="로그인 후 이용해주세요."
      showClose
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
};

export default LoginRequiredModal;
