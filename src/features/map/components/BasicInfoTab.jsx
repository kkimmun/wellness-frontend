import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { InfoSection, InfoRow, BottomArea } from "./DetailPanel.styles";

// 계획 모드 연동: 기존 경로찾기 버튼을 그대로 유지하면서 계획 화면에서만 버튼 문구와 동작을 바꾼다.
const BasicInfoTab = ({ place, onFindRoute, actionLabel = "경로찾기" }) => {
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

        {/* 장소 상세 개선: DB 설명을 표시하고 비어 있으면 명확한 빈 상태 문구를 제공한다. */}
        <InfoRow>
          <div className="label-group">
            <FaInfoCircle size={14} />
            <span>설명</span>
          </div>
          <div className="value-group description-group">
            {place?.placeDescription?.trim() || "등록된 내용이 없습니다."}
          </div>
        </InfoRow>
      </InfoSection>

      <BottomArea>
        <div className="tags" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {place?.tags?.length > 0 ? (
            place.tags.map((tag, idx) => {
              const tagLabel = typeof tag === "string"
                ? tag
                : tag.tagContent || tag.tagName || "";

              return tagLabel ? (
                <div key={tag.tagNo ?? idx} className="tag" style={{ padding: "4px 8px", backgroundColor: "#f0f0f0", borderRadius: "12px", fontSize: "12px", color: "#666" }}>
                  # {tagLabel}
                </div>
              ) : null;
            })
          ) : null}
        </div>
        <button
          className="route-btn"
          onClick={() => onFindRoute(place)}
          disabled={!place || !onFindRoute}
        >
          {actionLabel}
        </button>
      </BottomArea>
    </>
  );
};

export default BasicInfoTab;
