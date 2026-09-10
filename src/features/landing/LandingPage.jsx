import WelcomeContent from "./WelcomeContent";
import Footer from "../../components/Layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FiAlertCircle, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal/Modal";
import gwLogo from "../../assets/GWLoGo2.svg";
import {
  LandingContainer,
  Header,
  HeaderAuthA,
  LogoGroup,
  MobileMenu
} from "./LandingPage.styles";

const LandingPage = () => {
  const navigate = useNavigate();
  const { status, logout } = useAuth();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      navigate("/", { replace: true });
    }
  };


  const handleModeClick = (mode) => {
    if (status === "unauthenticated") {
      setIsAlertModalOpen(true);
    } else {
      navigate(`/map?mode=${mode}`);
    }
  };

  return (
    <LandingContainer>
      <Header>
        <LogoGroup>
          <img src={gwLogo} alt="Gimpo Wellness Logo" style={{ height: "45px" }} />
          <span className="logo-text">Gimpo Wellness</span>
        </LogoGroup>

        <HeaderAuthA>
          {/* 데스크탑 메뉴 */}
          <div className="desktop-menu">
            <button className="btn-ghost" onClick={() => navigate('/map')}>
              <FaMapMarkedAlt /> 지도 둘러보기
            </button>
            {status === "authenticated" ? (
              <>
                <button className="btn-text" onClick={() => navigate('/mypage')}>
                  마이페이지
                </button>
                <button className="btn-pill" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button className="btn-text" onClick={() => navigate('/login')}>
                  <FiLogIn /> 로그인
                </button>
                <button className="btn-pill" onClick={() => navigate('/request-email')}>
                  회원가입
                </button>
              </>
            )}
          </div>
          
          {/* 모바일 햄버거 버튼 */}
          <button aria-label="메뉴 열기 또는 닫기" aria-expanded={isMobileMenuOpen} className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </HeaderAuthA>
      </Header>

      {/* 모바일 열림 메뉴 */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <button className="btn-ghost" onClick={() => navigate('/map')}>
          <FaMapMarkedAlt /> 지도 둘러보기
        </button>
        {status === "authenticated" ? (
          <>
            <button className="btn-text" onClick={() => navigate('/mypage')}>
              마이페이지
            </button>
            <button className="btn-pill" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="btn-text" onClick={() => navigate('/login')}>
              <FiLogIn /> 로그인
            </button>
            <button className="btn-pill" onClick={() => navigate('/request-email')}>
              회원가입
            </button>
          </>
        )}
      </MobileMenu>

      <WelcomeContent onModeClick={handleModeClick} />
      <Footer />

      {/* 비회원 클릭 시 로그인 안내 모달 */}
      <Modal
        isOpen={isAlertModalOpen}
        icon={FiAlertCircle}
        iconColor="primary"
        showClose={true}
        message="로그인 후 이용해주세요."
        onConfirm={() => setIsAlertModalOpen(false)}
      />

    </LandingContainer>
  );
};

export default LandingPage;
