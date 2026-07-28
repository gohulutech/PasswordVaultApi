import type { PasswordEntryCreate } from "../models/PasswordEntryCreate";
import type { PasswordEntryDetail } from "../models/PasswordEntryDetail";
import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import type { PasswordEntryUpdate } from "../models/PasswordEntryUpdate";

let currentAccessToken: string | null = null;
let refreshAccessTokenFn: (() => Promise<boolean>) | null = null;

export const setAccessTokenProvider = (
  token: string | null,
  refreshFn: () => Promise<boolean>,
) => {
  currentAccessToken = token;
  refreshAccessTokenFn = refreshFn;
};

const authHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (currentAccessToken) {
    headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return headers;
};

const authJsonHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const fetchWithAuth = async (
  url: string,
  init?: RequestInit,
): Promise<Response> => {
  const response = await fetch(url, init);
  if (response.status === 401 && refreshAccessTokenFn) {
    const refreshed = await refreshAccessTokenFn();
    if (refreshed) {
      return fetch(url, {
        ...init,
        headers: {
          ...(init?.headers as Record<string, string>),
          ...authHeaders(),
        },
      });
    }
  }
  return response;
};

export const getPasswordEntries = async () => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/password`;
  try {
    const response = await fetchWithAuth(url, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as PasswordEntryPreview[];
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
  }
};

export const getPasswordEntry = async (id: number) => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/password/${id}`;
  try {
    const response = await fetchWithAuth(url, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as PasswordEntryDetail;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export const createPasswordEntry = async (
  passwordEntry: PasswordEntryCreate,
) => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/password`;
  try {
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify(passwordEntry),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as PasswordEntryDetail;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export const updatePasswordEntry = async (
  passwordEntry: PasswordEntryUpdate,
) => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/password/${passwordEntry.id}`;
  try {
    const response = await fetchWithAuth(url, {
      method: "PUT",
      headers: authJsonHeaders(),
      body: JSON.stringify(passwordEntry),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = (await response.json()) as PasswordEntryDetail;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};
