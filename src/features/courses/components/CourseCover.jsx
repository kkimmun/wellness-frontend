import { useEffect, useState } from "react";
import PlaceImage from "../../../components/PlaceImage";
import { CourseAPI } from "../../../api/course";
import { PlaceAPI } from "../../../api/place";
import { CourseThumbnail, NumberBadge } from "./FixedCoursePanel.styles";

export default function CourseCover({ src, name, number, tone = 0, courseNo, place }) {
  const [remoteCover, setRemoteCover] = useState(null);
  const placeNo = place?.placeNo;
  const coverKey = placeNo ? `place:${placeNo}` : `course:${courseNo}`;
  const imageUrl = remoteCover?.key === coverKey ? remoteCover.imageUrl : src;

  useEffect(() => {
    if (!placeNo && !courseNo) return undefined;
    const controller = new AbortController();
    // 저장된 코스의 오래된 사진보다 현재 장소 대표 이미지를 우선한다.
    const request = placeNo
      ? PlaceAPI.getPlaceDetail(placeNo).then((data) => data?.imageUrl)
      : CourseAPI.getFixedCourse(courseNo, controller.signal).then((response) => response?.data?.endPlaceImg);
    request
      .then((imageUrl) => {
        if (!controller.signal.aborted) {
          setRemoteCover({ key: coverKey, imageUrl });
        }
      })
      .catch(() => { /* 사진 조회 실패 시 공통 이미지 URL을 사용한다. */ });
    return () => controller.abort();
  }, [src, courseNo, placeNo, coverKey]);

  return (
    <CourseThumbnail $tone={tone}>
      <NumberBadge>{number}</NumberBadge>
      <PlaceImage src={imageUrl} place={place} alt={`${name || "도착지"} 풍경`} loading="lazy" />
    </CourseThumbnail>
  );
}
