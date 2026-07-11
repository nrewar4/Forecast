import { lazy, Suspense, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { RequireAdmin } from "./context/Auth";
import { trackPageView } from "./lib/analytics";
import { ChatWidget } from "./components/chat/ChatWidget";

// Records a page view on every route change for the Admin Dashboard analytics.
function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Each page is code split into its own chunk so the first paint only downloads
// the route the user actually opens. Heavy dependencies (charts, the large
// product/research datasets) load on demand instead of all up front, which is
// the main load time win.
const Landing = lazy(() => import("./pages/Landing"));
const Cdmo = lazy(() => import("./pages/Cdmo"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const SynthesisRoutes = lazy(() => import("./pages/SynthesisRoutes"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        Loading...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <RouteTracker />
      <Routes>
        {/* Public: landing and the CDMO conversion experience. Buy links out to apacss.com. */}
        <Route path="/" element={<Landing />} />
        <Route path="/cdmo" element={<Cdmo />} />
        <Route path="/login" element={<Login />} />

        {/* Public workspace: Product Discovery and the market overview. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />

        {/* Admin only: the internal ML-assisted synthesis route explorer. */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/synthesis-routes" element={<RequireAdmin><SynthesisRoutes /></RequireAdmin>} />

        {/* Legacy paths from earlier versions of the app. */}
        <Route path="/custom-synthesis" element={<Navigate to="/cdmo" replace />} />
        <Route path="/product-research" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/partners" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/clients" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/suppliers" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/trade-analytics" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/demand-forecast" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/documents" element={<Navigate to="/knowledge-base" replace />} />

        {/* Anything unknown falls back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating AI assistant, persistent across route changes on public pages. */}
      <ChatWidget />
    </Suspense>
  );
}
