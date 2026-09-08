import { useState } from "react";
import { getDefaultPlaceImage, isDefaultPlaceImage } from "../utils/placeImage";

export default function PlaceImage({ src, place, alt = "장소 이미지", ...props }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = src?.trim();
  const imageUrl = source && failedSource !== source ? source : getDefaultPlaceImage(place);
  const isDefault = isDefaultPlaceImage(imageUrl);
  return <img {...props} src={imageUrl}
    alt={isDefault ? `${alt} (공통 일러스트)` : alt}
    title={isDefault ? "AI 생성 공통 일러스트 · 실제 장소 사진 아님" : undefined}
    onError={() => { if (source && imageUrl === source) setFailedSource(source); }} />;
}
