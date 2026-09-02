export const reviewRatingData = [
  { name: '1', count: 5 },
  { name: '2', count: 12 },
  { name: '3', count: 25 },
  { name: '4', count: 80 },
  { name: '5', count: 150 }
];

export const getMockImage = (num) => `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23B3E5FC'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20font-family='sans-serif'%20font-size='24px'%20font-weight='bold'%20fill='%230288D1'%3EReview%20Image%20${num}%3C/text%3E%3C/svg%3E`;

export const mockReviews = [
  {
    id: 1,
    userName: "웰니스",
    userProfile: "https://via.placeholder.com/40/81D4FA/FFFFFF?text=W",
    rating: 4.5,
    date: "2026. 06. 21",
    content: "김포 장릉에 다녀왔는데 생각보다 훨씬 여유롭고 좋았어요. 푸릇한 나무들 사이로 조용히 걸을 수 있어서 복잡한 도심에서 잠시 벗어난 기분이었습니다. 왕릉의 분위기도 차분하고 잘돈되어 있어서 산책하면서 역사적인 공간을 함께 느낄 수 있었어요. 날씨 좋은 날 천천히 둘러보기 좋은 곳이라 추천합니다.",
    likes: 5,
    isMine: true,
    isMock: true
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
    isMine: false,
    isMock: true
  }
];
