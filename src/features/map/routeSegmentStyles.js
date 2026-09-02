export const ROUTE_SEGMENT_COLORS = {
  WALKING: "#6B7280",
  CITY_BUS: "#2E8B57",
  GENERAL_BUS: "#1565C0",
  EXPRESS_BUS: "#D32F2F",
  SUBWAY: "#7B1FA2",
};

export const ROUTE_SEGMENT_LEGEND = [
  { key: "WALKING", label: "도보", color: ROUTE_SEGMENT_COLORS.WALKING, dashed: true },
  { key: "CITY_BUS", label: "시내·마을버스", color: ROUTE_SEGMENT_COLORS.CITY_BUS },
  { key: "GENERAL_BUS", label: "일반·간선버스", color: ROUTE_SEGMENT_COLORS.GENERAL_BUS },
  { key: "EXPRESS_BUS", label: "광역·직행버스", color: ROUTE_SEGMENT_COLORS.EXPRESS_BUS },
  { key: "SUBWAY", label: "지하철(노선색)", color: ROUTE_SEGMENT_COLORS.SUBWAY },
];

const SUBWAY_LINE_COLORS = [
  { names: ["김포골드", "김포 골드"], color: "#A17800" },
  { names: ["인천1호선", "인천 1호선"], color: "#7CA8D5" },
  { names: ["인천2호선", "인천 2호선"], color: "#ED8B00" },
  { names: ["신분당"], color: "#D4003B" },
  { names: ["수인분당", "분당선"], color: "#F5A200" },
  { names: ["경의중앙", "경의·중앙"], color: "#77C4A3" },
  { names: ["공항철도", "AREX"], color: "#0090D2" },
  { names: ["경춘"], color: "#0C8E72" },
  { names: ["서해"], color: "#8FC31F" },
  { names: ["경강"], color: "#0054A6" },
  { names: ["GTX-A", "GTXA"], color: "#9A6292" },
  { names: ["1호선", "서울1호선"], color: "#0052A4" },
  { names: ["2호선", "서울2호선"], color: "#00A84D" },
  { names: ["3호선", "서울3호선"], color: "#EF7C1C" },
  { names: ["4호선", "서울4호선"], color: "#00A5DE" },
  { names: ["5호선", "서울5호선"], color: "#996CAC" },
  { names: ["6호선", "서울6호선"], color: "#CD7C2F" },
  { names: ["7호선", "서울7호선"], color: "#747F00" },
  { names: ["8호선", "서울8호선"], color: "#E6186C" },
  { names: ["9호선", "서울9호선"], color: "#8E7645" },
];

const includesAny = (source, keywords) =>
  keywords.some((keyword) => source.includes(keyword));

const subwayColor = (step) => {
  const names = (step.vehicleNames || []).join(" ").replaceAll(" ", "");
  const matchedLine = SUBWAY_LINE_COLORS.find(({ names: aliases }) =>
    aliases.some((alias) => names.includes(alias.replaceAll(" ", ""))),
  );
  return matchedLine?.color || ROUTE_SEGMENT_COLORS.SUBWAY;
};

const busStyle = (step) => {
  const description = [...(step.vehicleTypes || []), ...(step.vehicleNames || [])]
    .join(" ")
    .toUpperCase();

  if (
    includesAny(description, ["광역", "직행", "급행", "공항", "M버스"]) ||
    /(^|\s)M\d+/.test(description)
  ) {
    return {
      key: "EXPRESS_BUS",
      label: "광역·직행버스",
      color: ROUTE_SEGMENT_COLORS.EXPRESS_BUS,
      strokeStyle: "solid",
    };
  }

  if (includesAny(description, ["마을", "지선", "순환", "시내"])) {
    return {
      key: "CITY_BUS",
      label: "시내·마을버스",
      color: ROUTE_SEGMENT_COLORS.CITY_BUS,
      strokeStyle: "solid",
    };
  }

  return {
    key: "GENERAL_BUS",
    label: "일반·간선버스",
    color: ROUTE_SEGMENT_COLORS.GENERAL_BUS,
    strokeStyle: "solid",
  };
};

export const getRouteSegmentStyle = (step) => {
  if (step?.type === "BUS") return busStyle(step);

  if (step?.type === "SUBWAY") {
    return {
      key: "SUBWAY",
      label: "지하철",
      color: subwayColor(step),
      strokeStyle: "solid",
    };
  }

  return {
    key: "WALKING",
    label: "도보",
    color: ROUTE_SEGMENT_COLORS.WALKING,
    strokeStyle: "shortdash",
  };
};
