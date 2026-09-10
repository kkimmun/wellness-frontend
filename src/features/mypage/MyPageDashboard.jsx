import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaMapMarkerAlt, FaRoute } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal/Modal";
import { deleteTravelPlan, TRAVEL_PLAN_KIND, TRAVEL_PLAN_STORAGE_KEY } from "../map/utils/travelPlanStorage";
import { formatSavedDate, getMyTrips, getProfileImage, getTravelOwnerKey, getTripMapUrl } from "./myPageModel";
import AccountActions from "./AccountActions";
import ProfileEditor from "./ProfileEditor";
import * as S from "./MyPageDashboard.styles";

// 계정이 바뀌면 선택 탭·삭제 확인 대상까지 함께 초기화한다.
export default function MyPageDashboard() {
  const { user } = useAuth();
  return <Dashboard key={getTravelOwnerKey(user) || "unknown"} user={user} />;
}

function Dashboard({ user }) {
  const ownerKey = getTravelOwnerKey(user);
  const [tab, setTab] = useState(TRAVEL_PLAN_KIND.PLAN);
  const [trips, setTrips] = useState(() => getMyTrips(user));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const [failedImage, setFailedImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const profileImage = getProfileImage(user);
  const isPlan = tab === TRAVEL_PLAN_KIND.PLAN;
  const visibleTrips = trips.filter((trip) => trip.kind === tab);
  const title = isPlan ? "나의 여행 계획" : "나의 추천 코스";

  useEffect(() => {
    const refresh = () => setTrips(getMyTrips(user));
    const handleStorage = (event) => { if (!event.key || event.key === TRAVEL_PLAN_STORAGE_KEY) refresh(); };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  const confirmDelete = () => {
    if (!ownerKey || !deleteTarget) return;
    try {
      deleteTravelPlan(ownerKey, deleteTarget.id);
      setTrips(getMyTrips(user));
      setDeleteTarget(null);
      setError("");
    } catch {
      setError("저장 공간에 접근할 수 없어 삭제하지 못했습니다. 브라우저 설정을 확인해주세요.");
    }
  };

  return <S.Page><S.Container>
    <S.Heading><div><small>MY WELLNESS</small><h1>마이페이지</h1><p>내가 고른 장소, 나에게 맞는 코스. 나의 김포 여행을 이어가세요.</p></div><Link to="/map">지도로 돌아가기 →</Link></S.Heading>
    <S.Layout>
      <S.Profile aria-label="내 회원정보">
        <S.Avatar>{profileImage && failedImage !== profileImage ? <img src={profileImage} alt="내 프로필" onError={() => setFailedImage(profileImage)} /> : <FaUserCircle size={76} />}</S.Avatar>
        <h2>{user?.memberName || "여행자"}님</h2><p>오늘도 나만의 여행을 만들어보세요.</p>
        <S.Info>
          <dt>아이디</dt><dd>{user?.memberId || "소셜 로그인 계정"}</dd>
          <dt>가입일</dt><dd>{user?.enrollDate ? formatSavedDate(user.enrollDate) : "정보 없음"}</dd>
        </S.Info>
        <S.EditButton type="button" onClick={() => { setProfileMessage(""); setEditing(true); }}>회원정보 수정</S.EditButton>
        {profileMessage && <p role="status">{profileMessage}</p>}
        <S.Account><h3>계정 관리</h3><AccountActions /></S.Account>
      </S.Profile>
      <S.Section aria-label="저장한 여행">
        <S.Tabs role="tablist" aria-label="여행 종류">
          {[TRAVEL_PLAN_KIND.PLAN, TRAVEL_PLAN_KIND.RECOMMENDATION].map((kind) => <button key={kind} id={`tab-${kind}`} role="tab" type="button"
            aria-selected={tab === kind} aria-controls={`panel-${kind}`} tabIndex={tab === kind ? 0 : -1}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? TRAVEL_PLAN_KIND.PLAN : event.key === "End" ? TRAVEL_PLAN_KIND.RECOMMENDATION : kind === TRAVEL_PLAN_KIND.PLAN ? TRAVEL_PLAN_KIND.RECOMMENDATION : TRAVEL_PLAN_KIND.PLAN;
              setTab(next); document.getElementById(`tab-${next}`)?.focus();
            }} onClick={() => setTab(kind)}>{kind === TRAVEL_PLAN_KIND.PLAN ? "나의 여행 계획" : "나의 추천 코스"}<span>{trips.filter((trip) => trip.kind === kind).length}</span></button>)}
        </S.Tabs>
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0}>
          <S.SectionHeading><div><h2>{title}</h2><p>{isPlan ? "직접 골라 연결한 나만의 여행입니다." : "마음에 들어 저장한 추천 코스입니다."}</p></div><Link to={isPlan ? "/map?mode=j" : "/map?mode=p"}>{isPlan ? "+ 계획 만들기" : "+ 추천받기"}</Link></S.SectionHeading>
          <S.Notice>현재 계정으로 이 브라우저에 저장한 여행만 표시됩니다. 다른 기기와 동기화되지 않으며, 브라우저 데이터를 삭제하면 사라질 수 있습니다.</S.Notice>
          {visibleTrips.length ? <S.TripList>{visibleTrips.map((trip) => <S.Trip key={trip.id}>
            <h3>{trip.name}</h3><time>{formatSavedDate(trip.updatedAt || trip.createdAt)} 저장 · {trip.places.length}개 장소</time>
            <S.Origin><FaMapMarkerAlt />출발: {trip.origin.placeName || trip.origin.address || "지도에서 선택한 위치"}</S.Origin>
            <ol>{trip.places.map((place, index) => <li key={`${place.placeNo}-${index}`}>{place.placeName || `장소 ${place.placeNo}`}</li>)}</ol>
            <S.Actions><Link to={getTripMapUrl(trip)} aria-label={`${trip.name} 지도에서 보기`}>지도에서 코스 보기 →</Link><button type="button" aria-label={`${trip.name} 삭제`} onClick={() => { setError(""); setDeleteTarget(trip); }}>삭제</button></S.Actions>
          </S.Trip>)}</S.TripList> : <S.Empty><FaRoute /><h3>아직 저장한 {isPlan ? "여행 계획이" : "추천 코스가"} 없어요.</h3><p>{isPlan ? "가고 싶은 장소를 연결하고 첫 계획을 저장해보세요." : "나에게 맞는 코스를 추천받고 저장해보세요."}</p></S.Empty>}
        </div>
      </S.Section>
    </S.Layout>
    {editing && <ProfileEditor user={user} onClose={() => setEditing(false)} onSaved={(message) => { setProfileMessage(message); setEditing(false); }} />}
    <Modal isOpen={Boolean(deleteTarget)} title="저장한 여행 삭제" message={`“${deleteTarget?.name || ""}”을 삭제하시겠습니까? 삭제한 여행은 복구할 수 없습니다.`}
      confirmText="삭제" confirmVariant="danger" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)}>
      {error && <p role="alert">{error}</p>}
    </Modal>
  </S.Container></S.Page>;
}
