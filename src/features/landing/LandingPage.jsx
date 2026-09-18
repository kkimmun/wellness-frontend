import WelcomeContent from "./WelcomeContent";
import Footer from "../../components/Layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/authContextValue";
import LoginRequiredModal from "../../components/Modal/LoginRequiredModal";
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
  const [loginReturnTo, setLoginReturnTo] = useState(null);
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
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setLoginReturnTo(`/map?mode=${mode}`);
    } else {
      navigate(`/map?mode=${mode}`);
    }
  };

  return (
    <LandingContainer>
      <Header>
        <LogoGroup as="button" type="button" aria-label="메인 화면으로 이동" onClick={() => navigate("/")}>
          <img src={gwLogo} alt="Gimpo Wellness Logo" style={{ height: "45px" }} />
          <span className="logo-text">Gimpo Wellness</span>
        </LogoGroup>

        <HeaderAuthA>
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
          
          <button aria-label="메뉴 열기 또는 닫기" aria-expanded={isMobileMenuOpen} className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </HeaderAuthA>
      </Header>

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

      <LoginRequiredModal
        isOpen={Boolean(loginReturnTo)}
        returnTo={loginReturnTo}
        onClose={() => setLoginReturnTo(null)}
      />

    </LandingContainer>
  );
};

export default LandingPage;
