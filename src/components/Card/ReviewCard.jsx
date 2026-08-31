import React, { useState } from "react";
import {
  ReviewContainer,
  ReviewHeader,
  AuthorInfo,
  ReviewContent,
  ToggleTextButton,
} from "./ReviewCard.styles";

export default function ReviewCard({ author, date, rating, content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 긴 텍스트인지 판별 (간단하게 100자 기준으로 설정)
  const isLongText = content.length > 100;

  return (
    <ReviewContainer>
      <ReviewHeader>
        <AuthorInfo>
          {author} <span className="date">{date}</span>
        </AuthorInfo>
        <div style={{ color: "#FF9500", fontSize: "14px" }}>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
      </ReviewHeader>

      <ReviewContent $isExpanded={isExpanded}>{content}</ReviewContent>

      {isLongText && (
        <ToggleTextButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "접기" : "더 보기"}
        </ToggleTextButton>
      )}
    </ReviewContainer>
  );
}
