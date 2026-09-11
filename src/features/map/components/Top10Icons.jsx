import { useId } from "react";
import markerSheet from "../../../assets/icons/top10-markers-reference.png";

// 제공받은 원본 시트의 큰 핀만 표시한다. 원본 파일은 재가공하지 않는다.
// SVG 클리핑으로 핀 바깥 배경과 아래 지도 예시가 지도 위에 보이지 않게 한다.
const Top10Illustration = ({ x, y, name, number }) => {
  const clipId = `top10-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 260 290"
      width="100%"
      height="100%"
      role="img"
      aria-label={`김포 TOP 10 · ${name}`}
      data-top10-number={number}
      style={{ display: "block", overflow: "hidden" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M130 5 C59 5 5 58 5 132 C5 186 29 219 69 250 L120 282 Q130 291 140 282 L190 242 C230 209 255 179 255 132 C255 58 201 5 130 5 Z" />
        </clipPath>
      </defs>
      <image
        href={markerSheet}
        x={-x}
        y={-y}
        width="1536"
        height="1024"
        preserveAspectRatio="none"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
};

// 번호는 여행 방문 순서가 아니라 제공된 TOP 10 디자인의 고정 번호다.
const TOP10_ICONS = {
  art: <Top10Illustration x={43} y={38} number={1} name="김포 아트빌리지" />,
  park: <Top10Illustration x={338} y={38} number={2} name="김포국제조각공원" />,
  ship: <Top10Illustration x={636} y={38} number={3} name="김포함상공원" />,
  tomb: <Top10Illustration x={936} y={38} number={4} name="김포 장릉" />,
  laveniche: <Top10Illustration x={1235} y={38} number={5} name="라베니체" />,
  marina: <Top10Illustration x={43} y={519} number={6} name="김포 아라마리나" />,
  port: <Top10Illustration x={338} y={519} number={7} name="대명항" />,
  outlet: <Top10Illustration x={636} y={519} number={8} name="김포 현대 프리미엄 아울렛" />,
  fortress: <Top10Illustration x={936} y={519} number={9} name="문수산성" />,
  aegibong: <Top10Illustration x={1235} y={519} number={10} name="애기봉평화생태공원" />,
};

export const getTop10IconByPlaceNo = (placeNo) => {
  if (!placeNo) return null;
  const id = String(placeNo);
  if (id === "268" || id === "1") return TOP10_ICONS["park"];
  if (id === "269" || id === "4") return TOP10_ICONS["aegibong"];
  if (id === "270" || id === "5") return TOP10_ICONS["ship"];
  if (id === "271" || id === "7") return TOP10_ICONS["fortress"];
  if (id === "272" || id === "8") return TOP10_ICONS["port"];
  if (id === "273" || id === "9") return TOP10_ICONS["laveniche"];
  if (id === "274" || id === "10") return TOP10_ICONS["tomb"];
  if (id === "275" || id === "14") return TOP10_ICONS["art"];
  if (id === "276" || id === "178") return TOP10_ICONS["outlet"];
  if (id === "277" || id === "1043") return TOP10_ICONS["marina"];
  return null;
};

export const getTop10IconByName = (placeName) => {
  if (!placeName) return null;
  const name = String(placeName).replace(/\s+/g, "");
  if (name.includes("함상공원")) return TOP10_ICONS["ship"];
  if (name.includes("애기봉")) return TOP10_ICONS["aegibong"];
  if (name.includes("문수산성")) return TOP10_ICONS["fortress"];
  if (name.includes("대명항")) return TOP10_ICONS["port"];
  if (name.includes("라베니체")) return TOP10_ICONS["laveniche"];
  if (name.includes("덕포진") || name.includes("장릉")) return TOP10_ICONS["tomb"];
  if (name.includes("아트빌리지")) return TOP10_ICONS["art"];
  if (name.includes("아울렛") || name.includes("현대프리미엄")) return TOP10_ICONS["outlet"];
  if (name.includes("아라마리나")) return TOP10_ICONS["marina"];
  if (name.includes("조각공원") || name.includes("태산패밀리")) return TOP10_ICONS["park"];
  return null;
};

export default TOP10_ICONS;
