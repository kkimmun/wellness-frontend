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

const DUMMY_TOP10 = [
  {
    placeNo: 1,
    placeName: "김포아트빌리지&한옥마을",
    addr: "경기도 김포시 모담공원로 170",
    addrDetail: "",
    phone: "031-999-7890",
    reviewCount: 420,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1599307730999-566b6c38ccaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 4,
    placeName: "김포국제조각공원",
    addr: "경기도 김포시 월곶면 고막리 435-14",
    addrDetail: "",
    phone: "031-980-2481",
    reviewCount: 204,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 5,
    placeName: "김포 함상 공원",
    addr: "경기도 김포시 대곶면 대명항1로 110-36",
    addrDetail: "",
    phone: "031-980-5633",
    reviewCount: 156,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 7,
    placeName: "김포장릉",
    addr: "경기도 김포시 장릉로 79",
    addrDetail: "",
    phone: "031-984-2897",
    reviewCount: 870,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1601625902179-8472ec0b70ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 8,
    placeName: "라베니체",
    addr: "경기도 김포시 장기동 2018-2 라베니체마치에비뉴",
    addrDetail: "",
    phone: "031-980-2715",
    reviewCount: 645,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1544256673-9875bb239634?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 9,
    placeName: "김포아라마리나",
    addr: "경기도 김포시 고촌읍 아라육로270번길 73",
    addrDetail: "",
    phone: "031-996-6835",
    reviewCount: 582,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1628198751498-d891b6fb6e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 10,
    placeName: "대명항",
    addr: "경기도 김포시 대곶면 산자뫼로 101",
    addrDetail: "",
    phone: "031-980-2423",
    reviewCount: 510,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1549463951-2294119d80d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 14,
    placeName: "현대 프리미엄 아울렛",
    addr: "경기도 김포시 고촌읍 아라육로152번길 100",
    addrDetail: "",
    phone: "031-988-9220",
    reviewCount: 490,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 178,
    placeName: "김포 문수산성",
    addr: "경기도 김포시 월곶면 문수산로 102-38",
    addrDetail: "",
    phone: "031-988-6394",
    reviewCount: 420,
    type: "주요관광지",
    imgUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    placeNo: 1043,
    placeName: "애기봉",
    addr: "경기 김포시 하성면 가금리 193-7",
    addrDetail: "",
    phone: "031-980-2342",
    reviewCount: 380,
    type: "주요관광지",
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
