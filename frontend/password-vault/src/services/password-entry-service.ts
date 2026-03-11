import type { PasswordEntryPreview } from "../models/PasswordEntryPreview";

export const getPasswordEntries = async () => {
  const url = "http://localhost:5174/api/password";
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
      console.error("Unknown error", error);
    }
  }
};
