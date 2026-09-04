import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import { PublicRoute, AdminRoute } from "./components/Layout/AuthGuard";
import SignUp from "./features/auth/SignUp";
import EmailRequest from "./features/auth/EmailRequest";
import EmailVerify from "./features/auth/EmailVerify";
import Login from "./features/auth/Login";
import MapPage from "./features/map/MapPage";
import AdminPlace from "./features/admin/place/AdminPlace";
import AdminPlaceDetail from "./features/admin/place/AdminPlaceDetail";
import AdminPlaceForm from "./features/admin/place/AdminPlaceForm";
import AdminCourse from "./features/admin/course/AdminCourse";
import AdminCourseForm from "./features/admin/course/AdminCourseForm";
import GlobalStyles from "./styles/GlobalStyles";
import { Modal } from "./components/Modal/Modal";

function App() {
  const navigate = useNavigate();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // axios.js에서 보낸 401 세션 만료 이벤트를 감지
    const handleSessionExpired = () => {
      // Bearer 토큰 인증용으로 저장한 값 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("memberId");
      setIsSessionExpired(true);
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, []);

  const handleModalConfirm = () => {
    setIsSessionExpired(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <GlobalStyles />

      {/* 401 공통 모달 렌더링 */}
      <Modal
        isOpen={isSessionExpired}
        title="세션 만료"
        message="로그인이 만료되었습니다. 다시 로그인해주세요."
        onConfirm={handleModalConfirm}
      />

      <Routes>
        {/* 비로그인 사용자 전용 라우트 (로그인 시 접근 불가) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/request-email" element={<EmailRequest />} />
            <Route path="/verify-code" element={<EmailVerify />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Route>

        {/* 메인 서비스 화면 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/pilgrim/create" element={<MapPage />} />
          <Route path="/pilgrim/fixed" element={<MapPage />} />
          <Route path="/pilgrim/fixed/:courseNo" element={<MapPage />} />
          <Route path="/place/:placeNo" element={<MapPage />} />
          <Route path="/place/:placeNo/review" element={<MapPage />} />
          <Route path="/gimpoTop10" element={<MapPage />} />
        </Route>

        {/* 관리자 화면 (인증 + 관리자 권한 필요) */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/courses" element={<AdminCourse />} />
            <Route path="/admin/courses/add" element={<AdminCourseForm />} />
            <Route path="/admin/courses/edit/:courseNo" element={<AdminCourseForm />} />
            <Route path="/admin/courses/:courseNo/edit" element={<AdminCourseForm />} />
            <Route path="/admin/places" element={<AdminPlace />} />
            <Route path="/admin/places/add" element={<AdminPlaceForm />} />
            <Route path="/admin/places/edit/:placeNo" element={<AdminPlaceForm />} />
            <Route path="/admin/places/:placeNo" element={<AdminPlaceDetail />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
