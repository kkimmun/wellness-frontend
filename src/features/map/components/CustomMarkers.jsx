import React from "react";
import styled, { keyframes } from "styled-components";
import {
  FaCamera,
  FaDumbbell,
  FaUtensils,
  FaHandsPraying,
  FaPlus,
} from "react-icons/fa6";

const bounceSubtle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const fireworkBurst = keyframes`
  0% { transform: scale(0.8); opacity: 1; border-width: 4px; }
  100% { transform: scale(1.8); opacity: 0; border-width: 0px; }
`;

const MarkerWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    animation: ${bounceSubtle} 0.5s 2;
  }
`;

const RouteMarkerWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  cursor: default;
  margin-bottom: 6px;
`;

// 1. 의료기관
const MedicalBody = styled.div`
  width: 32px;
  height: 32px;
  background-color: #ef4444;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  transform: rotate(45deg);
  z-index: 10;
  position: relative;

  & > div {
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MedicalCross = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M19 10h-5V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
  </svg>
);

export const MedicalMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <MedicalBody>
      <div>
        <MedicalCross />
      </div>
    </MedicalBody>
  </MarkerWrapper>
);

// 2. 주요관광지
const TouristBody = styled.div`
  width: 40px;
  height: 40px;
  background-color: #8b5cf6;
  border-radius: 50% 50% 50% 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  transform: rotate(45deg);
  z-index: 10;
  position: relative;

  & > div {
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const TouristMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <TouristBody>
      <div>
        <FaCamera color="white" size={18} />
      </div>
    </TouristBody>
  </MarkerWrapper>
);

// 3. 생활체육시설
const SportsBody = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
`;

export const SportsMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <SportsBody>
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <polygon
          points="50,8 88,30 88,70 50,92 12,70 12,30"
          fill="#10b981"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FaDumbbell color="white" size={20} />
      </div>
    </SportsBody>
  </MarkerWrapper>
);

// 4. 종교시설
const ReligionBody = styled.div`
  width: 40px;
  height: 40px;
  background-color: #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 10;
  position: relative;
`;

export const ReligionMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <ReligionBody>
      <FaHandsPraying color="white" size={18} />
    </ReligionBody>
  </MarkerWrapper>
);

// 5. 음식점
const FoodBody = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #f97316;
  z-index: 10;
  position: relative;
`;

export const FoodMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <FoodBody>
      <FaUtensils color="#f97316" size={18} />
    </FoodBody>
  </MarkerWrapper>
);

const EventBurst = styled.div`
  position: absolute;
  inset: 0;
  border: 2px dashed #f472b6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${fireworkBurst} 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
  z-index: 0;
`;

const EventBody = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(to top right, #ec4899, #e879f9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 10;
  position: relative;
`;

const FireworkIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 22c0-3 2-4 2-7" strokeDasharray="2 3" />
    <path d="M10 13v-3" />
    <path d="M10 6v-3" />
    <path d="M6 9h-3" />
    <path d="M14 9h3" />
    <path d="M7 6l-2-2" />
    <path d="M13 6l2-2" />
    <path d="M7 12l-2 2" />
    <path d="M13 12l2 2" />
    <path d="M19 6v-1.5" />
    <path d="M19 9.5v-1.5" />
    <path d="M17.5 8h-1.5" />
    <path d="M21 8h-1.5" />
  </svg>
);

export const EventMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <EventBurst />
    <EventBody>
      <FireworkIcon />
    </EventBody>
  </MarkerWrapper>
);

// 7. 경로 (출발/도착)
const RouteBody = styled.div`
  width: 56px;
  height: 56px;
  background-color: #2563eb;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 10;
  position: relative;
`;

const RouteDot = styled.div`
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
`;

export const RouteMarker = ({ onClick }) => (
  <RouteMarkerWrapper onClick={onClick}>
    <RouteBody>
      <RouteDot />
    </RouteBody>
  </RouteMarkerWrapper>
);

// 기존 Top10, General 마커 (임시 유지용)
import { FaAward } from "react-icons/fa";

import TOP10_ICONS, { getTop10IconByName } from "./Top10Icons";

const Top10MarkerBody = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
  filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25)); /* 아이콘 자체에 그림자 추가 */
`;

export const Top10Marker = ({ placeName, onClick }) => {
  const SvgIcon = getTop10IconByName(placeName);

  return (
    <MarkerWrapper onClick={onClick}>
      <Top10MarkerBody>
        {SvgIcon ? (
          SvgIcon
        ) : (
          <div style={{ background: "linear-gradient(to bottom right, #fde047, #f59e0b)", width: "100%", height: "100%", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaAward color="white" size={20} />
          </div>
        )}
      </Top10MarkerBody>
    </MarkerWrapper>
  );
};

const GeneralMarkerBody = styled.div`
  width: 36px;
  height: 36px;
  background-color: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 10;
  position: relative;
  transform: rotate(45deg);
  border-radius: 50% 50% 50% 0.375rem;

  & > div {
    transform: rotate(-45deg);
  }
`;

export const GeneralMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <GeneralMarkerBody>
      <div>
        <FaCamera color="white" size={16} />
      </div>
    </GeneralMarkerBody>
  </MarkerWrapper>
);
