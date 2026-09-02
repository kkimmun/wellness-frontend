import React, { useState, useEffect } from "react";
import { ImageCarousel, CarouselItem } from "./DetailPanel.styles";

const mockImages = [
  { bg: "#FFB300", text: "Image 1" },
  { bg: "#81D4FA", text: "Image 2" },
  { bg: "#FF7043", text: "Image 3" },
  { bg: "#B39DDB", text: "Image 4" },
];

const ImageSlider = ({ placeImages }) => {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setImgIndex(0);
  }, [placeImages]);

  const images = placeImages?.length > 0 ? placeImages : mockImages;

  const renderBoxStyle = (item) => {
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
    if (typeof item !== "string") {
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
          key={idx}
          className={getCarouselClass(idx)}
          style={renderBoxStyle(item)}
          onClick={() => {
            if (getCarouselClass(idx) !== "hidden") {
              setImgIndex(idx);
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
