import styled, { keyframes } from "styled-components";

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 80px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  
  .logo-text {
    font-size: 24px;
    font-weight: 800;
    color: #1a1a1a;
    
    @media (max-width: 768px) {
      display: none; 
    }
  }
`;

export const MainSplit = styled.main`
  display: flex;
  flex: 1; 
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SplitSection = styled.div`
  flex: 1;
  padding: 40px 80px; 
  display: flex;
  flex-direction: column;
  justify-content: center; 
  background-color: ${(props) => props.$bgColor};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 24px;
    justify-content: flex-start;
  }

  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 350px;
    background-image: url(${(props) => props.$bgPattern});
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: top center;
    opacity: 0.35;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
    z-index: 0;
    pointer-events: none;
  }

  > * {
    z-index: 1;
    position: relative;
  }
`;

export const SectionTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  color: ${(props) => props.$color};
  margin-bottom: 24px;
  margin-top: 0; 

  @media (max-width: 768px) {
    font-size: 32px;
    margin-top: 20px;
    margin-bottom: 16px;
  }
`;

export const SectionDesc = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${(props) => props.$color || "#666"};
  opacity: 0.85;
  margin-bottom: 24px; 
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: ${(props) => props.$color};
  border: 1px solid ${(props) => props.$color};
  width: fit-content;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$bgHover || props.$color};
    color: #fff;
  }
`;

export const RoutePreview = styled.div`
  margin-top: 40px; 
  
  h3 {
    font-size: 15px;
    font-weight: 800;
    color: ${(props) => props.$color};
    margin-bottom: 16px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    position: relative;
    padding: 8px 0 8px 16px;
    font-size: 14px;
    color: ${(props) => props.$color};
    opacity: 0.85;
    line-height: 1.5;
    
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 0;
      width: 3px;
      height: 12px;
      background-color: ${(props) => props.$color};
    }
  }
`;

export const BottomCarousel = styled.section`
  padding: 24px 0; 
  background-color: #ffffff;
  overflow: hidden;
  
  .carousel-track {
    display: flex;
    gap: 20px;
    width: max-content;
    animation: ${scrollAnimation} 120s linear infinite;
  }
`;

export const PlaceCard = styled.div`
  min-width: 240px;
  max-width: 240px;
  height: 160px; 
  border-radius: 4px;
  overflow: hidden;
  background: #000;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%; 
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none; 
  }

  .info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    font-weight: 700;
    font-size: 15px;
    color: #ffffff; 
    z-index: 1; 
  }
`;

export const HeaderAuthA = styled.div`
  display: flex;
  align-items: center;

  .desktop-menu {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      display: none; 
    }
  }

  .hamburger {
    display: none;
    background: transparent;
    border: none;
    font-size: 24px;
    color: #4b5563;
    cursor: pointer;
    padding: 4px;

    @media (max-width: 768px) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  .btn-ghost, .btn-text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: #4b5563;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #111827;
    }
  }

  .btn-text {
    padding: 8px 12px;
  }

  .btn-pill {
    padding: 8px 20px;
    background: #46558A;
    color: white;
    border: none;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #30384A;
    }
  }
`;

export const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    padding: 16px;
    gap: 12px;
    z-index: 100;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    button {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px !important;
      font-size: 1rem !important;
      border-radius: 8px;
    }
  }
`;
