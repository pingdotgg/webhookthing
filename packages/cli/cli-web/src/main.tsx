import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ApiTRPCProvider } from "./utils/api-wrapper";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApiTRPCProvider>
      <App />
    </ApiTRPCProvider>
  </React.StrictMode>
);
