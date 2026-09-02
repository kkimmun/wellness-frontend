import { FaBus, FaSubway, FaWalking } from "react-icons/fa";
import {
  DetailStatus,
  StepBody,
  StepIcon,
  StopDetails,
  TransitDetails,
  TransitStep,
  TransitTimeline,
} from "./TransitRouteDetails.styles";
import { getRouteSegmentStyle } from "../routeSegmentStyles";

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "시간 정보 없음";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
    : `${minutes}분`;
};

const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return "거리 정보 없음";
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)}km`
    : `${Math.round(meters)}m`;
};

const stepIcon = (type) => {
  if (type === "BUS") return <FaBus />;
  if (type === "SUBWAY") return <FaSubway />;
  return <FaWalking />;
};

const stepTitle = (step) => {
  if (step.type === "BUS") {
    const names = step.vehicleNames?.filter(Boolean) || [];
    return names.length > 0 ? `${names.join(" · ")} 버스` : "버스 이동";
  }

  if (step.type === "SUBWAY") {
    const names = step.vehicleNames?.filter(Boolean) || [];
    return names.length > 0 ? names.join(" · ") : "지하철 이동";
  }

  if (step.connectionType === "ACCESS") return "첫 승차지까지 도보";
  if (step.connectionType === "EGRESS") return "목적지까지 도보";
  if (step.transfer) return "환승을 위한 도보 이동";
  return "도보 이동";
};

const getStopNames = (step) => step.stopNames?.filter(Boolean) || [];

const WalkingStepContent = ({ step }) => {
  const stopNames = getStopNames(step);
  const instructions = step.instructions?.filter(
    (instruction) => instruction?.guidance,
  );

  return (
    <>
      <p>{step.guidance || "다음 이동 지점까지 걸어서 이동합니다."}</p>
      {stopNames.length >= 2 && (
        <p>
          <strong>{stopNames[0]}</strong> →{" "}
          <strong>{stopNames[stopNames.length - 1]}</strong>
        </p>
      )}
      <p>
        {formatDuration(step.time)} · {formatDistance(step.distance)}
      </p>
      {instructions?.length > 0 && (
        <StopDetails>
          <summary>도보 상세 안내</summary>
          <ol>
            {instructions.map((instruction, index) => (
              <li key={`${instruction.guidance}-${index}`}>
                {instruction.guidance}
                {Number.isFinite(instruction.distance) &&
                  ` · ${formatDistance(instruction.distance)}`}
              </li>
            ))}
          </ol>
        </StopDetails>
      )}
    </>
  );
};

const TransitStepContent = ({ step }) => {
  const stopNames = getStopNames(step);
  const boardingPlace = step.boardingPlace || stopNames[0];
  const alightingPlace =
    step.alightingPlace || stopNames[stopNames.length - 1];

  return (
    <>
      {boardingPlace && (
        <p>
          <strong>{boardingPlace}</strong>에서 승차
        </p>
      )}
      {step.direction && <p>{step.direction}으로 이동</p>}
      <p>
        {Number.isFinite(step.stopCount) && `${step.stopCount}개 정류장 · `}
        {formatDuration(step.time)} · {formatDistance(step.distance)}
      </p>
      {alightingPlace && (
        <p>
          <strong>{alightingPlace}</strong>에서 하차
        </p>
      )}
      {stopNames.length > 2 && (
        <StopDetails>
          <summary>전체 정류장 보기</summary>
          <ol>
            {stopNames.map((stopName, index) => (
              <li key={`${stopName}-${index}`}>{stopName}</li>
            ))}
          </ol>
        </StopDetails>
      )}
    </>
  );
};

const TransitRouteDetails = ({ route, detail }) => {
  const steps = [
    detail?.accessStep,
    ...(route.steps || []),
    detail?.egressStep,
  ].filter(Boolean);

  return (
    <TransitDetails>
      {detail?.state === "loading" && (
        <DetailStatus>출발지·목적지 연결 도보를 확인하고 있습니다.</DetailStatus>
      )}
      {detail?.warning && <DetailStatus $error>{detail.warning}</DetailStatus>}

      {steps.length === 0 ? (
        <DetailStatus $error>
          이 경로에는 단계별 이동 정보가 없습니다.
        </DetailStatus>
      ) : (
        <TransitTimeline>
          {steps.map((step, index) => (
            <TransitStep key={`${step.type}-${step.guidance || "step"}-${index}`}>
              {/* 대중교통 경로 색상: 상세 목록과 지도에서 같은 교통수단은 같은 색으로 표시한다. */}
              <StepIcon
                $color={getRouteSegmentStyle(step).color}
                title={getRouteSegmentStyle(step).label}
              >
                {stepIcon(step.type)}
              </StepIcon>
              <StepBody>
                <h4>{stepTitle(step)}</h4>
                {step.type === "BUS" || step.type === "SUBWAY" ? (
                  <TransitStepContent step={step} />
                ) : (
                  <WalkingStepContent step={step} />
                )}
              </StepBody>
            </TransitStep>
          ))}
        </TransitTimeline>
      )}
    </TransitDetails>
  );
};

export default TransitRouteDetails;
