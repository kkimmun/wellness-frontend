import TOP10_ICONS from "./Top10Icons";

export const getTop10IconByPlaceNo = (placeNo) => {
  if (!placeNo) return null;
  const id = String(placeNo);
  if (id === "268" || id === "1") return TOP10_ICONS.park;
  if (id === "269" || id === "4") return TOP10_ICONS.aegibong;
  if (id === "270" || id === "5") return TOP10_ICONS.ship;
  if (id === "271" || id === "7") return TOP10_ICONS.fortress;
  if (id === "272" || id === "8") return TOP10_ICONS.port;
  if (id === "273" || id === "9") return TOP10_ICONS.laveniche;
  if (id === "274" || id === "10") return TOP10_ICONS.tomb;
  if (id === "275" || id === "14") return TOP10_ICONS.art;
  if (id === "276" || id === "178") return TOP10_ICONS.outlet;
  if (id === "277" || id === "1043") return TOP10_ICONS.marina;
  return null;
};

export const getTop10IconByName = (placeName) => {
  if (!placeName) return null;
  const name = String(placeName).replace(/\s+/g, "");
  if (name.includes("함상공원")) return TOP10_ICONS.ship;
  if (name.includes("애기봉")) return TOP10_ICONS.aegibong;
  if (name.includes("문수산성")) return TOP10_ICONS.fortress;
  if (name.includes("대명항")) return TOP10_ICONS.port;
  if (name.includes("라베니체")) return TOP10_ICONS.laveniche;
  if (name.includes("덕포진") || name.includes("장릉")) return TOP10_ICONS.tomb;
  if (name.includes("아트빌리지")) return TOP10_ICONS.art;
  if (name.includes("아울렛") || name.includes("현대프리미엄")) return TOP10_ICONS.outlet;
  if (name.includes("아라마리나")) return TOP10_ICONS.marina;
  if (name.includes("조각공원") || name.includes("태산패밀리")) return TOP10_ICONS.park;
  return null;
};
