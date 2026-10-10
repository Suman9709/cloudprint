import axios from "axios";

// In development Vite proxies /api to Django. Keeping this relative means the
// authentication and CSRF cookies are issued to the same browser origin.
const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const csrfToken = () => document.cookie.match(/(?:^|; )csrftoken=([^;]*)/)?.[1];

export const ensureCsrf = async () => {
  await api.get("/api/accounts/csrf/");
  const token = csrfToken();
  return token ? { "X-CSRFToken": decodeURIComponent(token) } : {};
};

export const apiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    const first = Object.values(error.response?.data ?? {})[0];
    if (typeof first === "string") return first;
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return fallback;
};
