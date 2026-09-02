import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
} from "react-icons/fa";
import { InfoSection, InfoRow, BottomArea } from "./DetailPanel.styles";

const BasicInfoTab = ({ place }) => {
  return (
    <>
      <InfoSection>
        <InfoRow>
          <div className="label-group">
            <FaMapMarkerAlt />
            <span>주소</span>
          </div>
          <div className="value-group">
            <div className="addr-line">
              <span className="type">도로명</span>
              <span>{place?.addr || "-"}</span>
            </div>
            <div className="addr-line">
              <span className="type">지번</span>
              <span>{place?.addrDetail || "-"}</span>
            </div>
          </div>
        </InfoRow>

        <InfoRow>
          <div className="label-group">
            <FaPhoneAlt size={13} />
            <span>전화번호</span>
          </div>
          <div className="value-group">
            <span>{place?.phone || "031-984-2897"}</span>
          </div>
        </InfoRow>

        <InfoRow>
          <div className="label-group">
            <FaRegClock />
            <span>운영시간</span>
          </div>
          <div className="value-group">
            <span>07:00~17:00 (월요일 휴무)</span>
          </div>
        </InfoRow>
      </InfoSection>

      <BottomArea>
        <div className="tags">
          <div className="tag"># 가족동반</div>
          <div className="tag"># 역사문화</div>
        </div>
        <button className="route-btn">경로찾기</button>
      </BottomArea>
    </>
  );
};

export default BasicInfoTab;
