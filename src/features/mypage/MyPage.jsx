import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { ProfilePopoverCard, Title, ProfileSection, ProfileImage, NameRow, ActionButton } from "./MyPage.styles";
import { useAuth } from "../../context/AuthContext";
import AccountActions from "./AccountActions";
import { getProfileImage } from "./myPageModel";

// 헤더의 빠른 메뉴. 실제 회원정보와 여행 목록은 별도의 마이페이지에서 확인한다.
export default function MyPage({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [failedImage, setFailedImage] = useState(null);
  const image = getProfileImage(user);
  const open = (url, state) => { onClose?.(); navigate(url, { state }); };
  return <ProfilePopoverCard onClick={(event) => event.stopPropagation()}>
    <Title>내 정보</Title>
    <ProfileSection>
      <ProfileImage>{image && failedImage !== image ? <img src={image} alt="프로필" onError={() => setFailedImage(image)} /> : <FaUserCircle size={80} />}</ProfileImage>
      <NameRow><span>{user?.memberName || "사용자"}</span></NameRow>
    </ProfileSection>
    <ActionButton type="button" onClick={() => open("/mypage")}>마이페이지</ActionButton>
    <ActionButton type="button" onClick={() => open("/map?mode=j", { planView: "saved" })}>나의 여행 계획</ActionButton>
    <ActionButton type="button" onClick={() => open("/map?mode=p", { recommendationView: "saved" })}>나의 추천 코스</ActionButton>
    <AccountActions onClose={onClose} />
  </ProfilePopoverCard>;
}
