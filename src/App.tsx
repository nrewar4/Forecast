import { lazy, Suspense, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { RequireAdmin } from "./context/Auth";
import { trackPageView } from "./lib/analytics";

// Redirects a stale path to a new one while preserving the query string, so
// deep links like /clients?q=Acme keep working after a page is merged/moved.
function RedirectWithQuery({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
}

// Records a page view on every route change for the Admin Dashboard analytics.
function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Each page is code split into its own chunk so the first paint only downloads
// the route the user actually opens. Heavy dependencies (charts, the xlsx
// parser, the large product/research datasets) load on demand instead of all
// up front, which is the main load time win.
const Landing = lazy(() => import("./pages/Landing"));
const CustomSynthesis = lazy(() => import("./pages/CustomSynthesis"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TradeAnalytics = lazy(() => import("./pages/TradeAnalytics"));
const DemandForecast = lazy(() => import("./pages/DemandForecast"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const TradePartners = lazy(() => import("./pages/TradePartners"));
const Documents = lazy(() => import("./pages/Documents"));
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
        {/* Public: landing and marketing pages. Buy links out to apacss.com. */}
        <Route path="/" element={<Landing />} />
        <Route path="/custom-synthesis" element={<CustomSynthesis />} />
        <Route path="/login" element={<Login />} />

        {/* Public workspace: the Knowledge platform. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/partners" element={<TradePartners />} />

        {/* Public workspace: the Custom Synthesis explorer (reached from the
            Custom Synthesis page, intentionally not in the top navigation). */}
        <Route path="/synthesis-routes" element={<SynthesisRoutes />} />

        {/* Admin only: internal analytics and data tooling. */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/trade-analytics" element={<RequireAdmin><TradeAnalytics /></RequireAdmin>} />
        <Route path="/demand-forecast" element={<RequireAdmin><DemandForecast /></RequireAdmin>} />
        <Route path="/documents" element={<RequireAdmin><Documents /></RequireAdmin>} />

        {/* Legacy paths from earlier versions of the app. */}
        <Route path="/product-research" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/clients" element={<RedirectWithQuery to="/partners" />} />
        <Route path="/suppliers" element={<RedirectWithQuery to="/partners" />} />

        {/* Anything unknown falls back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
