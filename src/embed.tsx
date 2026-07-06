import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TradeDataProvider } from "./context/TradeData";
import { CurrencyProvider } from "./context/Currency";
import "./index.css";

export type MountOptions = {
  // Base path when the app is served under a sub route of your site,
  // for example "/analytics".
  basename?: string;
};

// Mounts the analytics app into any element of your existing website.
// Returns an unmount function for cleanup.
//
//   import { mountApacApp } from "apac-sourcing/embed";
//   const unmount = mountApacApp(document.getElementById("analytics"), {
//     basename: "/analytics",
//   });
//
export function mountApacApp(el: HTMLElement, opts: MountOptions = {}): () => void {
  const root: Root = createRoot(el);
  root.render(
    <StrictMode>
      <BrowserRouter basename={opts.basename}>
        <CurrencyProvider>
          <TradeDataProvider>
            <App />
          </TradeDataProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </StrictMode>,
  );
  return () => root.unmount();
}
