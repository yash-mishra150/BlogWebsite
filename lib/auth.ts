export function isBrowser() {
  return typeof window !== 'undefined';
}

const TOKEN_KEY = 'token';

export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event('authChange'));
  } catch {}
}

export function clearToken() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('authChange'));
  } catch {}
}
