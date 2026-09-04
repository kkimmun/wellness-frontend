import { useEffect, useState } from "react";
import CustomCoursePanel from "./CustomCoursePanel";
import UserCourseDetail from "./UserCourseDetail";
import { saveUserCourse } from "../utils/userCourseStorage";

export default function UserCourseFlow({ pins, pinsState, onClose, onRouteChange, onRestaurantsChange, onRestaurantSelect }) {
  const [flow, setFlow] = useState({ course: null, stage: "create", warning: "" });

  useEffect(() => {
    onRouteChange(flow.stage === "detail" ? flow.course.routeData : null);
  }, [flow.stage, flow.course, onRouteChange]);

  const handleCreated = (course) => {
    const saved = saveUserCourse(course);
    setFlow({ course, stage: "detail", warning: saved ? "" : "이 브라우저에 코스를 저장하지 못했습니다. 현재 화면에서는 코스를 볼 수 있습니다." });
  };

  if (flow.stage === "detail") {
    return <UserCourseDetail onRestaurantsChange={onRestaurantsChange} onRestaurantSelect={onRestaurantSelect} places={pins} course={flow.course} onBack={onClose} storageWarning={flow.warning} />;
  }

  return <CustomCoursePanel pins={pins} pinsState={pinsState} onClose={onClose} onCourseBuilt={onRouteChange} onCreated={handleCreated} />;
}
