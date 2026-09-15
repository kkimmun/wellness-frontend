import PlaceImage from "../../../components/PlaceImage";

export default function CoursePhoto({ src, name, place }) {
  return <PlaceImage src={src} place={place} alt={name + " 사진"} loading="lazy" />;
}
