import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import gwLogo from "../../assets/GWLoGo2.svg";
import {
  HeaderContainer,
  LogoArea,
  DesktopNavList,
  NavItem,
  DesktopUserIconArea,
  UserIconWrapper,
  HeaderProfileImg,
  PopoverWrapper,
  MobileRightGroup,
  UserIconArea,
  MobileMenuButton,
  MobileDrawer,
  MobileNavList,
  MobileNavItem,
} from "./Header.styles";
import MyPage from "../../features/mypage/MyPage";

import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { status, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileImg, setProfileImg] = useState(
    user?.profileImage || localStorage.getItem("profileImage"), // 백엔드에서 profileImage를 주면 user 객체에서 사용 가능
  );
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = status === "authenticated";

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setProfileOpen((prev) => !prev);
    } else {
      handleNavigate("/login");
    }
  };

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileImg(localStorage.getItem("profileImage"));
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);

    const handleClickOutside = (event) => {
      const isOutsideDesktop =
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target);
      const isOutsideMobile =
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target);

      // 데스크톱과 모바일 양쪽 영역 밖을 클릭했을 때만 닫기
      if (isOutsideDesktop && isOutsideMobile) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isPilgrimActive = location.pathname.startsWith("/pilgrim");

  return (
    <>
      <HeaderContainer>
        <LogoArea onClick={() => handleNavigate("/")}>
          <img src={gwLogo} alt="웰니스 로고" />
        </LogoArea>

        <DesktopNavList>
          <NavItem
            $active={location.pathname === "/" || location.pathname === "/map"}
            onClick={() => handleNavigate("/map")}
          >
            지도
          </NavItem>
          <NavItem
            $active={isPilgrimActive}
            onClick={() => handleNavigate("/pilgrim/fixed")}
          >
            순례자의 길
          </NavItem>
          <NavItem
            $active={location.pathname === "/gimpoTop10"}
            onClick={() => handleNavigate("/gimpoTop10")}
          >
            김포Top10
          </NavItem>
        </DesktopNavList>

        {/* 데스크톱 마이페이지/로그인 아이콘 + 팝업 메뉴 */}
        <UserIconWrapper ref={desktopDropdownRef}>
          <DesktopUserIconArea onClick={handleUserIconClick}>
            {profileImg ? (
              <HeaderProfileImg src={profileImg} alt="내 프로필" />
            ) : (
              <FaUserCircle size={28} />
            )}
          </DesktopUserIconArea>

          {isLoggedIn && profileOpen && (
            <PopoverWrapper>
              <MyPage onClose={() => setProfileOpen(false)} />
            </PopoverWrapper>
          )}
        </UserIconWrapper>

        <MobileRightGroup>
          {/* 모바일 마이페이지/로그인 아이콘 + 팝업 메뉴 */}
          <UserIconWrapper ref={mobileDropdownRef}>
            <UserIconArea onClick={handleUserIconClick}>
              {profileImg ? (
                <HeaderProfileImg src={profileImg} alt="내 프로필" />
              ) : (
                <FaUserCircle size={24} />
              )}
            </UserIconArea>

            {isLoggedIn && profileOpen && (
              <PopoverWrapper>
                <MyPage onClose={() => setProfileOpen(false)} />
              </PopoverWrapper>
            )}
          </UserIconWrapper>

          <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </MobileMenuButton>
        </MobileRightGroup>
      </HeaderContainer>

      <MobileDrawer $isOpen={mobileOpen}>
        <MobileNavList>
          <MobileNavItem
            $active={location.pathname === "/" || location.pathname === "/map"}
            onClick={() => handleNavigate("/map")}
          >
            지도
          </MobileNavItem>
          <MobileNavItem
            $active={isPilgrimActive}
            onClick={() => handleNavigate("/pilgrim/fixed")}
          >
            순례자의 길
          </MobileNavItem>
          <MobileNavItem
            $active={location.pathname === "/gimpoTop10"}
            onClick={() => handleNavigate("/gimpoTop10")}
          >
            김포Top10
          </MobileNavItem>
        </MobileNavList>
      </MobileDrawer>
    </>
  );
};

export default Header;
