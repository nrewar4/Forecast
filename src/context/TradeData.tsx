import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { shipments as seedShipments, type Shipment } from "@/data/trade";
import { isJunkProduct } from "@/lib/productFilter";
import { activeBackend, addUploaded, clearUploaded, loadUploaded, type Backend } from "@/lib/tradeStore";
import {
  assumedPriceFor,
  loadAssumedConfig,
  saveAssumedConfig,
  type AssumedConfig,
} from "@/lib/assumedPricing";

type TradeDataValue = {
  shipments: Shipment[];
  addShipments: (rows: Shipment[]) => Promise<void>;
  resetShipments: () => Promise<void>;
  uploadedCount: number;
  backend: Backend;
  loading: boolean;
  assumed: AssumedConfig;
  setAssumed: (next: AssumedConfig) => void;
  estimatedCount: number;
};

const TradeDataContext = createContext<TradeDataValue | null>(null);

export function TradeDataProvider({ children }: { children: ReactNode }) {
  // Uploaded rows are kept separate from the seed so a reset restores the sample.
  const [extra, setExtra] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assumed, setAssumedState] = useState<AssumedConfig>(() => loadAssumedConfig());

  useEffect(() => {
    let active = true;
    loadUploaded()
      .then((rows) => {
        if (active) setExtra(rows);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setAssumed = useCallback((next: AssumedConfig) => {
    setAssumedState(next);
    saveAssumedConfig(next);
  }, []);

  const addShipments = useCallback(
    async (rows: Shipment[]) => {
      const next = await addUploaded(rows, extra);
      setExtra(next);
    },
    [extra],
  );

  const resetShipments = useCallback(async () => {
    const next = await clearUploaded();
    setExtra(next);
  }, []);

  // Drop rows whose product name is invoice boilerplate, a supplier catalogue
  // code, a generic category, or a non-chemical good. This keeps the Overview
  // and Trade Analytics product lists to real, recognisable chemicals only.
  const raw = useMemo(
    () => [...extra, ...seedShipments].filter((s) => !isJunkProduct(s.product)),
    [extra],
  );

  // When estimation is on, rows with no declared value get an assumed value
  // derived from the assumed price per tonne, and are flagged as estimated.
  const shipments = useMemo(() => {
    if (!assumed.enabled) return raw;
    return raw.map((s) => {
      if (s.totalValue === 0 && s.quantityT > 0) {
        const price = assumedPriceFor(s.hsCode, assumed);
        return {
          ...s,
          unitPrice: price,
          totalValue: Math.round(price * s.quantityT),
          estimated: true,
        };
      }
      return s;
    });
  }, [raw, assumed]);

  const estimatedCount = useMemo(() => shipments.filter((s) => s.estimated).length, [shipments]);

  const value = useMemo<TradeDataValue>(
    () => ({
      shipments,
      addShipments,
      resetShipments,
      uploadedCount: extra.length,
      backend: activeBackend,
      loading,
      assumed,
      setAssumed,
      estimatedCount,
    }),
    [shipments, addShipments, resetShipments, extra.length, loading, assumed, setAssumed, estimatedCount],
  );

  return <TradeDataContext.Provider value={value}>{children}</TradeDataContext.Provider>;
}

export function useTradeData(): TradeDataValue {
  const ctx = useContext(TradeDataContext);
  if (!ctx) throw new Error("useTradeData must be used within TradeDataProvider");
  return ctx;
}
