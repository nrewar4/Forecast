import { lazy, Suspense, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { RequireAdmin } from "@/components/RequireAdmin";
import { trackPageView } from "@/lib/analytics";

// Redirects a stale path to a new one while preserving the query string, so
// deep links like /clients?q=Acme keep working after a page is merged/moved.
function RedirectWithQuery({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
}

// Records a first-party page view for every route change (see lib/analytics).
function TrackPageViews() {
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
const Login = lazy(() => import("./pages/Login"));
const CustomSynthesis = lazy(() => import("./pages/CustomSynthesis"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TradeAnalytics = lazy(() => import("./pages/TradeAnalytics"));
const DemandForecast = lazy(() => import("./pages/DemandForecast"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const TradePartners = lazy(() => import("./pages/TradePartners"));
const Documents = lazy(() => import("./pages/Documents"));
const SynthesisRoutes = lazy(() => import("./pages/SynthesisRoutes"));
const SynthesisProcess = lazy(() => import("./pages/synthesis/Process"));
const SynthesisScaleUp = lazy(() => import("./pages/synthesis/ScaleUp"));
const SynthesisEnquiry = lazy(() => import("./pages/synthesis/Enquiry"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        Loading
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <TrackPageViews />
      <Routes>
        {/* Public landing + static marketing pages. Buy links out to apacss.com. */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/custom-synthesis" element={<CustomSynthesis />} />

        {/* The "Knowledge" option enters the live platform here. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        {/* Product Research is now merged into the Knowledge Base. */}
        <Route path="/product-research" element={<Navigate to="/knowledge-base" replace />} />

        {/* Custom synthesis workspace, reached from the Custom Synthesis page. */}
        <Route path="/synthesis" element={<Navigate to="/synthesis/routes" replace />} />
        <Route path="/synthesis/routes" element={<SynthesisRoutes />} />
        <Route path="/synthesis/process" element={<SynthesisProcess />} />
        <Route path="/synthesis/scale-up" element={<SynthesisScaleUp />} />
        <Route path="/synthesis/enquiry" element={<SynthesisEnquiry />} />
        <Route path="/synthesis-routes" element={<Navigate to="/synthesis/routes" replace />} />

        {/* Admin-only sections. */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/trade-analytics" element={<RequireAdmin><TradeAnalytics /></RequireAdmin>} />
        <Route path="/demand-forecast" element={<RequireAdmin><DemandForecast /></RequireAdmin>} />
        <Route path="/partners" element={<RequireAdmin><TradePartners /></RequireAdmin>} />
        <Route path="/documents" element={<RequireAdmin><Documents /></RequireAdmin>} />
        {/* Clients (Buyers) and Suppliers (Manufacturers) are merged into Trade Partners. */}
        <Route path="/clients" element={<RedirectWithQuery to="/partners" />} />
        <Route path="/suppliers" element={<RedirectWithQuery to="/partners" />} />

        {/* Stale links (removed Publications, Studio, Integrations) fall back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
