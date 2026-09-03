import { useEffect, useState } from "react";
import { BackButton } from "../../../components/Button/BackButton";
import { readUserCourses } from "../utils/userCourseStorage";
import UserCourseDetail from "./UserCourseDetail";
import * as S from "./UserCourseDetail.styles";

export default function SavedUserCourseDetail({ courseId, requestKey, onClose, onRouteChange }) {
  const [course] = useState(() => readUserCourses().find((item) => item.id === courseId));

  useEffect(() => {
    onRouteChange({ key: requestKey, routeData: course?.routeData ?? null });
  }, [course, requestKey, onRouteChange]);

  if (!course) {
    return (
      <S.CourseCard aria-label="저장된 코스 없음">
        <S.BackRow><BackButton onClick={onClose} aria-label="순례길 목록으로 돌아가기" />순례길 목록으로</S.BackRow>
        <h1>코스를 찾을 수 없습니다.</h1>
        <S.Description>이 브라우저에 저장된 코스가 없습니다. 목록에서 다른 코스를 선택해주세요.</S.Description>
      </S.CourseCard>
    );
  }

  return <UserCourseDetail course={course} onBack={onClose} backLabel="순례길 목록으로" />;
}
