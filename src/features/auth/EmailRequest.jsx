import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthContainer,
  Card,
  CardTop,
  Header,
  Title,
  Form,
  InputGroup,
  ErrorMessage,
} from "./AuthEmail.styles";
import { BackButton } from "../../components/Button/BackButton";
import { PrimaryButton } from "../../components/Button/Button.styles";
import { BaseInput } from "../../components/Input/Input.styles";
import { AuthAPI } from "../../api/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailRequest = () => {
  const navigate = useNavigate();
  const [requestEmail, setRequestEmail] = useState("");
  const [requestEmailError, setRequestEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setRequestEmail(e.target.value);
    if (requestEmailError) setRequestEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestEmail.trim()) {
      setRequestEmailError("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex.test(requestEmail)) {
      setRequestEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      setIsLoading(true);
      await AuthAPI.sendVerificationEmail(requestEmail);
      navigate("/verify-code", { state: { requestEmail } });
    } catch (err) {
      setRequestEmailError(err.message || "이메일 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Card>
        <CardTop>
          <Header>
            <Title>이메일 입력</Title>
            <BackButton onClick={() => navigate(-1)} />
          </Header>

          <Form onSubmit={handleSubmit} noValidate>
            <InputGroup>
              <label>이메일을 입력해주세요</label>
              <BaseInput
                type="email"
                name="requestEmail"
                placeholder="michael.joe@xmail.com"
                value={requestEmail}
                onChange={handleChange}
                $hasError={!!requestEmailError}
              />
              {requestEmailError && <ErrorMessage>{requestEmailError}</ErrorMessage>}
            </InputGroup>

            <PrimaryButton $size="lg" $fullWidth type="submit" disabled={isLoading}>
              {isLoading ? "발송 중..." : "보내기"}
            </PrimaryButton>
          </Form>
        </CardTop>
      </Card>
    </AuthContainer>
  );
};

export default EmailRequest;
