import { ImageCarousel, CarouselItem } from "./DetailPanel.styles";
import PlaceImage from "../../../components/PlaceImage";

const ImageSlider = ({ placeImages, place, imgIndex, onImageChange }) => {
  const images = placeImages?.length ? placeImages : [null];
  const activeIndex = Math.min(imgIndex, images.length - 1);
  const getCarouselClass = (idx) => {
    if (idx === activeIndex) return "active";
    if (idx === (activeIndex - 1 + images.length) % images.length) return "prev";
    if (idx === (activeIndex + 1) % images.length) return "next";
    return "hidden";
  };
  return <ImageCarousel>
    {images.map((item, idx) => <CarouselItem
      key={item?.imgNo ?? idx} className={getCarouselClass(idx)}
      onClick={() => { if (getCarouselClass(idx) !== "hidden") onImageChange(idx); }}>
      <PlaceImage src={typeof item === "string" ? item : item?.imageUrl} place={place}
        alt={`${place?.placeName || "장소"} 이미지`}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
    </CarouselItem>)}
  </ImageCarousel>;
};

export default ImageSlider;
