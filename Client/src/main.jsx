import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ContractProvider } from "./context/contractContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ContractProvider> 
        <App />
      </ContractProvider>
    </BrowserRouter>
  </StrictMode>
);
