export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse | null> => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/auth/register`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as AuthResponse;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
    return null;
  }
};

export const login = async (
  request: LoginRequest,
): Promise<AuthResponse | null> => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/auth/login`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as AuthResponse;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
    return null;
  }
};

export const refreshToken = async (
  token: string,
): Promise<AuthResponse | null> => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/auth/refresh`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token }),
    });
    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as AuthResponse;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
    return null;
  }
};

export const logout = async (accessToken: string): Promise<void> => {
  const url = `${import.meta.env.VITE_PASSWORD_VAULT_API_BASE_URL}/api/auth/logout`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("error", error);
    }
  }
};
