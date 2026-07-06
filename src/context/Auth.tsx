import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  createSession,
  readSession,
  verifyCredentials,
  type AdminSession,
} from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

type AuthValue = {
  isAdmin: boolean;
  session: AdminSession | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => readSession());

  const login = useCallback(async (username: string, password: string) => {
    const ok = await verifyCredentials(username, password);
    if (!ok) {
      trackEvent("login_failed");
      return false;
    }
    setSession(createSession(username.trim()));
    trackEvent("login");
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    trackEvent("logout");
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ isAdmin: Boolean(session), session, login, logout }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
