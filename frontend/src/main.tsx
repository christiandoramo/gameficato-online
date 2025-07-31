// frontend/src/main.tsx
// import 'antd/dist/reset.css';
import "./index.css";
import App from "./App";
import { GlobalProvider } from "./lib/contexts/globalContext";
import { ThemeProvider } from "./lib/contexts/themeContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GlobalProvider>
  </StrictMode>
);
