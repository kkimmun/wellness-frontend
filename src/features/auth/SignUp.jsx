// src/features/auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  SignupContainer,
  Card,
  Header,
  Title,
  Subtitle,
  Form,
  InputGrid,
  InputGroup,
  ErrorMessage,
} from "./SignUp.styles";
import { BackButton } from "../../components/Button/BackButton";
import { PrimaryButton } from "../../components/Button/Button.styles";
import { BaseInput } from "../../components/Input/Input.styles";
import { PasswordInput } from "../../components/Input/PasswordInput";
import { AuthAPI } from "../../api/auth";

// 비밀번호 정규식 (영문, 숫자 포함 8~20자)
const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    memberName: "",
    memberId: "",
    memberPwd: "",
    memberPwdConfirm: "",
  });

  const [memberNameError, setMemberNameError] = useState("");
  const [memberPwdError, setMemberPwdError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 보안 강화를 위해 sessionStorage 사용
    const verifiedEmail = sessionStorage.getItem("verifiedEmail");
    if (!verifiedEmail) {
      alert("이메일 인증이 필요합니다.");
      navigate("/request-email", { replace: true });
    } else {
      setPayload((prev) => ({ ...prev, memberId: verifiedEmail }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));

    if (name === "memberName") setMemberNameError("");
    if (name === "memberPwd" || name === "memberPwdConfirm") setMemberPwdError("");
    setSignupError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasAnyError = false;

    // 닉네임 검사: 빈값 및 길이 제한
    if (!payload.memberName.trim()) {
      setMemberNameError("닉네임을 입력해주세요.");
      hasAnyError = true;
    } else if (payload.memberName.trim().length < 2 || payload.memberName.trim().length > 10) {
      setMemberNameError("닉네임은 2자 이상 10자 이하로 입력해주세요.");
      hasAnyError = true;
    }

    // 비밀번호 검사: 빈값, 정규식, 일치 여부
    if (!payload.memberPwd) {
      setMemberPwdError("비밀번호를 입력해주세요.");
      hasAnyError = true;
    } else if (!pwdRegex.test(payload.memberPwd)) {
      setMemberPwdError("비밀번호는 영문, 숫자를 포함하여 8~20자로 입력해주세요.");
      hasAnyError = true;
    } else if (payload.memberPwd !== payload.memberPwdConfirm) {
      setMemberPwdError("비밀번호가 일치하지 않습니다.");
      hasAnyError = true;
    }

    if (hasAnyError) return;

    try {
      setIsLoading(true);
      await AuthAPI.signup({
        memberName: payload.memberName,
        memberId: payload.memberId,
        memberPwd: payload.memberPwd
      });

      alert("회원가입이 완료되었습니다!");
      sessionStorage.removeItem("verifiedEmail");
      navigate("/login");
    } catch (err) {
      setSignupError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContainer>
      <Card>
        <Header>
          <Title>회원가입</Title>
          <BackButton onClick={() => navigate(-1)} />
        </Header>

        <Subtitle>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Subtitle>

        {signupError && <ErrorMessage style={{ textAlign: "center", marginBottom: "1rem" }}>{signupError}</ErrorMessage>}

        <Form onSubmit={handleSubmit} noValidate>
          <InputGrid>
            <InputGroup>
              <label>닉네임</label>
              <BaseInput
                name="memberName"
                value={payload.memberName}
                onChange={handleChange}
                placeholder="2자~10자 이내 입력"
                $hasError={!!memberNameError}
              />
              {memberNameError && <ErrorMessage>{memberNameError}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <label>이메일</label>
              <BaseInput
                name="memberId"
                type="email"
                value={payload.memberId}
                readOnly
                placeholder="인증된 이메일 없음"
              />
            </InputGroup>

            <InputGroup>
              <label>비밀번호</label>
              <PasswordInput
                name="memberPwd"
                value={payload.memberPwd}
                onChange={handleChange}
                placeholder="영문, 숫자 포함 8~20자"
                hasError={!!memberPwdError}
                required
              />
            </InputGroup>

            <InputGroup>
              <label>비밀번호 확인</label>
              <PasswordInput
                name="memberPwdConfirm"
                value={payload.memberPwdConfirm}
                onChange={handleChange}
                placeholder="비밀번호 다시 입력"
                hasError={!!memberPwdError}
                required
              />
              {memberPwdError && <ErrorMessage>{memberPwdError}</ErrorMessage>}
            </InputGroup>
          </InputGrid>

          <PrimaryButton $size="lg" $fullWidth type="submit" disabled={isLoading}>
            {isLoading ? "가입 처리중..." : "회원가입"}
          </PrimaryButton>
        </Form>
      </Card>
    </SignupContainer>
  );
};

export default SignUp;
