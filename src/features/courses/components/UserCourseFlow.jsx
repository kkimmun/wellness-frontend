import { useEffect, useState } from "react";
import { BackButton } from "../../../components/Button/BackButton";
import { PrimaryButton, SecondaryButton } from "../../../components/Button/Button.styles";
import CustomCoursePanel from "./CustomCoursePanel";
import UserCourseDetail from "./UserCourseDetail";
import { readUserCourse, saveUserCourse } from "../utils/userCourseStorage";
import * as S from "./UserCourseDetail.styles";

export default function UserCourseFlow({ pins, pinsState, onClose, onRouteChange }) {
  const [flow, setFlow] = useState(() => {
    const course = readUserCourse();
    return { course, stage: course ? "choose" : "create", warning: "" };
  });

  useEffect(() => {
    onRouteChange(flow.stage === "detail" ? flow.course.routeData : null);
  }, [flow.stage, flow.course, onRouteChange]);

  const handleCreated = (course) => {
    const saved = saveUserCourse(course);
    setFlow({ course, stage: "detail", warning: saved ? "" : "이 브라우저에 코스를 저장하지 못했습니다. 현재 화면에서는 코스를 볼 수 있습니다." });
  };

  if (flow.stage === "detail") {
    return <UserCourseDetail course={flow.course} onBack={onClose} storageWarning={flow.warning} />;
  }

  if (flow.stage === "choose") {
    return (
      <S.CourseCard aria-label="저장된 코스 선택">
        <S.BackRow><BackButton onClick={onClose} aria-label="지도 화면으로 돌아가기" />지도 화면으로</S.BackRow>
        <h1>저장된 코스가 있습니다</h1>
        <S.Description>{flow.course.courseName}</S.Description>
        <S.Description>이전에 만든 코스를 보거나 새로운 코스를 만들어보세요.</S.Description>
        <S.ChoiceActions>
          <PrimaryButton type="button" $fullWidth onClick={() => setFlow((current) => ({ ...current, stage: "detail" }))}>저장된 코스 보기</PrimaryButton>
          <SecondaryButton type="button" $fullWidth onClick={() => setFlow((current) => ({ ...current, stage: "create" }))}>새 코스 제작</SecondaryButton>
        </S.ChoiceActions>
      </S.CourseCard>
    );
  }

  return <CustomCoursePanel pins={pins} pinsState={pinsState} onClose={onClose} onCourseBuilt={onRouteChange} onCreated={handleCreated} />;
}
