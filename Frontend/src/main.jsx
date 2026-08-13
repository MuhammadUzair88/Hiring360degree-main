import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApplicationProvider } from "./context/ApplicationContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import PageTitleManager from "./components/common/PageTitleManager";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PageTitleManager />
      <ToastProvider>
        <AuthProvider>
          <ApplicationProvider>
            <App />
          </ApplicationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
