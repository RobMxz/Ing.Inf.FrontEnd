import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./class";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
    <Toaster />
  </StrictMode>
);
