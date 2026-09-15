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
import { getProfileImage } from "../../features/mypage/myPageModel";

import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { status, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileImg = status === "authenticated" ? getProfileImage(user) : null;
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = status === "authenticated";

  const handleNavigate = (path) => {
    navigate(path, path === "/map"
      ? { state: { hideInitialTop10: true, resetMapView: true } }
      : undefined);
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
    const handleClickOutside = (event) => {
      // MyPage의 확인 모달은 Portal로 body 아래에 렌더링된다.
      // 모달 클릭을 외부 클릭으로 처리하면 click 이벤트 전에 MyPage가 언마운트된다.
      if (event.target.closest?.('[role="dialog"]')) return;

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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isPilgrimActive = location.pathname.startsWith("/pilgrim");
  const currentMapMode = new URLSearchParams(location.search).get("mode");
  const isTravelPlanActive =
    location.pathname === "/map" && currentMapMode === "j";
  const isRecommendationModeActive =
    location.pathname === "/map" && currentMapMode === "p";
  const isRouteMenuActive = location.pathname === "/map" && currentMapMode === "route";
  const isRegularMapActive =
    location.pathname === "/map" &&
    !isRouteMenuActive &&
    !isTravelPlanActive &&
    !isRecommendationModeActive;

  const openSavedTravelPlans = () => {
    navigate("/map?mode=j", { state: { planView: "saved" } });
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const openRecommendationMode = () => {
    handleNavigate("/map?mode=p");
  };

  return (
    <>
      <HeaderContainer>
        <LogoArea onClick={() => handleNavigate("/")}>
          <img src={gwLogo} alt="웰니스 로고" />
        </LogoArea>

        <DesktopNavList>
          <NavItem
            $active={
              location.pathname === "/" ||
              isRegularMapActive
            }
            onClick={() => handleNavigate("/map")}
          >
            지도
          </NavItem>
          <NavItem
            $active={isRouteMenuActive}
            onClick={() => handleNavigate("/map?mode=route")}
          >
            길찾기
          </NavItem>
          <NavItem
            $active={location.pathname === "/gimpoTop10"}
            onClick={() => handleNavigate("/gimpoTop10")}
          >
            TOP 10
          </NavItem>
          {isLoggedIn && (
            <NavItem
              $active={isTravelPlanActive}
              onClick={openSavedTravelPlans}
            >
              계획모드
            </NavItem>
          )}
          {isLoggedIn && (
            <NavItem
              $active={isRecommendationModeActive}
              onClick={openRecommendationMode}
            >
              추천모드
            </NavItem>
          )}
          <NavItem
            $active={isPilgrimActive}
            onClick={() => handleNavigate("/pilgrim/fixed")}
          >
            순례길 목록
          </NavItem>
        </DesktopNavList>

        {/* 데스크톱 마이페이지/로그인 아이콘 + 팝업 메뉴 */}
        <UserIconWrapper $desktop ref={desktopDropdownRef}>
          <DesktopUserIconArea as="button" type="button" aria-label={isLoggedIn ? "내 정보 메뉴" : "로그인"} aria-expanded={isLoggedIn && profileOpen} style={{ border: 0, background: "none" }} onClick={handleUserIconClick}>
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
            <UserIconArea as="button" type="button" aria-label={isLoggedIn ? "내 정보 메뉴" : "로그인"} aria-expanded={isLoggedIn && profileOpen} style={{ border: 0, background: "none" }} onClick={handleUserIconClick}>
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
            $active={
              location.pathname === "/" ||
              isRegularMapActive
            }
            onClick={() => handleNavigate("/map")}
          >
            지도
          </MobileNavItem>
          <MobileNavItem
            $active={isRouteMenuActive}
            onClick={() => handleNavigate("/map?mode=route")}
          >
            길찾기
          </MobileNavItem>
          <MobileNavItem
            $active={location.pathname === "/gimpoTop10"}
            onClick={() => handleNavigate("/gimpoTop10")}
          >
            TOP 10
          </MobileNavItem>
          {isLoggedIn && (
            <MobileNavItem
              $active={isTravelPlanActive}
              onClick={openSavedTravelPlans}
            >
              계획모드
            </MobileNavItem>
          )}
          {isLoggedIn && (
            <MobileNavItem
              $active={isRecommendationModeActive}
              onClick={openRecommendationMode}
            >
              추천모드
            </MobileNavItem>
          )}
          <MobileNavItem
            $active={isPilgrimActive}
            onClick={() => handleNavigate("/pilgrim/fixed")}
          >
            순례길 목록
          </MobileNavItem>
        </MobileNavList>
      </MobileDrawer>
    </>
  );
};

export default Header;
