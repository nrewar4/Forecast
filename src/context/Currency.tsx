import { createContext, useContext, useMemo, type ReactNode } from "react";
import { compact } from "@/lib/utils";

// The platform displays every figure in USD. The trade data is denominated in
// USD, so there is no conversion. This context stays as a thin, stable seam so
// that call sites using money()/convert() keep working, and so a currency
// switch could be reintroduced later without touching every page.
export type Currency = "USD";

const CurrencyContext = createContext<CurrencyValue | null>(null);

type CurrencyValue = {
  currency: Currency;
  symbol: string;
  rate: number;
  // Converts a USD amount into the active currency (identity in USD-only mode).
  convert: (usdValue: number) => number;
  // USD amount -> short, symbol prefixed string, e.g. money(5_000_000) -> "$5M".
  money: (usdValue: number) => string;
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const value = useMemo<CurrencyValue>(
    () => ({
      currency: "USD",
      symbol: "$",
      rate: 1,
      convert: (usdValue: number) => usdValue,
      money: (usdValue: number) => "$" + compact(usdValue),
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
