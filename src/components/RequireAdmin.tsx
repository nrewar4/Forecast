import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/Auth";

// Route guard: anything wrapped in RequireAdmin is only reachable with a valid
// admin session. Visitors are sent to the login page and returned to the page
// they asked for after signing in.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
