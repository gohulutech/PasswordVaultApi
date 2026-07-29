export type AuthResponse = {
  accessToken: string;
  userId: number;
  username: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

const API_BASE_URL = import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL;
const JSON_HEADERS = { "Content-Type": "application/json" };

async function fetchJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
    return null;
  }
}

export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse | null> => {
  return fetchJson<AuthResponse>(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(request),
  });
};

export const login = async (
  request: LoginRequest,
): Promise<AuthResponse | null> => {
  return fetchJson<AuthResponse>(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(request),
  });
};

export const refreshToken = async (): Promise<AuthResponse | null> => {
  return fetchJson<AuthResponse>(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: JSON_HEADERS,
  });
};

export const logout = async (accessToken: string): Promise<void> => {
  await fetchJson<unknown>(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
