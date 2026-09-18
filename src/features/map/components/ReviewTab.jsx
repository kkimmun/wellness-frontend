import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FaStar, FaArrowDown, FaUserCircle } from "react-icons/fa";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../../context/authContextValue";
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

const ReviewerAvatar = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <FaUserCircle size={40} color="#CCC" aria-label={alt} />;
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
};

const formatDate = (raw) => {
  if (!raw) return "";
  const parsed = new Date(String(raw).replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return String(raw).slice(0, 10);
  return parsed.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const toReview = (dto) => ({
  id: dto.reviewNo,
  memberNo: dto.memberNo,
  userName: dto.nickname || "익명",
  userProfile: dto.profileImgPath || null,
  rating: dto.rating ?? 0,
  date: formatDate(dto.createDate),
  content: dto.reviewContent || "",
  image: Array.isArray(dto.images) && dto.images.length ? dto.images[0] : null,
});

const ReviewTab = ({ place }) => {
  const { status, user } = useAuth();
  const placeNo = place?.placeNo;

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [writeText, setWriteText] = useState("");
  const [writeRating, setWriteRating] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);

  const loaderRef = useRef(null);
  const fileInputRef = useRef(null);
  const writeBoxRef = useRef(null);
  const requestIdRef = useRef(0);

  const currentMemberNo = user?.memberNo ?? null;

  const resetWriteForm = useCallback(() => {
    setWriteText("");
    setWriteRating(0);
    setPreviewImg(null);
    setEditingReviewId(null);
    setIsImageDeleted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const showAlert = useCallback((message) => {
    setAlertMessage(message);
    setIsAlertModalOpen(true);
  }, []);

  const loadPage = useCallback(
    async (targetPage, { append } = {}) => {
      if (!placeNo) return;
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      try {
        const data = await PlaceAPI.getReviews(placeNo, targetPage);
        if (requestId !== requestIdRef.current) return;

        const items = (data?.content || []).map(toReview);
        setReviews((prev) => (append ? [...prev, ...items] : items));
        setSummary(data?.summary || null);
        setPage(data?.currentPage || targetPage);
        setHasNext(Boolean(data?.hasNext));
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        console.error("리뷰 목록을 불러오지 못했습니다.", err);
        if (!append) {
          setReviews([]);
          setSummary(null);
          setHasNext(false);
        }
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [placeNo],
  );

  useEffect(() => {
    if (!placeNo) return;
    loadPage(1);
  }, [placeNo, loadPage]);

  useEffect(() => {
    if (!hasNext || isLoading) return undefined;
    const target = loaderRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPage(page + 1, { append: true });
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNext, isLoading, page, loadPage]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      setIsImageDeleted(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setWriteText(review.content);
    setWriteRating(review.rating);
    setPreviewImg(review.image || null);
    setIsImageDeleted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    writeBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteReview = async () => {
    try {
      await PlaceAPI.deleteReview(placeNo, selectedReviewId);
      setIsDeleteModalOpen(false);
      setSelectedReviewId(null);
      if (editingReviewId === selectedReviewId) resetWriteForm();
      await loadPage(1);
    } catch (err) {
      console.error("리뷰 삭제 실패", err);
      setIsDeleteModalOpen(false);
      showAlert("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      showAlert("로그인 후 이용해주세요.");
      return;
    }
    if (!writeRating) {
      showAlert("평점을 선택해주세요.");
      return;
    }
    if (!placeNo || isSubmitting) return;

    const formData = new FormData();
    formData.append("rating", writeRating);
    formData.append("reviewContent", writeText.trim());

    const selectedFile = fileInputRef.current?.files?.[0];
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (editingReviewId && isImageDeleted) {
      formData.append("image", new Blob([]), "");
    }

    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        await PlaceAPI.updateReview(placeNo, editingReviewId, formData);
        showAlert("리뷰가 수정되었습니다.");
      } else {
        await PlaceAPI.createReview(placeNo, formData);
        showAlert("리뷰가 작성되었습니다.");
      }
      resetWriteForm();
      await loadPage(1);
    } catch (err) {
      console.error("리뷰 처리 실패", err);
      showAlert(err?.message || "리뷰 처리에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = summary?.avgRating ?? place?.avgRating ?? 0;
  const totalReviewCount =
    summary?.totalReviewCount ?? summary?.totalElements ?? reviews.length;

  const ratingChartData = useMemo(() => {
    const dist = summary?.ratingDistribution || {};
    return [1, 2, 3, 4, 5].map((score) => ({
      name: String(score),
      count: Number(dist[score] ?? dist[String(score)] ?? 0),
    }));
  }, [summary]);

  return (
    <ReviewContainer>
      <RatingSummaryBox $hasReviews={totalReviewCount > 0}>
        <div className="avg-rating">
          <FaStar className="star" />
          <span className="score">{Number(avgRating).toFixed(1)}</span>
        </div>
        <div className="rating-graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ratingChartData}
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
            <button className="btn-cancel" onClick={resetWriteForm}>
              취소
            </button>
            <button
              className="btn-submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {editingReviewId ? "수정" : "작성"}
            </button>
          </div>
        </div>
      </ReviewWriteBox>

      <ReviewList>
        {reviews.map((review) => {
          const isLong = review.content.length > 80;
          const isExpanded = expandedIds.has(review.id);
          const displayContent =
            isLong && !isExpanded
              ? review.content.slice(0, 80) + "..."
              : review.content;
          const isMine =
            status === "authenticated" &&
            currentMemberNo != null &&
            String(review.memberNo) === String(currentMemberNo);

          return (
            <ReviewItem key={review.id}>
              <div className="header">
                <div className="user-info">
                  <ReviewerAvatar src={review.userProfile} alt="profile" />
                  <div className="meta">
                    <div className="name-rating">
                      {review.userName}
                      <span className="rating">
                        <FaStar /> {Number(review.rating).toFixed(1)}
                      </span>
                    </div>
                    <span className="date">{review.date}</span>
                  </div>
                </div>
                {isMine && (
                  <div className="edit-actions">
                    <button onClick={() => handleEditClick(review)}>수정</button>
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
              {review.content && (
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
              )}
              {review.image && (
                <img
                  src={review.image}
                  alt="리뷰 첨부 (클릭 시 크게 보기)"
                  className="attached-image"
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxImage(review.image)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLightboxImage(review.image);
                    }
                  }}
                />
              )}
            </ReviewItem>
          );
        })}
      </ReviewList>

      {isLoading && reviews.length === 0 && (
        <LoadingMore>
          <div style={{ color: "#999", fontSize: "13px" }}>
            리뷰를 불러오는 중...
          </div>
        </LoadingMore>
      )}
      {!isLoading && reviews.length === 0 && (
        <LoadingMore>
          <div style={{ color: "#999", fontSize: "13px" }}>
            아직 등록된 리뷰가 없습니다.
          </div>
        </LoadingMore>
      )}
      {hasNext && (
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
      {!hasNext && !isLoading && reviews.length > 0 && (
        <LoadingMore>
          <div style={{ color: "#999", fontSize: "13px" }}>
            마지막 리뷰입니다. (총 {totalReviewCount}개)
          </div>
        </LoadingMore>
      )}

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

      <Modal
        isOpen={isAlertModalOpen}
        icon={FiAlertCircle}
        iconColor="primary"
        showClose={true}
        message={alertMessage}
        onConfirm={() => setIsAlertModalOpen(false)}
      />

      <Modal
        isOpen={!!lightboxImage}
        showClose={true}
        size="image"
        onClose={() => setLightboxImage(null)}
      >
        {lightboxImage && (
          <img
            src={lightboxImage}
            alt="리뷰 이미지 크게 보기"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "80dvh",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        )}
      </Modal>
    </ReviewContainer>
  );
};

export default ReviewTab;
