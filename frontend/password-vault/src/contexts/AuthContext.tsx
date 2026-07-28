import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
} from "../services/auth-service";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../services/auth-service";

type AuthState = {
  accessToken: string | null;
  refreshTokenValue: string | null;
  userId: number | null;
  username: string | null;
  isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
  login: (request: LoginRequest) => Promise<boolean>;
  register: (request: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function mapResponseToState(response: AuthResponse): AuthState {
  return {
    accessToken: response.accessToken,
    refreshTokenValue: response.refreshToken,
    userId: response.userId,
    username: response.username,
    isAuthenticated: true,
  };
}

const UNAUTHENTICATED_STATE: AuthState = {
  accessToken: null,
  refreshTokenValue: null,
  userId: null,
  username: null,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(UNAUTHENTICATED_STATE);

  const login = useCallback(
    async (request: LoginRequest): Promise<boolean> => {
      const response = await apiLogin(request);
      if (!response) return false;

      setAuthState(mapResponseToState(response));
      return true;
    },
    [],
  );

  const register = useCallback(
    async (request: RegisterRequest): Promise<boolean> => {
      const response = await apiRegister(request);
      if (!response) return false;

      setAuthState(mapResponseToState(response));
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    if (authState.accessToken) {
      await apiLogout(authState.accessToken);
    }
    setAuthState(UNAUTHENTICATED_STATE);
  }, [authState.accessToken]);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (!authState.refreshTokenValue) return false;

    const response = await apiRefreshToken(authState.refreshTokenValue);
    if (!response) {
      setAuthState(UNAUTHENTICATED_STATE);
      return false;
    }

    setAuthState((prev) => ({
      ...prev,
      accessToken: response.accessToken,
      refreshTokenValue: response.refreshToken,
    }));
    return true;
  }, [authState.refreshTokenValue]);

  return (
    <AuthContext.Provider
      value={{ ...authState, login, register, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
