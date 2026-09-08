import {
  ImageCarousel,
  CarouselItem,
} from "./DetailPanel.styles";

const ImageSlider = ({ placeImages, imgIndex, onImageChange }) => {
  // DB 지도 핀 연동: 이미지가 없을 때 목업 이미지를 만들지 않고 빈 상태를 표시한다.
  // 장소 상세 개선: 상세 API가 IMG_ORDER 순서로 준 이미지 전체를 순환 표시한다.
  const images = placeImages?.length > 0 ? placeImages : [null];

  const renderBoxStyle = (item) => {
    if (item?.imageUrl) {
      return { backgroundImage: `url(${item.imageUrl})` };
    }
    if (!item) {
      return {
        backgroundColor: "#F8F9FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };
    }
    if (typeof item === "string") {
      return { backgroundImage: `url(${item})` };
    }
    return {
      backgroundColor: item.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  const renderBoxContent = (item) => {
    if (!item) {
      return <span style={{ color: "#999" }}>등록된 이미지가 없습니다.</span>;
    }
    if (typeof item !== "string" && !item.imageUrl) {
      return (
        <span style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
          {item.text}
        </span>
      );
    }
    return null;
  };

  const getCarouselClass = (idx) => {
    if (idx === imgIndex) return "active";
    if (idx === (imgIndex - 1 + images.length) % images.length) return "prev";
    if (idx === (imgIndex + 1) % images.length) return "next";
    return "hidden";
  };

  return (
    <ImageCarousel>
      {images.map((item, idx) => (
        <CarouselItem
          key={item?.imgNo ?? item?.imageUrl ?? item ?? idx}
          className={getCarouselClass(idx)}
          style={renderBoxStyle(item)}
          onClick={() => {
            if (getCarouselClass(idx) !== "hidden") {
              onImageChange(idx);
            }
          }}
        >
          {renderBoxContent(item)}
        </CarouselItem>
      ))}
    </ImageCarousel>
  );
};

export default ImageSlider;
