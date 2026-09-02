import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaThumbsUp, FaArrowDown } from "react-icons/fa";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../../context/AuthContext";
import { Modal } from "../../../components/Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { PlaceAPI } from "../../../api/place";
import {
  ReviewContainer,
  RatingSummaryBox,
  ReviewWriteBox,
  ReviewList,
  ReviewItem,
  LoadingMore,
} from "./ReviewTab.styles";
import { reviewRatingData, getMockImage, mockReviews } from "../mockData";

// 임시 데이터는 mockData.js 로 분리되었습니다.

const ReviewTab = ({ place }) => {
  const { status } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [writeText, setWriteText] = useState("");
  const [writeRating, setWriteRating] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [mockLoadCount, setMockLoadCount] = useState(0); // 가짜 데이터 추가 횟수 제한용

  useEffect(() => {
    setReviews(mockReviews);
    setExpandedIds(new Set());
    setHasMore(true);
    setMockLoadCount(0);
    setIsLoading(false);

    setWriteText("");
    setWriteRating(0);
    setPreviewImg(null);
    setEditingReviewId(null);
    setIsImageDeleted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [place?.placeNo]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loaderRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImg(url);
      setIsImageDeleted(false);
    }
  };

  const writeBoxRef = useRef(null);

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setWriteText(review.content);
    setWriteRating(review.rating);
    setPreviewImg(review.image || null);
    setIsImageDeleted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (writeBoxRef.current) {
      writeBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleDeleteReview = async () => {
    try {
      const reviewToDelete = reviews.find((r) => r.id === selectedReviewId);
      if (!reviewToDelete?.isMock) {
        await PlaceAPI.deleteReview(place.placeNo, selectedReviewId);
      }
      setReviews((prev) => prev.filter((r) => r.id !== selectedReviewId));
      setIsDeleteModalOpen(false);
      setSelectedReviewId(null);
    } catch (err) {
      setAlertMessage("리뷰 삭제에 실패했습니다.");
      setIsAlertModalOpen(true);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);

          setTimeout(() => {
            setReviews((prev) => {
              const newItems = [
                {
                  id: prev.length + 1,
                  userName: `User ${prev.length + 1}`,
                  userProfile:
                    "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=U",
                  rating: 4.0,
                  date: "2026. 08. 31",
                  content:
                    "무한 스크롤 테스트용으로 추가된 리뷰입니다. 100자가 넘어가도록 글을 길게 작성해봅니다. 내용이 너무 길어지면 숨김 처리가 되고 더보기 버튼을 누르면 전체 내용이 보이게 됩니다.",
                  image:
                    prev.length % 2 === 0 ? getMockImage(prev.length) : null,
                  likes: 0,
                  isMine: false,
                  isMock: true,
                },
              ];
              return [...prev, ...newItems];
            });

            setIsLoading(false);
            setMockLoadCount((prev) => {
              const nextCount = prev + 1;
              if (nextCount >= 3) {
                setHasMore(false);
              }
              return nextCount;
            });
          }, 1000);
        }
      },
      { threshold: 1.0 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isLoading, hasMore, mockLoadCount]);

  return (
    <ReviewContainer>
      {/* 평점 요약 */}
      <RatingSummaryBox>
        <div className="avg-rating">
          <FaStar className="star" />
          <span className="score">{place?.avgRating?.toFixed(1) || "4.8"}</span>
        </div>
        <div className="rating-graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ratingData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FFC107"
                strokeWidth={3}
                dot={{ r: 4, fill: "#FFC107", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </RatingSummaryBox>

      {/* 리뷰 작성 */}
      <ReviewWriteBox ref={writeBoxRef}>
        <div className="header">
          <h3>{editingReviewId ? "리뷰 수정하기" : "리뷰 남기기"}</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={star <= writeRating ? "active" : ""}
                onClick={() => setWriteRating(star)}
              />
            ))}
          </div>
        </div>
        <textarea
          placeholder="이곳에서 어떤 경험을 하셨나요?"
          value={writeText}
          onChange={(e) => setWriteText(e.target.value)}
        />
        <div className="bottom-actions">
          <div className="left-col">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 업로드
            </button>
            {previewImg && (
              <div className="preview-box">
                <img src={previewImg} alt="preview" />
                <button
                  className="delete-preview"
                  onClick={() => {
                    setPreviewImg(null);
                    setIsImageDeleted(true);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div className="btn-group">
            <button
              className="btn-cancel"
              onClick={() => {
                setWriteText("");
                setWriteRating(0);
                setPreviewImg(null);
                setEditingReviewId(null);
                setIsImageDeleted(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              취소
            </button>
            <button
              className="btn-submit"
              onClick={async () => {
                if (status === "unauthenticated") {
                  setAlertMessage("로그인 후 이용해주세요.");
                  setIsAlertModalOpen(true);
                  return;
                }
                if (!writeText.trim()) {
                  setAlertMessage("리뷰 내용을 입력해주세요.");
                  setIsAlertModalOpen(true);
                  return;
                }

                const formData = new FormData();
                formData.append("rating", writeRating);
                formData.append("reviewContent", writeText);

                if (fileInputRef.current && fileInputRef.current.files[0]) {
                  formData.append("images", fileInputRef.current.files[0]);
                } else if (editingReviewId && isImageDeleted) {
                  formData.append("isImageDeleted", true);
                }

                try {
                  if (editingReviewId) {
                    const reviewToEdit = reviews.find(
                      (r) => r.id === editingReviewId,
                    );
                    let response = null;

                    if (!reviewToEdit?.isMock) {
                      response = await PlaceAPI.updateReview(
                        place.placeNo,
                        editingReviewId,
                        formData,
                      );
                    }

                    const finalImageUrl = response?.imageUrl || previewImg;

                    setReviews((prev) =>
                      prev.map((r) => {
                        if (r.id === editingReviewId) {
                          let newImage = r.image;
                          if (isImageDeleted) {
                            newImage = null;
                          } else if (response?.imageUrl) {
                            newImage = response.imageUrl;
                          } else if (fileInputRef.current?.files[0]) {
                            newImage = previewImg;
                          }

                          return {
                            ...r,
                            content: writeText,
                            rating: writeRating,
                            image: newImage,
                          };
                        }
                        return r;
                      }),
                    );

                    setAlertMessage("리뷰 수정 성공");
                  } else {
                    let response = null;
                    if (place?.placeNo) {
                      response = await PlaceAPI.createReview(
                        place.placeNo,
                        formData,
                      );
                    }

                    const newReview = {
                      id: response?.reviewNo || Date.now(), // 실제 API 응답 ID 혹은 임시 ID
                      userName: "나(새로 작성)",
                      userProfile:
                        "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=ME",
                      rating: writeRating,
                      date: new Date().toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }),
                      content: writeText,
                      image: response?.imageUrl || previewImg, // 서버 이미지 혹은 로컬 미리보기
                      likes: 0,
                      isMine: true,
                      isMock: false,
                    };

                    setReviews((prev) => [newReview, ...prev]);
                    setAlertMessage("리뷰가 작성되었습니다.");
                  }

                  setIsAlertModalOpen(true);

                  setEditingReviewId(null);
                  setWriteText("");
                  setWriteRating(0);
                  setPreviewImg(null);
                  setIsImageDeleted(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                } catch (err) {
                  setAlertMessage("리뷰 처리에 실패했습니다.");
                  setIsAlertModalOpen(true);
                }
              }}
            >
              {editingReviewId ? "수정" : "작성"}
            </button>
          </div>
        </div>
      </ReviewWriteBox>

      {/* 리뷰 목록 */}
      <ReviewList>
        {reviews.map((review) => {
          const isLong = review.content.length > 80;
          const isExpanded = expandedIds.has(review.id);
          const displayContent =
            isLong && !isExpanded
              ? review.content.slice(0, 80) + "..."
              : review.content;

          return (
            <ReviewItem key={review.id}>
              <div className="header">
                <div className="user-info">
                  <img src={review.userProfile} alt="profile" />
                  <div className="meta">
                    <div className="name-rating">
                      {review.userName}
                      <span className="rating">
                        <FaStar /> {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="date">{review.date}</span>
                  </div>
                </div>
                {review.isMine && (
                  <div className="edit-actions">
                    <button onClick={() => handleEditClick(review)}>
                      수정
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="content">
                {displayContent}
                {isLong && !isExpanded && (
                  <span
                    className="more-btn"
                    onClick={() => toggleExpand(review.id)}
                  >
                    더 보기
                  </span>
                )}
              </div>
              {review.image && (
                <img
                  src={review.image}
                  alt="리뷰 첨부"
                  className="attached-image"
                />
              )}
              <div className="footer">
                <button
                  className="like-btn"
                  onClick={() => {
                    if (status === "unauthenticated") {
                      setAlertMessage("로그인 후 이용해주세요.");
                      setIsAlertModalOpen(true);
                      return;
                    }
                    // 임시 좋아요 로직
                    setReviews((prev) =>
                      prev.map((r) =>
                        r.id === review.id ? { ...r, likes: r.likes + 1 } : r,
                      ),
                    );
                  }}
                >
                  <FaThumbsUp /> {review.likes}
                </button>
              </div>
            </ReviewItem>
          );
        })}
      </ReviewList>

      {/* 무한 스크롤 로더 */}
      {hasMore && (
        <LoadingMore ref={loaderRef}>
          <button className="more-btn" disabled={isLoading}>
            {isLoading ? (
              "리뷰 불러오는 중..."
            ) : (
              <>
                아래로 스크롤하여 더보기 <FaArrowDown />
              </>
            )}
          </button>
        </LoadingMore>
      )}
      {!hasMore && reviews.length > 0 && (
        <LoadingMore>
          <div style={{ color: "#999", fontSize: "13px" }}>
            마지막 리뷰입니다.
          </div>
        </LoadingMore>
      )}

      {/* 리뷰 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        icon={FiAlertCircle}
        iconColor="danger"
        showClose={true}
        message="작성한 리뷰를 삭제하시겠습니까?"
        confirmText="취소"
        cancelText="예"
        confirmVariant="danger"
        cancelVariant="secondary"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          setSelectedReviewId(null);
        }}
        onCancel={handleDeleteReview}
      />

      {/* 공통 알림 모달 */}
      <Modal
        isOpen={isAlertModalOpen}
        icon={FiAlertCircle}
        iconColor="primary"
        showClose={true}
        message={alertMessage}
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </ReviewContainer>
  );
};

export default ReviewTab;
