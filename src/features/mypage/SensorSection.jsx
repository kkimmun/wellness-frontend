import { useEffect, useState } from "react";
import { FaWalking } from "react-icons/fa";
import { SensorAPI } from "./api/sensorApi";
import { Section, SectionHeading, Empty } from "./MyPageDashboard.styles";
import * as S from "./SensorSection.styles";

const STATUS = { LOADING: "loading", SUCCESS: "success", EMPTY: "empty", ERROR: "error" };

const formatTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
};

// 화면 목적: 회원의 만보기 사용에 대한 관리(당일 걸음 수 상세조회)
export default function SensorSection() {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    SensorAPI.getSensorInfo(controller.signal)
      .then((data) => {
        const list = data || [];
        setRecords(list);
        setStatus(list.length ? STATUS.SUCCESS : STATUS.EMPTY);
      })
      .catch((err) => {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        setError(err?.message || "만보기 정보를 조회하지 못했습니다.");
        setStatus(STATUS.ERROR);
      });
    return () => controller.abort();
  }, []);

  const latest = records[records.length - 1];

  return (
    <Section aria-label="만보기 관리">
      <SectionHeading>
        <div>
          <h2>오늘의 만보기</h2>
          <p>연동된 기기에서 수집된 오늘의 걸음 수 기록입니다.</p>
        </div>
      </SectionHeading>
      {status === STATUS.LOADING && <S.State role="status">불러오는 중입니다...</S.State>}
      {status === STATUS.ERROR && <S.State role="alert">{error}</S.State>}
      {status === STATUS.EMPTY && (
        <Empty>
          <FaWalking />
          <h3>오늘 기록된 걸음 수가 없어요.</h3>
          <p>연동된 만보기 기기에서 걸음 수가 수집되면 이곳에 표시됩니다.</p>
        </Empty>
      )}
      {status === STATUS.SUCCESS && (
        <>
          <S.Summary>
            <dt>오늘 총 걸음 수</dt>
            <dd>
              {latest.stepCount.toLocaleString()}
              <span>걸음</span>
            </dd>
            <p>최근 갱신 {formatTime(latest.collectTime)}</p>
          </S.Summary>
          <S.RecordList>
            {records
              .slice()
              .reverse()
              .map((record) => (
                <li key={record.infoNo}>
                  <time>{formatTime(record.collectTime)}</time>
                  <span>{record.stepCount.toLocaleString()}걸음</span>
                </li>
              ))}
          </S.RecordList>
        </>
      )}
    </Section>
  );
}
