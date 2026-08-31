import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LoginContainer,
  Card,
  CardTop,
  CardBottom,
  Header,
  Subtitle,
  Title,
  Form,
  InputGroup,
  ErrorMessage,
  FormErrorMessage,
  GoogleLoginButton,
} from "./Login.styles";
import { BackButton } from "../../components/Button/BackButton";
import { PrimaryButton } from "../../components/Button/Button.styles";
import { BaseInput } from "../../components/Input/Input.styles";
import { PasswordInput } from "../../components/Input/PasswordInput";
import { AuthAPI } from "../../api/auth";

import { useAuth } from "../../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  // 헷갈림을 방지하기 위해 payload로 변수명 변경 및 백엔드 명세 키값 적용
  const [payload, setPayload] = useState({
    memberId: "",
    memberPwd: "",
  });

  const [memberIdError, setMemberIdError] = useState("");
  const [memberPwdError, setMemberPwdError] = useState("");
  const [loginError, setLoginError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));

    if (name === "memberId") setMemberIdError("");
    if (name === "memberPwd") setMemberPwdError("");
    setLoginError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!payload.memberId.trim()) {
      setMemberIdError("아이디(이메일)를 입력해주세요.");
      hasError = true;
    } else if (!emailRegex.test(payload.memberId)) {
      setMemberIdError("올바른 이메일 형식이 아닙니다.");
      hasError = true;
    }

    if (!payload.memberPwd) {
      setMemberPwdError("비밀번호를 입력해주세요.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      // JSON (RequestBody) 형식으로 안전하게 전송
      await AuthAPI.login(payload);
      // 로그인 성공 시 전역 상태 업데이트 후 이동
      await checkAuth();
      navigate("/");
    } catch (err) {
      setLoginError(err.message || "아이디 또는 비밀번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Card>
        <CardTop>
          <Header>
            <Title>로그인</Title>
            <BackButton onClick={() => navigate(-1)} />
          </Header>

          <Subtitle>
            아직 회원이 아니신가요? <Link to="/request-email">회원가입</Link>
          </Subtitle>

          <Form onSubmit={handleSubmit} noValidate>
            {loginError && <FormErrorMessage>{loginError}</FormErrorMessage>}

            <InputGroup>
              <label>이메일을 입력해주세요</label>
              <BaseInput
                name="memberId"
                type="email"
                placeholder="michael.joe@xmail.com"
                value={payload.memberId}
                onChange={handleChange}
                $hasError={!!memberIdError}
              />
              {memberIdError && <ErrorMessage>{memberIdError}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <label>비밀번호를 입력해주세요</label>
              <PasswordInput
                name="memberPwd"
                placeholder="••••••"
                value={payload.memberPwd}
                onChange={handleChange}
                hasError={!!memberPwdError}
              />
              {memberPwdError && <ErrorMessage>{memberPwdError}</ErrorMessage>}
            </InputGroup>

            <PrimaryButton $size="lg" $fullWidth type="submit" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </PrimaryButton>
          </Form>
        </CardTop>

        <CardBottom>
          <GoogleLoginButton
            type="button"
            onClick={() => AuthAPI.loginWithGoogle()}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign in with Google
          </GoogleLoginButton>
        </CardBottom>
      </Card>
    </LoginContainer>
  );
};

export default Login;
