import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCamera, FaPen } from "react-icons/fa";
import {
  ProfilePopoverCard,
  Title,
  ProfileSection,
  ProfileImageWrapper,
  ProfileImage,
  CameraButton,
  NameRow,
  InfoList,
  InfoRow,
  InfoLabel,
  InfoValue,
  ActionButton,
  ChangePasswordButton,
} from "./MyPage.styles";
import { AuthAPI } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";

const MyPage = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  
  // 백엔드에서 받은 실제 사용자 데이터를 사용
  const [userInfo, setUserInfo] = useState({
    profileImage: user?.profileImage || null,
    memberName: user?.memberName || "사용자",
    memberId: user?.memberId || "알 수 없음",
    email: user?.email || "알 수 없음",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: 실제 프로젝트에서는 백엔드 API로 이미지 업로드 요청을 보내고, 
      // 성공 시 checkAuth()를 호출하여 전역 상태를 업데이트해야 합니다.
      const imageUrl = URL.createObjectURL(file);
      setUserInfo((prev) => ({ ...prev, profileImage: imageUrl }));
      alert("프로필 사진이 임시 변경되었습니다. (API 연동 필요)");
    }
  };

  const handleEditName = () => {
    const newName = prompt("새 닉네임을 입력하세요:", userInfo.memberName);
    if (newName && newName.trim().length >= 2) {
      // TODO: 실제 프로젝트에서는 백엔드 API로 닉네임 변경 요청을 보내고,
      // 성공 시 checkAuth()를 호출하여 전역 상태를 업데이트해야 합니다.
      setUserInfo((prev) => ({ ...prev, memberName: newName }));
      alert("프로필이 임시 수정되었습니다. (API 연동 필요)");
    }
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await AuthAPI.logout();
      await checkAuth(); // 전역 상태(unauthenticated)로 갱신
      setIsLogoutModalOpen(false);
      if (onClose) onClose();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdrawal = () => {
    if (window.confirm("정말 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      alert("회원탈퇴가 완료되었습니다.");
      AuthAPI.logout().then(() => {
        if (onClose) onClose();
        navigate("/login");
      });
    }
  };

  return (
    <ProfilePopoverCard onClick={(e) => e.stopPropagation()}>
      <Title>내 정보</Title>

      <ProfileSection>
        <ProfileImageWrapper>
          <ProfileImage>
            {userInfo.profileImage ? (
              <img src={userInfo.profileImage} alt="프로필" />
            ) : (
              <FaUserCircle size={80} />
            )}
          </ProfileImage>
          <CameraButton>
            <FaCamera size={12} />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </CameraButton>
        </ProfileImageWrapper>

        <NameRow>
          <span>{userInfo.memberName}</span>
          <button onClick={handleEditName}>
            <FaPen size={10} />
          </button>
        </NameRow>
      </ProfileSection>

      <InfoList>
        <InfoRow>
          <InfoLabel>아이디</InfoLabel>
          <InfoValue>{userInfo.memberId}</InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>비밀번호</InfoLabel>
          <InfoValue>
            <ChangePasswordButton onClick={() => alert("비밀번호 변경 모달 오픈 준비중")}>
              변경
            </ChangePasswordButton>
          </InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>이메일</InfoLabel>
          <InfoValue>{userInfo.email}</InfoValue>
        </InfoRow>
      </InfoList>

      <ActionButton onClick={handleLogout}>로그아웃</ActionButton>
      <ActionButton $danger onClick={handleWithdrawal}>회원탈퇴</ActionButton>

      <Modal
        isOpen={isLogoutModalOpen}
        icon={FiAlertCircle}
        iconColor="primary"
        title="로그아웃"
        message="정말로 로그아웃 하시겠습니까?"
        confirmText="예"
        cancelText="취소"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </ProfilePopoverCard>
  );
};

export default MyPage;
