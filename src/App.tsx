import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

// Redirects a stale path to a new one while preserving the query string, so
// deep links like /clients?q=Acme keep working after a page is merged/moved.
function RedirectWithQuery({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
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

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        Loading…
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public landing + static marketing pages. Buy links out to apacss.com. */}
        <Route path="/" element={<Landing />} />
        <Route path="/custom-synthesis" element={<CustomSynthesis />} />
        {/* The "Knowledge" option enters the live platform here. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade-analytics" element={<TradeAnalytics />} />
        <Route path="/demand-forecast" element={<DemandForecast />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        {/* Product Research is now merged into the Knowledge Base. */}
        <Route path="/product-research" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/partners" element={<TradePartners />} />
        {/* Clients (Buyers) and Suppliers (Manufacturers) are merged into Trade Partners. */}
        <Route path="/clients" element={<RedirectWithQuery to="/partners" />} />
        <Route path="/suppliers" element={<RedirectWithQuery to="/partners" />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/synthesis-routes" element={<SynthesisRoutes />} />
        {/* Stale links (e.g. the removed Integrations page) fall back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
