import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Modal } from "../../components/Modal/Modal";
import { useAuth } from "../../context/AuthContext";
import { MemberProfileAPI } from "../../api/memberProfile";
import { getProfileImage } from "./myPageModel";
import * as S from "./ProfileEditor.styles";

export default function ProfileEditor({ user, onClose, onSaved }) {
  const { applyProfile, logout } = useAuth();
  const [section, setSection] = useState("name");
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(user?.memberName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resetPhoto, setResetPhoto] = useState(false);
  const formRef = useRef(null);
  const busy = useRef(false);
  const active = useRef(true);
  const fileInput = useRef(null);
  useEffect(() => {
    active.current = true;
    const controller = new AbortController();
    MemberProfileAPI.get(controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setProfile(result); setName(result.memberName || ""); setLoading(false);
    }).catch((failure) => {
      if (!controller.signal.aborted) { setError(failure?.message || "회원정보를 불러오지 못했습니다. 잠시 후 다시 열어주세요."); setLoading(false); setProfile(null); }
    });
    return () => { active.current = false; controller.abort(); };
  }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const pickPhoto = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!/^image\/(jpeg|png|gif|webp)$/.test(selected.type) || selected.size > 1024 * 1024 || !selected.size) {
      setError("1MB 이하의 JPG, PNG, GIF, WEBP 이미지를 선택해주세요."); event.target.value = ""; return;
    }
    setError(""); setResetPhoto(false); setFile(selected); setPreview(URL.createObjectURL(selected));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy.current || loading || !profile) return;
    setError("");
    if (section === "password" && profile.socialProvider !== "BASIC") { setError("소셜 로그인 서비스에서 비밀번호를 변경해주세요."); return; }
    if (section === "password" && newPassword !== confirmation) { setError("새 비밀번호가 일치하지 않습니다."); return; }
    if (section === "password" && currentPassword === newPassword) { setError("현재 비밀번호와 다른 비밀번호를 입력해주세요."); return; }
    if (section === "photo" && !file && !resetPhoto) { setError("변경할 사진을 선택해주세요."); return; }
    busy.current = true; setPending(true);
    try {
      if (section === "password") {
        await MemberProfileAPI.updatePassword(currentPassword, newPassword);
        // 서버 변경 성공 후에만 인증을 정리하며, 비밀번호는 저장소에 기록하지 않는다.
        try { await logout(); } catch { /* 로그아웃 실패와 관계없이 로컬 인증은 정리된다. */ }
        window.location.replace("/login"); return;
      }
      const updated = section === "name" ? await MemberProfileAPI.updateName(name)
        : resetPhoto ? await MemberProfileAPI.removePhoto() : await MemberProfileAPI.uploadPhoto(file);
      if (!active.current) return;
      applyProfile(updated);
      onSaved(section === "name" ? "닉네임을 변경했습니다." : "프로필 사진을 변경했습니다.");
    } catch (failure) {
      if (active.current) setError(failure?.message || "저장하지 못했습니다. 다시 시도해주세요.");
    } finally {
      busy.current = false; if (active.current) setPending(false);
    }
  };

  const changeSection = (next) => {
    setSection(next); setError(""); setCurrentPassword(""); setNewPassword(""); setConfirmation("");
  };
  const image = resetPhoto ? null : preview || getProfileImage(profile);
  return <Modal isOpen title="회원정보 수정" size="wide" showClose onCancel={onClose}
    pending={pending} confirmText={pending ? "저장 중…" : section === "password" ? "변경 후 다시 로그인" : "저장"}
    onConfirm={() => formRef.current?.requestSubmit()}>
    <S.Editor>
      <S.Tabs aria-label="회원정보 수정 항목">
        {[["name", "닉네임"], ["photo", "프로필 사진"], ["password", "비밀번호"]].map(([key, label]) => <button type="button" key={key} aria-pressed={section === key} disabled={pending || loading || !profile} onClick={() => changeSection(key)}>{label}</button>)}
      </S.Tabs>
      {loading && <p role="status">회원정보를 불러오는 중입니다.</p>}
      <form ref={formRef} onSubmit={submit}>
        <fieldset disabled={pending || loading || !profile}>
          {section === "name" && <><label htmlFor="profile-name">닉네임</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={12} pattern="\S{2,12}" autoComplete="nickname" /><p>공백 없이 2~12자 · 로그인 아이디는 변경되지 않습니다.</p></>}
          {section === "photo" && <><S.Preview>{image ? <img src={image} alt="프로필 사진 미리보기" /> : <FaUserCircle size={96} />}</S.Preview><label htmlFor="profile-photo">프로필 사진 선택</label><input ref={fileInput} id="profile-photo" type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={pickPhoto} /><p>JPG, PNG, GIF, WEBP · 최대 1MB<br />사진 선택 후 저장을 눌러야 변경됩니다.</p><S.Reset type="button" onClick={() => { setResetPhoto(true); setFile(null); setPreview(null); setError(""); if (fileInput.current) fileInput.current.value = ""; }}>기본 프로필 사용</S.Reset></>}
          {section === "password" && (profile?.socialProvider === "BASIC" ? <>
            <label htmlFor="profile-current-password">현재 비밀번호</label><input id="profile-current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required maxLength={72} autoComplete="current-password" />
            <label htmlFor="profile-new-password">새 비밀번호</label><input id="profile-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={6} maxLength={15} pattern="(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,15}" autoComplete="new-password" />
            <label htmlFor="profile-confirm-password">새 비밀번호 확인</label><input id="profile-confirm-password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required maxLength={15} autoComplete="new-password" />
            <p>영문과 숫자를 포함한 6~15자입니다. 변경 후 새 비밀번호로 다시 로그인해주세요.</p>
          </> : <p>소셜 로그인 계정은 카카오·Google 등 가입한 서비스에서 비밀번호를 변경해주세요.</p>)}
        </fieldset>
      </form>
      {error && <p role="alert">{error}</p>}
    </S.Editor>
  </Modal>;
}
