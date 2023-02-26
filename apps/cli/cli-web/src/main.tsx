import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";
import { ApiTRPCProvider } from "./utils/api-wrapper";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApiTRPCProvider>
      <AppRouter />
    </ApiTRPCProvider>
  </React.StrictMode>
);
