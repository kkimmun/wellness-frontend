import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaMapMarkerAlt, FaRoute } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal/Modal";
import { PlanAPI } from "../../api/plan";
import { formatSavedDate, getProfileImage, getTravelOwnerKey, getTripMapUrl } from "./myPageModel";
import AccountActions from "./AccountActions";
import ProfileEditor from "./ProfileEditor";
import SensorSection from "./SensorSection";
import * as S from "./MyPageDashboard.styles";

// 계정이 바뀌면 선택 탭·삭제 확인 대상까지 함께 초기화한다.
export default function MyPageDashboard() {
  const { user } = useAuth();
  return <Dashboard key={getTravelOwnerKey(user) || "unknown"} user={user} />;
}

function Dashboard({ user }) {
  const [trips, setTrips] = useState([]);
  const [isTripsLoading, setIsTripsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");
  const [failedImage, setFailedImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const profileImage = getProfileImage(user);
  const visibleTrips = trips;

  useEffect(() => {
    let ignore = false;
    const loadTrips = async () => {
      setIsTripsLoading(true);
      setError("");
      try {
        const plans = await PlanAPI.getPlans();
        const details = await Promise.all(
          plans.map((plan) => PlanAPI.getPlan(plan.planNo)),
        );
        if (!ignore) setTrips(details.filter(Boolean));
      } catch (loadError) {
        console.error("저장된 계획을 불러오지 못했습니다.", loadError);
        if (!ignore) {
          setTrips([]);
          setError("저장된 계획을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        if (!ignore) setIsTripsLoading(false);
      }
    };
    loadTrips();
    return () => {
      ignore = true;
    };
  }, [user?.memberNo]);

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await PlanAPI.deletePlan(deleteTarget.planNo ?? deleteTarget.id);
      setTrips((current) => current.filter((trip) => trip.id !== deleteTarget.id));
      setDeleteTarget(null);
      setError("");
    } catch (deleteError) {
      console.error("계획을 삭제하지 못했습니다.", deleteError);
      setError("계획을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
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
      <S.MainColumn>
      <SensorSection />
      <S.Section aria-label="저장한 여행">
        <S.SectionHeading><div><h2>나의 여행 계획</h2><p>직접 골라 연결한 나만의 여행입니다.</p></div><Link to="/map?mode=j">+ 계획 만들기</Link></S.SectionHeading>
        <S.Notice>현재 계정으로 DB에 저장한 여행 계획입니다. 로그인하면 다른 기기에서도 확인할 수 있습니다.</S.Notice>
        {isTripsLoading ? <S.Notice>저장된 계획을 불러오는 중입니다.</S.Notice> : visibleTrips.length ? <S.TripList>{visibleTrips.map((trip) => <S.Trip key={trip.id}>
          <h3>{trip.name}</h3><time>{formatSavedDate(trip.updatedAt || trip.createdAt)} 저장 · {trip.places.length}개 장소</time>
          <S.Origin><FaMapMarkerAlt />출발: {trip.origin.placeName || trip.origin.address || "지도에서 선택한 위치"}</S.Origin>
          <ol>{trip.places.map((place, index) => <li key={`${place.placeNo}-${index}`}>{place.placeName || `장소 ${place.placeNo}`}</li>)}</ol>
          <S.Actions><Link to={getTripMapUrl(trip)} aria-label={`${trip.name} 지도에서 보기`}>지도에서 코스 보기 →</Link><button type="button" aria-label={`${trip.name} 삭제`} onClick={() => { setError(""); setDeleteTarget(trip); }}>삭제</button></S.Actions>
        </S.Trip>)}</S.TripList> : <S.Empty><FaRoute /><h3>아직 저장한 여행 계획이 없어요.</h3><p>가고 싶은 장소를 연결하고 첫 계획을 저장해보세요.</p></S.Empty>}
      </S.Section>
      </S.MainColumn>
    </S.Layout>
    {editing && <ProfileEditor user={user} onClose={() => setEditing(false)} onSaved={(message) => { setProfileMessage(message); setEditing(false); }} />}
    <Modal isOpen={Boolean(deleteTarget)} title="저장한 여행 삭제" message={`“${deleteTarget?.name || ""}”을 삭제하시겠습니까? 삭제한 여행은 복구할 수 없습니다.`}
      confirmText={isDeleting ? "삭제 중..." : "삭제"} confirmVariant="danger" pending={isDeleting} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)}>
      {error && <p role="alert">{error}</p>}
    </Modal>
  </S.Container></S.Page>;
}
