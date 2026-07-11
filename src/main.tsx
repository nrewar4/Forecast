import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/Auth";
import { TradeDataProvider } from "./context/TradeData";
import { CurrencyProvider } from "./context/Currency";
import { ChatProvider } from "./context/Chat";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <TradeDataProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </TradeDataProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
