import type { PasswordEntryCreate } from "../models/PasswordEntryCreate";
import type { PasswordEntryDetail } from "../models/PasswordEntryDetail";
import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";
import type { PasswordEntryUpdate } from "../models/PasswordEntryUpdate";

export const getPasswordEntries = async () => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/password`;
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
