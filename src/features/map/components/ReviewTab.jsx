import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaThumbsUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { Modal } from '../../../components/Modal/Modal';
import { FiAlertCircle } from 'react-icons/fi';
import { PlaceAPI } from '../../../api/place';
import {
  ReviewContainer,
  RatingSummaryBox,
  ReviewWriteBox,
  ReviewList,
  ReviewItem,
  LoadingMore
} from './ReviewTab.styles';

// ... (가짜 이미지 로직 그대로)

const ratingData = [
  { name: '1', count: 5 },
  { name: '2', count: 12 },
  { name: '3', count: 25 },
  { name: '4', count: 80 },
  { name: '5', count: 150 }
];

// 가짜 이미지 제너레이터 (네트워크 에러 방지)
const getMockImage = (num) => `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23B3E5FC'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20font-family='sans-serif'%20font-size='24px'%20font-weight='bold'%20fill='%230288D1'%3EReview%20Image%20${num}%3C/text%3E%3C/svg%3E`;

const mockReviews = [
  {
    id: 1,
    userName: "웰니스",
    userProfile: "https://via.placeholder.com/40/81D4FA/FFFFFF?text=W",
    rating: 4.5,
    date: "2026. 06. 21",
    content: "김포 장릉에 다녀왔는데 생각보다 훨씬 여유롭고 좋았어요. 푸릇한 나무들 사이로 조용히 걸을 수 있어서 복잡한 도심에서 잠시 벗어난 기분이었습니다. 왕릉의 분위기도 차분하고 잘돈되어 있어서 산책하면서 역사적인 공간을 함께 느낄 수 있었어요. 날씨 좋은 날 천천히 둘러보기 좋은 곳이라 추천합니다.",
    likes: 5,
    isMine: true
  },
  {
    id: 2,
    userName: "GitCommit",
    userProfile: "https://via.placeholder.com/40/FFB300/FFFFFF?text=G",
    rating: 3.5,
    date: "2026. 06. 21",
    content: "김포 장릉에 방문했는데 전체적으로 조용하고 고즈넉한 분위기가 마음에 들었어요. 주변 숲길을 따라 천천히 걷기 좋고, 역사적인 공간을 직접 둘러보는 재미도 있었습니다. 다만 생각보다 규모가 크지 않아서 오래 머물러 구경하기에는 조금 아쉬웠어요. 그래도 가볍게 산책하면서 여유롭게 시간을 보내기 좋습니다.",
    image: getMockImage(1),
    likes: 3,
    isMine: false
  }
];

const ReviewTab = ({ place }) => {
  const { status } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [expandedIds, setExpandedIds] = useState(new Set());
  
  const [writeText, setWriteText] = useState("");
  const [writeRating, setWriteRating] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const loaderRef = useRef(null);
  const fileInputRef = useRef(null);

  // 더 보기 토글
  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImg(url);
      setIsImageDeleted(false); // 새 사진을 올렸으므로 삭제 상태 해제
    }
  };

  const writeBoxRef = useRef(null);

  // 리뷰 수정 버튼 핸들러
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setWriteText(review.content);
    setWriteRating(review.rating);
    setPreviewImg(review.image || null);
    setIsImageDeleted(false); // 수정 진입 시 초기화
    
    if (writeBoxRef.current) {
      writeBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async () => {
    try {
      await PlaceAPI.deleteReview(place.placeNo, selectedReviewId);
      setReviews(prev => prev.filter(r => r.id !== selectedReviewId));
      setIsDeleteModalOpen(false);
      setSelectedReviewId(null);
    } catch (err) {
      setAlertMessage("리뷰 삭제에 실패했습니다.");
      setIsAlertModalOpen(true);
      setIsDeleteModalOpen(false);
    }
  };

  // 무한 스크롤 옵저버 (가짜 데이터 추가)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setReviews((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                userName: `User ${prev.length + 1}`,
                userProfile: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=U",
                rating: 4.0,
                date: "2026. 08. 31",
                content: "무한 스크롤 테스트용으로 추가된 리뷰입니다. 100자가 넘어가도록 글을 길게 작성해봅니다. 내용이 너무 길어지면 숨김 처리가 되고 더보기 버튼을 누르면 전체 내용이 보이게 됩니다. 이 로직이 잘 동작하는지 확인하기 위해 일부러 길게 씁니다.",
                image: (prev.length % 2 === 0) ? getMockImage(prev.length) : null,
                likes: 0,
                isMine: false
              }
            ]);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
            <LineChart data={ratingData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#333', fontWeight: 'bold' }} />
              <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              <Line type="monotone" dataKey="count" stroke="#FFC107" strokeWidth={3} dot={{ r: 4, fill: '#FFC107', strokeWidth: 0 }} activeDot={{ r: 6 }} />
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
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
              파일 업로드
            </button>
            {previewImg && (
              <div className="preview-box">
                <img src={previewImg} alt="preview" />
                <button className="delete-preview" onClick={() => {
                  setPreviewImg(null);
                  setIsImageDeleted(true); // 기존 이미지 삭제 의도 기록
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}>X</button>
              </div>
            )}
          </div>
          <div className="btn-group">
            <button className="btn-cancel" onClick={() => { 
              setWriteText(""); 
              setWriteRating(0); 
              setPreviewImg(null); 
              setEditingReviewId(null);
              setIsImageDeleted(false);
            }}>취소</button>
            <button className="btn-submit" onClick={async () => {
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
                // 수정을 하면서 사진을 안 올렸지만 기존 사진을 지웠을 때
                formData.append("isImageDeleted", true);
              }

              try {
                if (editingReviewId) {
                  await PlaceAPI.updateReview(place.placeNo, editingReviewId, formData);
                  
                  // 로컬 상태 업데이트
                  setReviews(prev => prev.map(r => r.id === editingReviewId ? {
                    ...r,
                    content: writeText,
                    rating: writeRating,
                    image: previewImg
                  } : r));
                  
                  setAlertMessage("리뷰 수정 성공");
                } else {
                  // 생성 로직 (API 연동 시 추가)
                  alert("리뷰 작성(생성) API 호출");
                  setAlertMessage("리뷰가 작성되었습니다.");
                }
                
                setIsAlertModalOpen(true);
                
                // 폼 초기화
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
            }}>
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
          const displayContent = (isLong && !isExpanded) ? review.content.slice(0, 80) + '...' : review.content;

          return (
            <ReviewItem key={review.id}>
              <div className="header">
                <div className="user-info">
                  <img src={review.userProfile} alt="profile" />
                  <div className="meta">
                    <div className="name-rating">
                      {review.userName}
                      <span className="rating"><FaStar /> {review.rating.toFixed(1)}</span>
                    </div>
                    <span className="date">{review.date}</span>
                  </div>
                </div>
                {review.isMine && (
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
              <div className="content">
                {displayContent}
                {isLong && !isExpanded && (
                  <span className="more-btn" onClick={() => toggleExpand(review.id)}>
                    더 보기
                  </span>
                )}
              </div>
              {review.image && <img src={review.image} alt="리뷰 첨부" className="attached-image" />}
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
                    setReviews(prev => prev.map(r => r.id === review.id ? {...r, likes: r.likes + 1} : r));
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
      <LoadingMore ref={loaderRef}>
        <button className="more-btn">
          아래로 스크롤하여 더보기 <FaArrowDown />
        </button>
      </LoadingMore>

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
