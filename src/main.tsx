import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/Auth";
import { CurrencyProvider } from "./context/Currency";
import { ChatProvider } from "./context/Chat";
import "./index.css";

// Router basename, so the app works whether it is deployed at the site root
// (platform.apacss.com) or under a subpath (apacss.com/platform). Vite sets
// BASE_URL from the `base` option (VITE_BASE_PATH); trailing slash trimmed.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <CurrencyProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
