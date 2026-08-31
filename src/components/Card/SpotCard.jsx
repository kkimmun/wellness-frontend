import React from "react";
import { TagBadge } from "../Badge/Badge.styles";
import {
  SpotCardContainer,
  SpotImage,
  SpotInfo,
  SpotHeader,
  SpotTitle,
  SpotRating,
  TagList,
} from "./SpotCard.styles";

export default function SpotCard({
  title,
  imageUrl,
  rating,
  reviewCount,
  tags,
  onClick,
}) {
  return (
    <SpotCardContainer onClick={onClick}>
      <SpotImage $src={imageUrl} />
      <SpotInfo>
        <SpotHeader>
          <SpotTitle>{title}</SpotTitle>
          <SpotRating>
            ★ {rating} <span>({reviewCount})</span>
          </SpotRating>
        </SpotHeader>

        {tags && tags.length > 0 && (
          <TagList>
            {tags.map((tag, idx) => (
              <TagBadge key={idx}>#{tag}</TagBadge>
            ))}
          </TagList>
        )}
      </SpotInfo>
    </SpotCardContainer>
  );
}
