import { useEffect, useState } from "react";
import PlaceImage from "../../../components/PlaceImage";
import { CourseAPI } from "../../../api/course";
import { CourseThumbnail, NumberBadge } from "./FixedCoursePanel.styles";

export default function CourseCover({ src, name, number, tone = 0, courseNo, place }) {
  const [remoteCover, setRemoteCover] = useState(null);
  const imageUrl = src || (remoteCover?.courseNo === courseNo ? remoteCover?.imageUrl : null);

  useEffect(() => {
    if (src || !courseNo) return undefined;
    const controller = new AbortController();
    // 고정 코스 목록 응답에는 사진이 없어 상세 응답의 도착지 사진을 사용한다.
    CourseAPI.getFixedCourse(courseNo, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setRemoteCover({ courseNo, imageUrl: response?.data?.endPlaceImg });
        }
      })
      .catch(() => { /* 사진 조회 실패 시 공통 이미지 URL을 사용한다. */ });
    return () => controller.abort();
  }, [src, courseNo]);

  return (
    <CourseThumbnail $tone={tone}>
      <NumberBadge>{number}</NumberBadge>
      <PlaceImage src={imageUrl} place={place} alt={`${name || "도착지"} 풍경`} loading="lazy" />
    </CourseThumbnail>
  );
}
