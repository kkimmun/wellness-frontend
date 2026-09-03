import React from "react";
import { FaChevronLeft, FaPhoneAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import {
  PanelContainer,
  Header,
  ListContainer,
  Top10Card,
  ImageWrapper,
  InfoWrapper,
} from "./Top10Panel.styles";

// 임시 더미 데이터 (명세 확정 후 교체 예정)
const DUMMY_TOP10 = [
  {
    placeNo: 1,
    placeName: "아라마리나",
    addr: "경기 김포시 고촌읍 아라육로49번길 100",
    addrDetail: "마리나 본관 1층",
    phone: "031-999-7890",
    likeCount: "1,420",
    viewCount: "4,120",
    tags: ["가족과함께", "해양레저", "힐링", "자연경관"],
    imgUrl: "https://images.unsplash.com/photo-1544256673-9875bb239634?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" // 마리나 느낌 이미지
  },
  {
    placeNo: 2,
    placeName: "라베니체 마치에비뉴",
    addr: "경기 김포시 초당로 40",
    addrDetail: "수변상가 일대",
    phone: "031-980-2481",
    likeCount: "1,204",
    viewCount: "3,892",
    tags: ["야경명소", "데이트코스", "이탈리아베니스풍", "산책"],
    imgUrl: "https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" // 수변 야경 느낌
  },
  {
    placeNo: 3,
    placeName: "김포한강야생조류생태공원",
    addr: "경기 김포시 김포한강11로 455",
    addrDetail: "에코센터 주차장 방면",
    phone: "031-980-5633",
    likeCount: "956",
    viewCount: "2,840",
    tags: ["자연생태", "철새도래지", "가족나들이", "갈대밭"],
    imgUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" // 자연/공원 느낌
  },
  {
    placeNo: 4,
    placeName: "김포 장릉 (UNESCO)",
    addr: "경기 김포시 장릉로 79",
    addrDetail: "문화재 입구 역사관 옆",
    phone: "031-984-2897",
    likeCount: "870",
    viewCount: "2,530",
    tags: ["유네스코세계유산", "산림욕", "역사기행", "가을단풍"],
    imgUrl: "https://images.unsplash.com/photo-1601625902179-8472ec0b70ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 5,
    placeName: "덕포진",
    addr: "경기 김포시 대곶면 덕포진로103번길 130",
    addrDetail: "전시관 옆 둘레길",
    phone: "031-980-2715",
    likeCount: "645",
    viewCount: "1,980",
    tags: ["역사적명소", "강화해협", "해안둘레길", "호국보훈"],
    imgUrl: "https://images.unsplash.com/photo-1628198751498-d891b6fb6e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 6,
    placeName: "김포아트빌리지",
    addr: "경기 김포시 모담공원로 170",
    addrDetail: "한옥마을 체험관",
    phone: "031-996-6835",
    likeCount: "582",
    viewCount: "1,750",
    tags: ["한옥체험", "문화예술", "가족나들이", "전통놀이"],
    imgUrl: "https://images.unsplash.com/photo-1599307730999-566b6c38ccaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 7,
    placeName: "문수산 산림욕장",
    addr: "경기 김포시 월곶면 성동리 산35-1",
    addrDetail: "등산로 입구 주차장",
    phone: "031-980-2423",
    likeCount: "510",
    viewCount: "1,430",
    tags: ["등산코스", "피톤치드", "전망좋은곳", "체력단련"],
    imgUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 8,
    placeName: "애기봉 평화생태공원",
    addr: "경기 김포시 하성면 평화공원로 289",
    addrDetail: "전망대 방면",
    phone: "031-988-9220",
    likeCount: "490",
    viewCount: "1,200",
    tags: ["평화전망대", "생태탐방", "안보관광", "힐링"],
    imgUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 9,
    placeName: "대명항",
    addr: "경기 김포시 대곶면 대명항1로 109",
    addrDetail: "어판장 주변",
    phone: "031-988-6394",
    likeCount: "420",
    viewCount: "1,150",
    tags: ["수산시장", "신선한해산물", "바다풍경", "먹거리"],
    imgUrl: "https://images.unsplash.com/photo-1549463951-2294119d80d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 10,
    placeName: "걸포중앙공원",
    addr: "경기 김포시 걸포로 76",
    addrDetail: "피크닉존 인근",
    phone: "031-980-2342",
    likeCount: "380",
    viewCount: "950",
    tags: ["피크닉", "아이와함께", "도심속휴식", "자전거타기"],
    imgUrl: "https://images.unsplash.com/photo-1498855926480-d98e83099315?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

import { useState, useEffect } from "react";
import { PlaceAPI } from "../../../api/place";

const Top10Panel = ({ isOpen, onClose, onPlaceClick }) => {
  const navigate = useNavigate();
  const [top10List, setTop10List] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && top10List.length === 0 && !loading && !error) {
      const fetchTop10 = async () => {
        setLoading(true);
        try {
          const res = await PlaceAPI.getGimpoTop10();
          if (res && res.code === 200 && res.data && res.data.content) {
            setTop10List(res.data.content);
          } else {
            // 명세가 확정되지 않았거나 데이터가 없을 때 더미 데이터 폴백
            setTop10List(DUMMY_TOP10);
          }
        } catch (err) {
          console.error("Top10 API 호출 실패:", err);
          // 백엔드 API가 아직 준비되지 않은 경우 더미 데이터 사용
          setTop10List(DUMMY_TOP10);
        } finally {
          setLoading(false);
        }
      };
      fetchTop10();
    }
  }, [isOpen, top10List.length, loading, error]);

  const handlePlaceClick = (place) => {
    // onPlaceClick 사용을 위해 addr 파라미터를 API 응답의 address로 맞춰준다 (하위 호환)
    const placeData = {
      ...place,
      addr: place.address || place.addr,
      phone: place.phoneNumber || place.phone,
    };
    if (onPlaceClick) {
      onPlaceClick(placeData);
    }
  };

  const listToRender = top10List.length > 0 ? top10List : DUMMY_TOP10;

  return (
    <PanelContainer $isOpen={isOpen}>
      <Header>
        <button className="close-btn" onClick={onClose}>
          <FaChevronLeft size={20} />
        </button>
        <h2>김포 Top 10</h2>
        <div style={{ width: 30 }} /> {/* 균형을 맞추기 위한 빈 공간 */}
      </Header>

      <ListContainer>
        {loading && <div style={{ padding: "20px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>}
        {!loading && listToRender.map((place, index) => (
          <Top10Card key={place.placeNo} onClick={() => handlePlaceClick(place)}>
            <ImageWrapper>
              <img src={place.imageUrl || place.imgUrl} alt={place.placeName} />
              <div className="rank-badge">{index + 1}</div>
            </ImageWrapper>

            <InfoWrapper>
              <div>
                <div className="title">{place.placeName}</div>
                <div className="address">{place.address || place.addr}</div>
                {place.addrDetail && <div className="address">{place.addrDetail}</div>}
                <div className="phone">
                  <FaPhoneAlt size={10} />
                  {place.phoneNumber || place.phone || "번호없음"}
                </div>
              </div>
              
              <div className="stats">
                {Number.isFinite(place.reviewCount) && (
                  <div className="stat-item">
                    <span className="review-text">리뷰 {place.reviewCount}</span>
                  </div>
                )}
                {Number.isFinite(place.avgRating) && (
                  <div className="stat-item">
                    <span className="rating-text">⭐ {place.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="tags">
                {place.tags && place.tags.length > 0 ? (
                  place.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      #{tag}
                    </span>
                  ))
                ) : place.type ? (
                  <span className="tag">#{place.type}</span>
                ) : null}
              </div>
            </InfoWrapper>
          </Top10Card>
        ))}
      </ListContainer>
    </PanelContainer>
  );
};

export default Top10Panel;
