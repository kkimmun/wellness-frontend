import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaMapMarkedAlt } from "react-icons/fa";
import { FiAlertCircle, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { PlaceAPI } from "../../api/place";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal/Modal";
import jPattern from "../../assets/j_mode_pattern.svg";
import pPattern from "../../assets/p_mode_pattern.svg";
import gwLogo from "../../assets/GWLoGo2.svg";
import {
  LandingContainer,
  Header,
  HeaderAuthA,
  LogoGroup,
  MainSplit,
  SplitSection,
  SectionTitle,
  SectionDesc,
  ActionButton,
  RoutePreview,
  BottomCarousel,
  PlaceCard,
  MobileMenu
} from "./LandingPage.styles";

const LandingPage = () => {
  const navigate = useNavigate();
  const { status, logout } = useAuth();
  const [top10List, setTop10List] = useState([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        const res = await PlaceAPI.getGimpoTop10();
        if (res && res.code === 200 && res.data && res.data.content) {
          setTop10List(res.data.content);
        } else if (res && res.data && Array.isArray(res.data)) {
          setTop10List(res.data);
        } else if (Array.isArray(res)) {
          setTop10List(res);
        } else {
          setTop10List([]);
        }
      } catch (err) {
        console.error("Top10 API 호출 실패:", err);
        setTop10List([]);
      }
    };
    fetchTop10();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      navigate("/", { replace: true });
    }
  };

  const listToRender = top10List;
  const marqueeList = [...listToRender, ...listToRender, ...listToRender, ...listToRender];

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
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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

      <MainSplit>
        {/* J모드 (계획적인 여행) */}
        <SplitSection $bgColor="#F3F6FF" $bgPattern={jPattern}>
          <SectionTitle $color="#46558A">계획적인 여행</SectionTitle>
          <SectionDesc $color="#46558A">
            주변 장소 추천을 미리 받아 빈틈없이 완성하는 확정된 여정.<br />
            출발지와 목표지 사이의 모든 루트와 시간표를 세션에 고정하고 그대로 따라가는 모드.
          </SectionDesc>
          <ActionButton 
            $color="#46558A" 
            $bgHover="#30384A"
            onClick={() => handleModeClick('j')}
          >
            계획하기 <FaArrowRight size={14} />
          </ActionButton>

          <RoutePreview $color="#46558A">
            <h3>저장된 계획 루트</h3>
            <ul>
              <li>08:00 출발지 - 대명항</li>
              <li>10:30 체험형 관광지 - 대명항 낚시카페</li>
              <li>13:00 점심 - 대명횟집</li>
              <li>15:00 체험형 관광지 - 도자기 공방</li>
            </ul>
          </RoutePreview>
        </SplitSection>

        {/* P모드 (유연한 여행) */}
        <SplitSection $bgColor="#FFF7F3" $bgPattern={pPattern}>
          <SectionTitle $color="#9A5C50">유연한 여행</SectionTitle>
          <SectionDesc $color="#9A5C50">
            주변 장소 추천을 실시간으로 꼬리에 꼬리를 물며(체인) 엮어내는 즉석 여정.<br />
            출발지와 임의의 목표지만 두고 유연하게 코스를 그리며, 마음에 들 때만 저장하거나 가볍게 세션을 흘려보내는 자유형 모드.
          </SectionDesc>
          <ActionButton 
            $color="#9A5C50" 
            onClick={() => handleModeClick('p')}
          >
            추천받기 <FaArrowRight size={14} />
          </ActionButton>

          <RoutePreview $color="#9A5C50">
            <h3>추천된 릴레이 루트</h3>
            <ul>
              <li>08:00 출발지 - 애기봉</li>
              <li>큐레이팅 추천 - 주변 맛집/주변 체험형 관광지 / 명소</li>
              <li>13:00 점심 - 추천받은 주변 맛집</li>
              <li>15:00 체험형 관광지 - 추천받은 주변 관광지</li>
            </ul>
          </RoutePreview>
        </SplitSection>
      </MainSplit>

      {/* 갤러리 슬라이드 (클릭 불가능한 자동 롤링 마키) */}
      <BottomCarousel>
        <div className="carousel-track">
          {marqueeList.map((place, index) => {
            // 백엔드에서 빈 문자열("")이나 유효하지 않은 주소를 보낼 경우를 대비해 필터링
            const isValidUrl = (url) => url && typeof url === 'string' && url.length > 5 && url.startsWith('http');
            
            let finalImgSrc = "https://picsum.photos/id/20/500/500";
            if (isValidUrl(place.imageUrl)) finalImgSrc = place.imageUrl;
            else if (isValidUrl(place.imgUrl)) finalImgSrc = place.imgUrl;

            return (
              <PlaceCard key={`${place.placeNo}-${index}`}>
                <img 
                  src={finalImgSrc} 
                  alt={place.placeName} 
                  onError={(e) => {
                    // 최후의 수단: 이미지 로딩 자체가 실패(엑박)하면 무조건 기본 이미지로 교체
                    e.target.onerror = null; 
                    e.target.src = "https://picsum.photos/id/20/500/500";
                  }}
                />
                <div className="info">#{place.placeName}</div>
              </PlaceCard>
            );
          })}
        </div>
      </BottomCarousel>

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
