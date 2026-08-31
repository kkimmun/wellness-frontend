import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AuthContainer,
  Card,
  CardTop,
  Header,
  Title,
  Form,
  InputGroup,
  TimerWrapper,
  TimerText,
  ResendButton,
  ErrorMessage,
} from "./AuthEmail.styles";
import { BackButton } from "../../components/Button/BackButton";
import { PrimaryButton } from "../../components/Button/Button.styles";
import { BaseInput } from "../../components/Input/Input.styles";
import { AuthAPI } from "../../api/auth";

const EmailVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestEmail = location.state?.requestEmail || "";

  const [authCode, setAuthCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!requestEmail) {
      alert("잘못된 접근입니다.");
      navigate("/request-email", { replace: true });
    }
  }, [requestEmail, navigate]);

  // 타이머 최적화: 의존성 없이 콜백으로 상태 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    setAuthCode(e.target.value);
    if (codeError) setCodeError("");
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setCodeError("");
      await AuthAPI.sendVerificationEmail(requestEmail);
      setTimeLeft(180); // 타이머 리셋
      alert("인증코드가 재전송되었습니다.");
    } catch (err) {
      setCodeError(err.message || "재전송에 실패했습니다.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setCodeError("인증 시간이 만료되었습니다. 재전송을 눌러주세요.");
      return;
    }

    if (!authCode.trim() || authCode.length !== 5) {
      setCodeError("인증코드는 5자리여야 합니다.");
      return;
    }

    try {
      setIsLoading(true);
      await AuthAPI.verifyEmailCode(requestEmail, authCode);
      
      // 보안성 강화를 위해 sessionStorage에 저장 (창 닫으면 증발)
      sessionStorage.setItem("verifiedEmail", requestEmail);
      alert("이메일 인증이 완료되었습니다.");
      navigate("/signup");
    } catch (err) {
      setCodeError(err.message || "인증번호가 일치하지 않거나 만료되었습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Card>
        <CardTop>
          <Header>
            <Title>인증코드 입력</Title>
            <BackButton onClick={() => navigate(-1)} />
          </Header>

          <Form onSubmit={handleSubmit} noValidate>
            <InputGroup>
              <label>{requestEmail} 으로 발송된 인증코드 5자리를 입력해주세요.</label>
              <BaseInput
                type="text"
                name="authCode"
                placeholder="인증코드를 입력해주세요 (5자리)"
                value={authCode}
                onChange={handleChange}
                maxLength={5}
                $hasError={!!codeError}
              />

              <TimerWrapper>
                <TimerText>남은 시간: {formatTime(timeLeft)}</TimerText>
                <ResendButton type="button" onClick={handleResend} disabled={isResending}>
                  {isResending ? "발송 중..." : "재발송"}
                </ResendButton>
              </TimerWrapper>

              {codeError && <ErrorMessage>{codeError}</ErrorMessage>}
            </InputGroup>

            <PrimaryButton $size="lg" $fullWidth type="submit" disabled={isLoading || isResending}>
              {isLoading ? "확인 중..." : "입력하기"}
            </PrimaryButton>
          </Form>
        </CardTop>
      </Card>
    </AuthContainer>
  );
};

export default EmailVerify;
