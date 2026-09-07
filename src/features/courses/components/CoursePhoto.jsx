import { useState } from "react";
import { FiImage } from "react-icons/fi";
import { PhotoPlaceholder } from "./UserCourseDetail.styles";

export default function CoursePhoto({ src, name }) {
  const [failedSource, setFailedSource] = useState(null);
  return !src || failedSource === src
    ? <PhotoPlaceholder><FiImage aria-hidden="true" /><span>{src ? "사진을 불러올 수 없습니다." : "등록된 사진이 없습니다."}</span></PhotoPlaceholder>
    : <img src={src} alt={name + " 사진"} loading="lazy" onError={() => setFailedSource(src)} />;
}
