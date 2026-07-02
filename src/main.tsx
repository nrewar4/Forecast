import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TradeDataProvider } from "./context/TradeData";
import { CurrencyProvider } from "./context/Currency";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <TradeDataProvider>
          <App />
        </TradeDataProvider>
      </CurrencyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
