export const API_BASE = 'https://blogwebsite-iz96.onrender.com/api/v1';

export function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const urlStr = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const url = new URL(urlStr);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}
