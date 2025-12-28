/**
 * Cookie utility functions for managing authentication tokens and user data
 */

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  embassy_id: string;
}

/**
 * Check if code is running in browser
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Set a cookie with optional expiration
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (!isBrowser()) return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict; Secure`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  if (!isBrowser()) return;

  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

/**
 * Store authentication tokens in cookies
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  // Access token expires in ~1 day (matching JWT exp)
  setCookie("access_token", accessToken, 1);
  // Refresh token expires in ~7 days (matching JWT exp)
  setCookie("refresh_token", refreshToken, 7);
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | null {
  return getCookie("access_token");
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return getCookie("refresh_token");
}

/**
 * Store user data in cookies
 */
export function setUserData(user: UserData): void {
  setCookie("user_id", user.id, 7);
  setCookie("embassy_id", user.embassy_id, 7);
  setCookie("user_email", user.email, 7);
  setCookie("user_role", user.role, 7);
  setCookie("user_name", `${user.first_name} ${user.last_name}`, 7);
}

/**
 * Get user data from cookies
 */
export function getUserData(): UserData | null {
  const userId = getCookie("user_id");
  const embassyId = getCookie("embassy_id");
  const email = getCookie("user_email");
  const role = getCookie("user_role");
  const userName = getCookie("user_name");

  if (!userId || !embassyId || !email || !role || !userName) {
    return null;
  }

  const [firstName, ...lastNameParts] = userName.split(" ");
  return {
    id: userId,
    embassy_id: embassyId,
    email,
    role,
    first_name: firstName,
    last_name: lastNameParts.join(" "),
  };
}

/**
 * Get user ID from cookies
 */
export function getUserId(): string | null {
  return getCookie("user_id");
}

/**
 * Get embassy ID from cookies
 */
export function getEmbassyId(): string | null {
  return getCookie("embassy_id");
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  deleteCookie("user_id");
  deleteCookie("embassy_id");
  deleteCookie("user_email");
  deleteCookie("user_role");
  deleteCookie("user_name");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
