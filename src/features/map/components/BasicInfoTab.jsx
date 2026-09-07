import {
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { InfoSection, InfoRow, BottomArea } from "./DetailPanel.styles";

// 길찾기 기능 연동: 상세 화면의 장소를 목적지로 전달하기 위해 onFindRoute를 받는다.
const BasicInfoTab = ({ place, onFindRoute }) => {
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
            {place?.addrDetail && (
              <div className="addr-line">
                <span className="type">상세</span>
                <span>{place.addrDetail}</span>
              </div>
            )}
          </div>
        </InfoRow>

        {/* DB 지도 핀 연동: DB에 등록된 전화번호를 표시하고 임의 번호·운영시간은 사용하지 않는다. */}
        {(place?.phoneNumber || place?.phone) && (
          <InfoRow>
            <div className="label-group">
              <FaPhoneAlt size={13} />
              <span>전화번호</span>
            </div>
            <div className="value-group">
              <span>{place.phoneNumber || place.phone}</span>
            </div>
          </InfoRow>
        )}
      </InfoSection>

      <BottomArea>
        <div className="tags" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {place?.tags?.length > 0 ? (
            place.tags.map((tag, idx) => (
              <div key={idx} className="tag" style={{ padding: "4px 8px", backgroundColor: "#f0f0f0", borderRadius: "12px", fontSize: "12px", color: "#666" }}>
                # {tag.tagName || tag}
              </div>
            ))
          ) : null}
        </div>
        <button
          className="route-btn"
          onClick={() => onFindRoute(place)}
          disabled={!place}
        >
          경로찾기
        </button>
      </BottomArea>
    </>
  );
};

export default BasicInfoTab;
