import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminSession, loginAdmin, logoutAdmin } from "@/lib/auth";

// App-wide admin auth state. Wraps the router so any page can read isAdmin and
// the guard below can redirect anonymous visitors away from admin pages.

type AuthContextValue = {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminSession());

  const login = useCallback(async (username: string, password: string) => {
    const ok = await loginAdmin(username, password);
    if (ok) setIsAdmin(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setIsAdmin(false);
  }, []);

  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

// Route guard: renders children for an admin, otherwise redirects to /login and
// remembers where the visitor was heading so login can return them there.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
