import { useState } from "react";
import { ImageCarousel, CarouselItem } from "./DetailPanel.styles";
import PlaceImage from "../../../components/PlaceImage";
import { Modal } from "../../../components/Modal/Modal";
import { isDefaultPlaceImage } from "../../../utils/placeImage";

const getImageUrl = (item) => (typeof item === "string" ? item : item?.imageUrl);
// 등록된 실제 썸네일이 없으면 PlaceImage가 기본 일러스트로 대체하는데, 이 경우는 확대해서 볼 실물 사진이 없으므로 클릭을 막는다.
const hasRealImage = (item) => {
  const url = getImageUrl(item)?.trim();
  return Boolean(url) && !isDefaultPlaceImage(url);
};

const ImageSlider = ({ placeImages, place, imgIndex, onImageChange }) => {
  const images = placeImages?.length ? placeImages : [null];
  const activeIndex = Math.min(imgIndex, images.length - 1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeHasImage = hasRealImage(images[activeIndex]);
  const getCarouselClass = (idx) => {
    if (idx === activeIndex) return "active";
    if (idx === (activeIndex - 1 + images.length) % images.length) return "prev";
    if (idx === (activeIndex + 1) % images.length) return "next";
    return "hidden";
  };
  const handleItemClick = (idx) => {
    const className = getCarouselClass(idx);
    if (className === "active") {
      if (activeHasImage) setLightboxOpen(true);
    } else if (className !== "hidden") onImageChange(idx);
  };
  return <>
    <ImageCarousel>
      {images.map((item, idx) => {
        const className = getCarouselClass(idx);
        const clickable = className === "active" ? activeHasImage : className !== "hidden";
        return <CarouselItem
          key={item?.imgNo ?? idx} className={className}
          style={clickable ? undefined : { cursor: "default" }}
          onClick={() => handleItemClick(idx)}>
          <PlaceImage src={getImageUrl(item)} place={place}
            alt={`${place?.placeName || "장소"} 대표 이미지`}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
        </CarouselItem>;
      })}
    </ImageCarousel>

    <Modal
      isOpen={lightboxOpen}
      showClose={true}
      size="image"
      onClose={() => setLightboxOpen(false)}
    >
      {lightboxOpen && (
        <PlaceImage
          src={getImageUrl(images[activeIndex])}
          place={place}
          alt={`${place?.placeName || "장소"} 대표 이미지 크게 보기`}
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
  </>;
};

export default ImageSlider;
