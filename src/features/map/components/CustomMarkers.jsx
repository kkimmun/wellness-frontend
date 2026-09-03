import React from "react";
import styled, { keyframes } from "styled-components";
import { FaAward, FaCamera } from "react-icons/fa";

const bounceSubtle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const ping = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  75%, 100% { transform: scale(2); opacity: 0; }
`;

const MarkerWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;

  &:hover {
    animation: ${bounceSubtle} 0.5s infinite;
  }
`;

const Top10MarkerBody = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(to bottom right, #fde047, #f59e0b);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
  border: 3px solid white;
  z-index: 10;
  position: relative;
`;

const GeneralMarkerBody = styled.div`
  width: 44px;
  height: 44px;
  background-color: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
  border: 2px solid white;
  z-index: 10;
  position: relative;
  transform: rotate(45deg);
  border-radius: 50% 50% 50% 0.375rem;

  & > div {
    transform: rotate(-45deg);
  }
`;

export const Top10Marker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <Top10MarkerBody>
      <FaAward color="white" size={24} />
    </Top10MarkerBody>
  </MarkerWrapper>
);

export const GeneralMarker = ({ onClick }) => (
  <MarkerWrapper onClick={onClick}>
    <GeneralMarkerBody>
      <div>
        <FaCamera color="white" size={20} />
      </div>
    </GeneralMarkerBody>
  </MarkerWrapper>
);
