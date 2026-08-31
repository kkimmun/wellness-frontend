import React, { useState } from "react";
import { RatingContainer, StarIcon } from "./StarRating.styles";

export default function StarRating({ rating = 0, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <RatingContainer onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isActive = starValue <= (hoverRating || rating);

        return (
          <StarIcon
            key={starValue}
            $active={isActive}
            onMouseEnter={() => setHoverRating(starValue)}
            onClick={() => onRatingChange(starValue)}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </StarIcon>
        );
      })}
    </RatingContainer>
  );
}
