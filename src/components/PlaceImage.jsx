import { useState } from "react";
import { getDefaultPlaceImage, isDefaultPlaceImage } from "../utils/placeImage";
import { getEnhancedPlaceImage } from "../utils/enhancedPlaceImages";

export default function PlaceImage({ src, place, alt = "장소 이미지", ...props }) {
  const [failedSources, setFailedSources] = useState([]);
  const source = src?.trim();
  const enhanced = getEnhancedPlaceImage(source);
  const imageUrl = [enhanced?.url, source].find((url) => url && !failedSources.includes(url))
    || getDefaultPlaceImage(place);
  const isDefault = isDefaultPlaceImage(imageUrl);
  const isEnhanced = enhanced?.enhanced && imageUrl === enhanced.url;

  return <img {...props} src={imageUrl}
    alt={isDefault ? `${alt} (공통 일러스트)` : alt}
    title={isDefault ? "AI 생성 공통 일러스트 · 실제 장소 사진 아님"
      : isEnhanced ? "원본 사진을 AI로 업스케일링했습니다. 세부 표현은 원본과 차이가 있을 수 있습니다." : props.title}
    onError={() => {
      if (imageUrl !== getDefaultPlaceImage(place)) {
        setFailedSources((failed) => failed.includes(imageUrl) ? failed : [...failed, imageUrl]);
      }
    }} />;
}
