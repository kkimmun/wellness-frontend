// wellness_image 프로젝트에서 업로드한 유형별 공통 이미지. DB 이미지 행을 만들지 않는다.
const defaults = [
  {
    "typeDetailNo": 2,
    "typeDetail": "자연명소",
    "type": "주요관광지",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/80ba178c-935b-4553-85d6-d85a964557f0.png",
    "originalName": "AI_TYPE_02_mountain-nature.png"
  },
  {
    "typeDetailNo": 3,
    "typeDetail": "종합병원",
    "type": "의료기관",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/e0ce499d-764d-45ea-98ee-d35f083b3ad9.png",
    "originalName": "AI_TYPE_03_hospital.png"
  },
  {
    "typeDetailNo": 4,
    "typeDetail": "한의원",
    "type": "의료기관",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/84e04eaa-7d33-4778-9bb0-58d4be082f92.png",
    "originalName": "AI_TYPE_04_clinic-traditional-medicine.png"
  },
  {
    "typeDetailNo": 7,
    "typeDetail": "수영장",
    "type": "생활체육시설",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/e136907d-31fc-4beb-a1a7-500105e86de9.png",
    "originalName": "AI_TYPE_07_swimming-sports.png"
  },
  {
    "typeDetailNo": 8,
    "typeDetail": "클라이밍/암벽등반",
    "type": "생활체육시설",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/9aee3289-8dc6-4662-8499-b75be7364d92.png",
    "originalName": "AI_TYPE_08_climbing.png"
  },
  {
    "typeDetailNo": 11,
    "typeDetail": "양식",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/78e7c371-f86e-4725-8da4-8ea1e351e0f8.png",
    "originalName": "AI_TYPE_11_western-general-restaurant.png"
  },
  {
    "typeDetailNo": 12,
    "typeDetail": "생선회",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/cf98d230-0b00-4b6b-afef-f14e60cdbef0.png",
    "originalName": "AI_TYPE_12_sashimi-seafood.png"
  },
  {
    "typeDetailNo": 13,
    "typeDetail": "일식",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/1ba4ac5a-2f5e-4baa-a1ce-d33facbbf3e9.png",
    "originalName": "AI_TYPE_13_japanese-food.png"
  },
  {
    "typeDetailNo": 14,
    "typeDetail": "카페",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/8d67f64e-10ff-4563-b9d4-ab0ea6b4ec15.png",
    "originalName": "AI_TYPE_14_cafe-dessert.png"
  },
  {
    "typeDetailNo": 15,
    "typeDetail": "중식",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/d79b873d-4e75-436d-a1bb-98cbb0de975a.png",
    "originalName": "AI_TYPE_15_chinese-food.png"
  },
  {
    "typeDetailNo": 16,
    "typeDetail": "패스트푸드",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/555400b1-1bed-4e8d-a2d8-a7320350bea5.png",
    "originalName": "AI_TYPE_16_casual-western-food.png"
  },
  {
    "typeDetailNo": 17,
    "typeDetail": "한식",
    "type": "음식점",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/651df321-fbe0-4999-b7dd-8562b80f05b5.png",
    "originalName": "AI_TYPE_17_korean-food.png"
  },
  {
    "typeDetailNo": 20,
    "typeDetail": "체험농장",
    "type": "체험",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/9d4d1a70-cf95-47d4-be6e-ad5bf48fe821.png",
    "originalName": "AI_TYPE_20_rural-experience.png"
  },
  {
    "typeDetailNo": 25,
    "typeDetail": "외국인지원센터",
    "type": "복지시설",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/28b69fe9-c7a6-4bf5-ad0c-b45d3128e824.png",
    "originalName": "AI_TYPE_25_multicultural-support.png"
  },
  {
    "typeDetailNo": 26,
    "typeDetail": "청소년 시설",
    "type": "복지시설",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/7dfd2f5a-24cc-48e1-ac42-136ceb27e534.png",
    "originalName": "AI_TYPE_26_youth-facility.png"
  },
  {
    "typeDetailNo": 27,
    "typeDetail": "캠핑",
    "type": "자연/생태",
    "imageUrl": "https://ds-20260728.s3.ap-northeast-2.amazonaws.com/places/88b9d65b-c206-4143-ba55-ccad05daef88.png",
    "originalName": "AI_TYPE_27_campground.png"
  }
];

export function getDefaultPlaceImage(place = {}) {
  return (defaults.find((item) => String(item.typeDetailNo) === String(place?.typeDetailNo))
    || defaults.find((item) => item.typeDetail === place?.typeDetail)
    || defaults.find((item) => item.type === place?.type)
    || defaults[0]).imageUrl;
}

export function getPlaceImageUrl(place = {}) {
  return place?.imageUrl?.trim() || place?.imgUrl?.trim() || getDefaultPlaceImage(place);
}

export function isDefaultPlaceImage(url) {
  return defaults.some((item) => item.imageUrl === url);
}

export const DEFAULT_IMAGE_LICENSE = {
  sourceName: "웰니스와 깃커밋 프로젝트",
  licenseCode: "PROJECT-OWNED",
  attributionText: "AI 생성 카테고리 일러스트 · 실제 장소 사진 아님",
};
