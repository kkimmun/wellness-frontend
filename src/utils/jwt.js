
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

export function isAdminRole(role) {
  return typeof role === "string" && role.toUpperCase().includes("ADMIN");
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= payload.exp * 1000;
}

export function getValidRole(token) {
  if (!token || isTokenExpired(token)) return null;
  return getRoleFromToken(token);
}
