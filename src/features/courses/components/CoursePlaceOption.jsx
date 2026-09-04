import { useState } from "react";
import { FiCheck, FiImage, FiMapPin } from "react-icons/fi";
import { ChoiceRow, PlaceChoiceImage, PlaceChoiceInfo } from "./CustomCoursePanel.styles";

export default function CoursePlaceOption({ place, index, type, name, checked, disabled = false, onChange }) {
  const [failedImage, setFailedImage] = useState(null);
  const imageUrl = place.imageUrl;
  const description = place.placeDescription || place.description;
  const address = place.addr || place.address;

  return (
    <ChoiceRow $disabled={disabled}>
      <input
        type={type}
        name={name}
        value={place.placeNo}
        aria-label={place.placeName}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="check" aria-hidden="true"><FiCheck /></span>
      <PlaceChoiceImage>
        {imageUrl && failedImage !== imageUrl ? (
          <img
            src={imageUrl}
            alt={`${place.placeName} 사진`}
            loading="lazy"
            onError={() => setFailedImage(imageUrl)}
          />
        ) : (
          <span className="placeholder"><FiImage aria-hidden="true" /><span>사진 준비 중</span></span>
        )}
        <span className="number" aria-hidden="true">{index + 1}</span>
      </PlaceChoiceImage>
      <PlaceChoiceInfo>
        <strong>{place.placeName}</strong>
        {address && <span className="address"><FiMapPin aria-hidden="true" />{address}</span>}
        <span className="description" title={description || undefined}>
          {description || "등록된 설명이 없습니다."}
        </span>
        {Number.isFinite(place.distance) && (
          <span className="distance">
            {place.distance >= 1000 ? `${(place.distance / 1000).toFixed(1)}km` : `${Math.round(place.distance)}m`}
          </span>
        )}
      </PlaceChoiceInfo>
    </ChoiceRow>
  );
}
