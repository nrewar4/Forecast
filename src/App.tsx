import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TradeAnalytics from "./pages/TradeAnalytics";
import DemandForecast from "./pages/DemandForecast";
import KnowledgeBase from "./pages/KnowledgeBase";
import Clients from "./pages/Clients";
import Suppliers from "./pages/Suppliers";
import CdmoCapabilities from "./pages/CdmoCapabilities";
import Documents from "./pages/Documents";
import Integrations from "./pages/Integrations";
import Deck from "./deck/Deck";

export default function App() {
  return (
    <Routes>
      <Route path="/deck" element={<Deck />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/trade-analytics" element={<TradeAnalytics />} />
      <Route path="/demand-forecast" element={<DemandForecast />} />
      <Route path="/knowledge-base" element={<KnowledgeBase />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/cdmo-capabilities" element={<CdmoCapabilities />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/integrations" element={<Integrations />} />
    </Routes>
  );
}
