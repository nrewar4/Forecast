import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { compact } from "@/lib/utils";

export type Currency = "USD" | "INR";

// Indicative USD -> INR conversion. The trade data is denominated in USD, so we
// convert on display only. Update this single constant to refresh the rate.
export const USD_TO_INR = 85;

const SYMBOL: Record<Currency, string> = { USD: "$", INR: "₹" };
const STORAGE_KEY = "apac.currency.v1";

type CurrencyValue = {
  currency: Currency;
  symbol: string;
  rate: number;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  // Converts a USD amount into the active currency.
  convert: (usdValue: number) => number;
  // USD amount -> short, symbol prefixed string in the active currency.
  // e.g. money(5_000_000) -> "$5M" (USD) or "₹425M" (INR).
  money: (usdValue: number) => string;
};

const CurrencyContext = createContext<CurrencyValue | null>(null);

function readInitial(): Currency {
  if (typeof window === "undefined") return "USD";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "INR" ? "INR" : "USD";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // The platform is USD only. setCurrency and toggle are kept as no-ops so every
  // existing money()/convert() call site keeps working without an INR path.
  const value = useMemo<CurrencyValue>(
    () => ({
      currency: "USD",
      symbol: SYMBOL.USD,
      rate: 1,
      setCurrency: () => {},
      toggle: () => {},
      convert: (usdValue: number) => usdValue,
      money: (usdValue: number) => SYMBOL.USD + compact(usdValue),
    }),
    [],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
