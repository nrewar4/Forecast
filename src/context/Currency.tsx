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
  const [currency, setCurrencyState] = useState<Currency>(readInitial);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, []);

  const toggle = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "USD" ? "INR" : "USD";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo<CurrencyValue>(() => {
    const rate = currency === "INR" ? USD_TO_INR : 1;
    const symbol = SYMBOL[currency];
    const convert = (usdValue: number) => usdValue * rate;
    return {
      currency,
      symbol,
      rate,
      setCurrency,
      toggle,
      convert,
      money: (usdValue: number) => symbol + compact(usdValue * rate),
    };
  }, [currency, setCurrency, toggle]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
