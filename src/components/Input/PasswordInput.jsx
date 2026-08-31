import React, { useState } from "react";
import {
  PasswordWrapper,
  StyledPasswordInput,
  ToggleButton,
} from "./PasswordInput.styles";

export const PasswordInput = ({
  value,
  onChange,
  placeholder = "비밀번호를 입력하세요",
  hasError,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault(); // 폼 제출 방지
    setShowPassword(!showPassword);
  };

  return (
    <PasswordWrapper>
      <StyledPasswordInput
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        $hasError={hasError}
        {...props}
      />
      <ToggleButton
        onClick={handleToggle}
        type="button"
        aria-label="비밀번호 표시 토글"
      >
        {/* 눈 모양 아이콘 (SVG) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {showPassword ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          )}
        </svg>
      </ToggleButton>
    </PasswordWrapper>
  );
};
