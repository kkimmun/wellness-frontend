/**
 * JWT Access Token 유틸리티
 *
 * 로그인 응답 body로 전달받아 localStorage에 저장한 accessToken의
 * payload를 디코딩하여 권한(role) 값을 확인하는 데 사용한다.
 * 외부 라이브러리 없이 브라우저 내장 atob으로 payload 세그먼트만 해석한다.
 */

/** accessToken payload를 객체로 반환한다. 실패 시 null. */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * accessToken payload에서 권한 값을 추출한다.
 * 백엔드 클레임 키가 확정되지 않아 role / auth / authorities 등을 순차 확인한다.
 */
export function getRoleFromToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const raw =
    payload.role ??
    payload.auth ??
    payload.authority ??
    payload.roles ??
    payload.authorities ??
    null;

  if (Array.isArray(raw)) return raw.join(",");
  return raw;
}

/** 권한 문자열이 관리자 권한을 포함하는지 확인한다. */
export function isAdminRole(role) {
  return typeof role === "string" && role.toUpperCase().includes("ADMIN");
}

/**
 * accessToken이 만료되었는지 확인한다.
 * payload에 exp(초 단위 만료시각)가 없으면 만료로 판단하지 않는다.
 */
export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= payload.exp * 1000;
}

/** 유효한(만료되지 않은) 토큰에서만 권한 값을 반환한다. */
export function getValidRole(token) {
  if (!token || isTokenExpired(token)) return null;
  return getRoleFromToken(token);
}
