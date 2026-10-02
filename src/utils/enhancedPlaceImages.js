import credits from "./top10ImageCredits.json";

const imagesBySource = new Map(credits.map((image) => [image.originalUrl, image]));

export function getEnhancedPlaceImage(source) {
  return imagesBySource.get(source?.trim());
}

export function resolvePlaceImage(source) {
  return getEnhancedPlaceImage(source)?.url || source;
}

export const top10ImageCredits = credits;
