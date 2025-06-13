import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {ThemeProvider} from "@/components/ui/theme-provider.tsx";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
  </React.StrictMode>,
);
 